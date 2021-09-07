import { Storage } from "@core/storage";
import { User } from "@domain/user/user";

const userStorageKey = "@user";

export class UserStorage {
	save(user: User) {
		return Storage.save<User>(userStorageKey, user);
	}

	load() {
		return Storage.load<User>(userStorageKey);
	}

	remove() {
		return Storage.remove(userStorageKey);
	}
}
