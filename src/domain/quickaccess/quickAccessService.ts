import { observable } from "micro-observables";
import { I_QuickAccess } from "./quickAccess";
import { QuickAccessStorage, IsInSleepModeStorage } from "./quickAccessStorage";

export class UserQuickAccess {
	quickaccess = observable<I_QuickAccess>({ active: [], disabled: [] });
	private _isInSleepMode = observable(false);

	readonly isInSleepMode = this._isInSleepMode.readOnly();

	constructor(
		private readonly quickaccessStorage: QuickAccessStorage,
		private readonly isInSleepModeStorage: IsInSleepModeStorage
	) {}

	async init() {
		const data = await this.quickaccessStorage.load();
		const sleepMode = await this.isInSleepModeStorage.load();
		console.log("INIT SLEEP MODE", sleepMode);

		if (sleepMode) {
			this._isInSleepMode.set(sleepMode);
		}

		if (data) {
			const { active, disabled } = data;
			this.quickaccess.set({ active, disabled });
		}
	}

	update({ active, disabled }: I_QuickAccess) {
		console.log("## UPDATE", active, disabled);
		this.quickaccess.update(() => ({ active, disabled }));
		this.quickaccessStorage.save({ active, disabled });
	}

	async setSleepMode(value: boolean) {
		this._isInSleepMode.set(value);
		await this.isInSleepModeStorage.save(value);
	}
}
