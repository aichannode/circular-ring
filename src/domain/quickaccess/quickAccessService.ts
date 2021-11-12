import { observable } from "micro-observables";
import { I_QuickAccess } from "./quickAccess";
import { QuickAccessStorage } from "./quickAccessStorage";

export class UserQuickAccess {
	quickaccess = observable<I_QuickAccess>({ active: [], disabled: [] });

	constructor(private readonly quickaccessStorage: QuickAccessStorage) {}

	async init() {
		const data = await this.quickaccessStorage.load();
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
}
