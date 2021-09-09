import { Storage } from "@core/storage";

const ringDataStorageKey = "@ringData";

export class RingDataStorage {
	async save(ringData: string) {
		return Storage.save<string>(ringDataStorageKey, ringData);
	}

	load() {
		return Storage.load<string>(ringDataStorageKey);
	}

	clear() {
		return Storage.remove(ringDataStorageKey);
	}
}
