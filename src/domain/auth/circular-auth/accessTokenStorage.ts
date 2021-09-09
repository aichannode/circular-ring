import { Storage } from "@core/storage";
import { AccessToken } from "@domain/auth/circular-auth/accessToken";

const accessTokenStorageKey = "@accessToken";
const accessTokenDateStorageKey = "@accessTokenDate";

export class AccessTokenStorage {
	save(accessToken: AccessToken, tokenDate: number) {
		return Promise.all([
			Storage.save<AccessToken>(accessTokenStorageKey, accessToken),
			Storage.save<number>(accessTokenDateStorageKey, tokenDate),
		]);
	}

	load() {
		return Promise.all([
			Storage.load<AccessToken>(accessTokenStorageKey),
			Storage.load<number>(accessTokenDateStorageKey),
		]);
	}

	remove() {
		return Promise.all([Storage.remove(accessTokenStorageKey), Storage.remove(accessTokenDateStorageKey)]);
	}
}
