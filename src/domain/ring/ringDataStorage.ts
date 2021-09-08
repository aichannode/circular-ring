import { Storage } from "@core/storage";

const ringDataStorageKey = "@ringData";

export class RingDataStorage {
	async push(ringData: string) {
		const existingData = (await this.load()) ?? "";

		return Storage.save<string>(ringDataStorageKey, existingData + ringData);
	}

	load() {
		return Storage.load<string>(ringDataStorageKey);
	}

	clear() {
		return Storage.remove(ringDataStorageKey);
	}
}
