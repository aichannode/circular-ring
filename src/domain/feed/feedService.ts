import { Observable, observable } from "micro-observables";
import { FeedNotification, FeedRecommendation, InputAnswer, InputType, UserInputStates, UserInputState } from "./type";
import { FeedApi } from "./feedApi";
import { FeedStorage } from "./feedStorage";
import { removeStaleLocalAnswers, reconciliate, getStaleLocalUserInputStates } from "./business";
import moment from "moment";

export class FeedService {
	private serverNotifications = observable<FeedNotification[]>([]);
	private localyClosedNotificationsIds = observable<number[]>([]);

	private serverRecommandations = observable<FeedRecommendation[]>([]);
	private localyAnsweredQuestions = observable<UserInputStates>([]);
	// Store the last fetch time for conflict resolution
	private lastFetchedAt = {
		notifications: NaN,
		recommandations: NaN,
	};

	notifications: Observable<FeedNotification[]>;
	recommendations: Observable<FeedRecommendation[]>;

	constructor(private readonly feedStorage: FeedStorage, private readonly feedApi: FeedApi) {
		// This is a little optimistic UI mechanism for the feed.
		// This compute a view for the notifications and another view for the recommandations which
		// - gets the server notifications and remove closed notifications which are on the client side.
		// - gets the server recommandations and update the answers from the most recent source
		this.notifications = Observable.select(
			[this.serverNotifications, this.localyClosedNotificationsIds],
			(serverNotifications, localyClosedIds) => {
				// Exit if no data has been fetched yet
				if (Number.isNaN(this.lastFetchedAt.notifications)) {
					return [];
				}
				// TODO logic will be impacted with offline mode.
				// We will need a timestamp on wher the notification was read
				return serverNotifications.filter((entity) => !localyClosedIds.includes(entity.id));
			}
		);
		this.recommendations = Observable.select(
			[this.serverRecommandations, this.localyAnsweredQuestions],
			(serverRecommandations, localAnswers) => {
				// Exit if no data has been fetched yet
				if (Number.isNaN(this.lastFetchedAt.recommandations)) {
					return [];
				}

				// Merge server recommandations with local state
				return serverRecommandations.map(reconciliate(localAnswers));
			}
		);

		// Reaction which clean the local recommandations cache after a fetch
		this.serverRecommandations.subscribe((serverRecos) => {
			// Update locale state
			const staleUserInputStates = getStaleLocalUserInputStates(this.localyAnsweredQuestions.get(), serverRecos);
			removeStaleLocalAnswers(staleUserInputStates, serverRecos, this.feedStorage);
			this.localyAnsweredQuestions.update((state) => {
				return state.filter(({ id }) => !staleUserInputStates.some((s) => s.id === id));
			});
		});
	}

	/**
	 * Load current client storage value
	 * of the notification and recommandations
	 */
	async init() {
		const [infos, recos] = await Promise.all([
			this.feedStorage.loadNotificationsState(),
			this.feedStorage.loadRecommendationsState(),
		]);
		if (infos) {
			this.localyClosedNotificationsIds.set(infos.clientSideClosed);
		}
		if (recos) {
			this.localyAnsweredQuestions.set(recos);
		}
	}

	async fetchRecommendations() {
		this.lastFetchedAt.recommandations = Date.now();
		await this.feedApi.fetchRecommendations().then((r) => this.serverRecommandations.set(r));
	}

	async fetchNotifications() {
		this.lastFetchedAt.notifications = Date.now();
		await this.feedApi.fetchNotifications().then((n) => this.serverNotifications.set(n));
	}

	async fetchAll() {
		return Promise.all([this.fetchRecommendations(), this.fetchNotifications()]);
	}

	_DEBUG_reset = async () => {
		this.feedStorage.saveNotificationsState([]);
		this.localyClosedNotificationsIds.set([]);
		await this.feedApi._DEBUG_insertData();
		this.fetchNotifications();
	};

	/**
	 * Processus for closing a notification.
	 * As long as we haven't checked the server data again. We maintain the "closed" state
	 * of the local notification (on storage). This prevents to have banner "blinking",
	 * for example, when before the server has closed the notification and we
	 * receive a feed update. The banner would "blink": closed-> open-> closed.
	 * During the next refetch we see if the notification has been removed. If so, we also remove it from our storage.
	 */
	closeNotification(id: number) {
		this.localyClosedNotificationsIds.update((ids) => [...ids, id]);
		// TODO turn into reaction to the above update
		// add the newly closed notification to the state buffer
		this.feedStorage.saveNotificationsState([...this.localyClosedNotificationsIds.get(), id]);
		// TODO turn into reaction to the above update
		// side effect (fire and forget)
		this.feedApi.closeNotification([id]);
		// now, refetch the notifications to sync with the server
		this.fetchNotifications()
			// Remove all ID from the closed notification buffer in the storage which are no longer present on the server.
			.then(() => {
				const serverNotificationsIds = this.serverNotifications.get().map(({ id }) => id);
				// keep notifications which are still on the server
				this.localyClosedNotificationsIds.update((ids) => ids.filter((id) => serverNotificationsIds.includes(id)));
				// store the remaining ids which are not close yet on the server
				this.feedStorage.saveNotificationsState(this.localyClosedNotificationsIds.get());
			});
	}

	/**
	 * When the user answer to a user input component, the result will be cached on the client
	 * until fetching recommandations again.
	 * Then we clear answers that has been taken in account to the server.
	 */
	answerRecommendation(componentId: number, answer: InputAnswer<InputType.SELECT>) {
		// CIR-429 need at least one option
		if (!answer.length) return;
		const answeredAt = moment().utc().toISOString();
		const userInputState = { id: componentId, answeredAt, answer };
		// Upsert the anwser in the locale state
		this.localyAnsweredQuestions.update((state) => {
			const reco = state.find(({ id: _id }) => _id === componentId) as UserInputState<InputType.SELECT> | undefined;
			if (reco) {
				reco.answer = [...answer];
				reco.answeredAt = answeredAt;
			} else {
				state.push(userInputState);
			}
			return state;
		});
		// TODO turn into reaction to the above update
		// Update locale storage
		this.feedStorage.saveRecommendationState(userInputState);
		// TODO turn into reaction to the above update
		// side effect (fire and forget)
		this.feedApi
			.answerQuestion(answer)
			// now, refetch the notifications to sync with the server
			.then(this.fetchRecommendations.bind(this));
	}
}
