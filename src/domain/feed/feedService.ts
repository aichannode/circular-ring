import { Observable, observable } from "micro-observables";
import { FeedNotification, FeedRecommendation } from "./type";
import { FeedApi } from "./feedApi";
import { FeedStorage } from "./feedStorage";

export class FeedService {
	private serverNotifications = observable<FeedNotification[]>([]);
	private clientSideClosedNotificationsIds = observable<number[]>([]);

	notifications: Observable<FeedNotification[]>
	recommendations = observable<FeedRecommendation[]>([]);
	
	constructor(private readonly notificationStorage: FeedStorage, private readonly feedApi: FeedApi) {
		// This is a little optimistic UI for the notification.
		// This compute a view of the notifications.
		// It get the server notifications and remove closed notifications which are on the client side.
		this.notifications = Observable.select(
			[this.serverNotifications, this.clientSideClosedNotificationsIds],
			(entities, ids) => entities.filter((entity) => !ids.includes(entity.id))
		);
	}

	async init() {
		const infos = await this.notificationStorage.load();
		if (infos) {
			this.clientSideClosedNotificationsIds.set(infos.clientSideClosed);
		}
	}

	async fetchRecommendations() {
		this.feedApi.fetchRecommendations().then(r => this.recommendations.set(r))
	}

	async fetchNotifications() {
		this.feedApi.fetchNotifications().then(n => this.serverNotifications.set(n))
	}

	async fetchAll() {
		return Promise.all([this.fetchRecommendations(), this.fetchNotifications()])
	}

	_DEBUG_reset = async () => {
		console.log('reset')
		this.notificationStorage.save([])
		this.clientSideClosedNotificationsIds.set([])
		await this.feedApi._DEBUG_insertData();
		this.fetchNotifications()
	}

	/**
	 * Processus for closing a notification.
	 * As long as we haven't checked the server data again. We maintain the "closed" state
	 * of the local notification (on storage). This prevents to have banner "blinking",
	 * for example, when before the server has closed the notification and we
	 * receive a feed update. The banner would "blink": closed-> open-> closed.
	 * During the next refetch we see if the notification has been removed. If so, we also remove it from our storage.
	 */
	closeNotification(id: number) {
		this.clientSideClosedNotificationsIds.update(ids => [...ids, id])
		// side effect (fire and forget)
		this.feedApi.closeNotification([id])
		// now, refetch the notifications to sync with the server
		this.fetchAll()
			// Remove all ID from the closed notification buffer in the storage which are no longer present on the server.
			.then(() => {
				const serverNotificationsIds = this.serverNotifications.get().map(({id}) => id)
				 // keep notification which are still on the server
				this.clientSideClosedNotificationsIds.update(ids => ids.filter(id => serverNotificationsIds.includes(id)))
				// store the remaining ids which are not close yet on the server
				this.notificationStorage.save(this.clientSideClosedNotificationsIds.get())
			})
		
	}
}
