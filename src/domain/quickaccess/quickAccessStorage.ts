import { Storage } from "@core/storage";
import { I_QuickAccess } from "./quickAccess";

const userQuickAccessStorageKey = "@userQuickAccess1";

export class QuickAccessStorage {
	save(data: I_QuickAccess) {
		return Storage.save(userQuickAccessStorageKey, data);
	}

	load() {
		return Storage.load<I_QuickAccess>(userQuickAccessStorageKey);
	}
}
