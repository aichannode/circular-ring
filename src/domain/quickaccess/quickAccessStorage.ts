import { Storage } from "@core/storage";
import { I_QuickAccess } from "./quickAccess";

const userQuickAccessStorageKey = "@userQuickAccess";

export class QuickAccessStorage {
	save(data: any) {
		return Storage.save(userQuickAccessStorageKey, data);
	}

	load() {
		return Storage.load<I_QuickAccess>(userQuickAccessStorageKey);
	}
}
