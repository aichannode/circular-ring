import { Storage } from "@core/storage";
import { I_AppState } from "./type";

const appStateStorageKey = "@appState";

export class AppStateStorage {
	save(data: I_AppState) {
		return Storage.save(appStateStorageKey, data);
	}

	load() {
		return Storage.load<I_AppState>(appStateStorageKey);
	}
}
