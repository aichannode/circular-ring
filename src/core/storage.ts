import AsyncStorage from "@react-native-async-storage/async-storage";

export class StorageStatic {
	getAllKeys(): Promise<string[]> {
		return AsyncStorage.getAllKeys();
	}

	async getAllIdsForKey(key: string): Promise<string[]> {
		const ids: string[] = [];
		const keyPrefix = `${key}/`;
		for (const key of await this.getAllKeys()) {
			if (key.startsWith(keyPrefix)) {
				ids.push(key.slice(keyPrefix.length));
			}
		}
		return ids;
	}

	async load<T>(key: string): Promise<T | null> {
		const jsonStr = await AsyncStorage.getItem(key);
		return jsonStr !== null ? (JSON.parse(jsonStr) as T) : null;
	}

	async loadWithId<T>(key: string, id: string | number): Promise<T | null> {
		return this.load(`${key}/${id}`);
	}

	save<T>(key: string, json: T): Promise<void> {
		return AsyncStorage.setItem(key, JSON.stringify(json));
	}

	saveWithId<T>(key: string, id: string | number, json: T): Promise<void> {
		return this.save(`${key}/${id}`, json);
	}

	remove(key: string): Promise<void> {
		return AsyncStorage.removeItem(key);
	}

	removeWithId(key: string, id: string | number): Promise<void> {
		return this.remove(`${key}/${id}`);
	}
	multiRemove(key: string[]): Promise<void> {
		return AsyncStorage.multiRemove(key);
	}
}

export const Storage = new StorageStatic();
