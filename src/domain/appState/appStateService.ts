import { AppStateStorage } from "./appStateStorage";
import { observable } from "micro-observables";
import { I_AppState, I_QuickAccess } from "./type";

export class AppStateService {
	quickaccess = observable<I_QuickAccess>({ active: [], disabled: [] });
	private _appState = observable<I_AppState | null>(null);
	private _isInSleepMode = observable<boolean | undefined>(false);

	readonly isInSleepMode = this._isInSleepMode.readOnly();

	constructor(private readonly AppStateStorage: AppStateStorage) {}

	async init() {
		const appState = await this.AppStateStorage.load();
		if (appState) this._appState.set(appState);
		if (appState?.isInSleepMode) this._isInSleepMode.set(appState?.isInSleepMode);
		if (appState?.quickAccess) {
			const { active, disabled } = appState.quickAccess;
			this.quickaccess.set({ active, disabled });
		}
	}

	updateQuickaccess({ active, disabled }: I_QuickAccess) {
		console.log("## UPDATE", active, disabled);
		this.quickaccess.update(() => ({
			active,
			disabled,
		}));
		if (this._appState) this.AppStateStorage.save({ ...this._appState.get(), quickAccess: this.quickaccess.get() });
	}

	async updateSleepMode(value: boolean) {
		this._isInSleepMode.set(value);
		if (this._appState) this.AppStateStorage.save({ ...this._appState.get(), isInSleepMode: value });
	}
}
