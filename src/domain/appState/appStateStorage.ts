import { Storage } from "@core/storage";
import { I_AppState } from "./type";

const appStateStorageKey = "@appState";

export class AppStateStorage {
	async save(data: I_AppState) {
		return Storage.save(appStateStorageKey, data);
	}

	async load(): Promise<I_AppState | null> {
		return await Storage.load<I_AppState>(appStateStorageKey);
	}
}
