import { Storage } from "@core/storage";
import { NamedDevice } from "./namedDevice";

const favoriteDeviceStorageKey = "@favoriteDevice";

export class FavoriteDeviceStorage {
	save(device: NamedDevice) {
		return Storage.save<NamedDevice>(favoriteDeviceStorageKey, device);
	}

	load() {
		return Storage.load<NamedDevice>(favoriteDeviceStorageKey);
	}

	clear() {
		return Storage.remove(favoriteDeviceStorageKey);
	}
}
