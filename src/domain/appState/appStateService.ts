import { CalendarTag } from "@domain/calendar/calendar";
import { CircleEntity } from "@domain/circles/type";
import { NamedUserRing } from "@domain/ring/ring";
import produce from "immer";
import { observable } from "micro-observables";
import { AppStateStorage } from "./appStateStorage";
import { I_AppState, I_QuickAccess, LAST_TAGS_SIZE } from "./type";

export class AppStateService {
	isInSleepMode = observable<boolean>(false);
	quickAccess = observable<I_QuickAccess>({
		disabled: [],
		active: [],
	});
	lastUsedTags = observable<CalendarTag[]>([]);
	userRings = observable<NamedUserRing[]>([]);
	// inital feed elements loaded
	recommendationsCount = observable<number>(10);
	userCircles = observable<CircleEntity[]>([]);
	defaultCircles = observable<CircleEntity[]>([]);
	waitForRingRegistration = observable(false);
	showLiveCircleWaringBottomSheet = observable(true);
	hasReachedHomeScreen = observable(false);
	showUpdateBanner = observable({ display: false, firmwareVersion: "" });
	performanceMode = observable<boolean>(false);
	showDataRatePopup = observable<boolean>(true);

	private get appState(): I_AppState {
		return {
			isInSleepMode: this.isInSleepMode.get(),
			quickAccess: this.quickAccess.get(),
			lastUsedTags: this.lastUsedTags.get(),
			userCircles: this.userCircles.get(),
			defaultCircles: this.defaultCircles.get(),
			userRings: this.userRings.get(),
			waitForRingRegistration: this.waitForRingRegistration.get(),
			showLiveCircleWaringBottomSheet: this.showLiveCircleWaringBottomSheet.get(),
			showUpdateBanner: this.showUpdateBanner.get(),
			showDataRatePopup: this.showDataRatePopup.get(),
			performanceMode: this.performanceMode.get(),
		};
	}

	constructor(private readonly AppStateStorage: AppStateStorage) {}

	private hydrate(state: I_AppState) {
		this.lastUsedTags.set(state.lastUsedTags);
		this.quickAccess.set(state.quickAccess);
		this.isInSleepMode.set(state.isInSleepMode);
		this.userRings.set(state.userRings);
		this.userCircles.set(state.userCircles);
		this.defaultCircles.set(state.defaultCircles);
		this.showLiveCircleWaringBottomSheet.set(state.showLiveCircleWaringBottomSheet);
		this.showUpdateBanner.set(state.showUpdateBanner);
		this.showDataRatePopup.set(state.showDataRatePopup);
		this.performanceMode.set(state.performanceMode);
	}

	async reset() {
		this.isInSleepMode.set(false);
		this.quickAccess.set({
			disabled: [],
			active: [],
		});
		this.lastUsedTags.set([]);
		this.userRings.set([]);
		this.recommendationsCount.set(3);
		this.userCircles.set([]);
		this.defaultCircles.set([]);
		this.showLiveCircleWaringBottomSheet.set(true);
		this.hasReachedHomeScreen.set(false);
		this.showUpdateBanner.set({ display: false, firmwareVersion: "" });
		this.performanceMode.set(false);
		this.showDataRatePopup.set(true);
	}

	async init() {
		const lastState = await this.AppStateStorage.load();
		if (lastState) {
			this.hydrate(lastState);
		}
		/**
		 * Start side effects watchers
		 * - persist app state after update
		 */
		this.lastUsedTags.subscribe(() => this.AppStateStorage.save(this.appState));
		this.quickAccess.subscribe(() => this.AppStateStorage.save(this.appState));
		this.isInSleepMode.subscribe(() => this.AppStateStorage.save(this.appState));
		this.userCircles.subscribe(() => this.AppStateStorage.save(this.appState));
		this.userRings.subscribe(() => this.AppStateStorage.save(this.appState));
		this.defaultCircles.subscribe(() => this.AppStateStorage.save(this.appState));
		this.showLiveCircleWaringBottomSheet.subscribe(() => this.AppStateStorage.save(this.appState));
		this.showUpdateBanner.subscribe(() => this.AppStateStorage.save(this.appState));
		this.showDataRatePopup.subscribe(() => this.AppStateStorage.save(this.appState));
		this.performanceMode.subscribe(() => this.AppStateStorage.save(this.appState));
	}

	updateQuickaccess({ active, disabled }: I_QuickAccess) {
		this.quickAccess.update(() => ({
			active,
			disabled,
		}));
	}

	async updateSleepMode(value: boolean) {
		this.isInSleepMode.set(value);
	}

	//////////////////////////////////////////
	// Note for future refactor to SAM pattern
	// All further methods acts like mutators
	//////////////////////////////////////////
	/**
	 * Add a tag to the list
	 * @implements CIR-402: maintain a list with a maximum length of 14 items
	 */
	mutator_addLastUsedTag = (tag: CalendarTag) => {
		const lastUsedTags = this.lastUsedTags.get();
		// Acceptor
		// No special condiction here
		this.lastUsedTags.set(
			produce(lastUsedTags, function (mLastUsedTags) {
				const currentTagIndex = mLastUsedTags.findIndex((t) => t.id === tag.id);
				// There is already this tag in the queue. Reorder.
				if (currentTagIndex > -1) {
					mLastUsedTags.splice(currentTagIndex, 1);
				}
				// CIR-402: maintain a list with a maximum length of 14 items
				else if (mLastUsedTags.length >= LAST_TAGS_SIZE) {
					mLastUsedTags.pop();
				}
				mLastUsedTags.unshift(tag);
			})
		);
	};
}
