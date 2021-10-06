import { Storage } from "@core/storage";
import { StoredDevice } from "./device";

const favoriteDeviceStorageKey = "@favoriteDevice";

export class FavoriteDeviceStorage {
	save(device: StoredDevice) {
		return Storage.save<StoredDevice>(favoriteDeviceStorageKey, device);
	}

	load() {
		return Storage.load<StoredDevice>(favoriteDeviceStorageKey);
	}

	clear() {
		return Storage.remove(favoriteDeviceStorageKey);
	}
}
