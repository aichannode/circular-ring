import { Storage } from "@core/storage";
import { UserRing } from "./ring";

const userRingsStorageKey = "@userRings";

export class UserRingsStorage {
	save(rings: UserRing[]) {
		return Storage.save(userRingsStorageKey, rings);
	}

	async load() {
		const dtos = await Storage.load<UserRingDto[]>(userRingsStorageKey);
		return dtos?.map((ring) => ({ ...ring, lastSyncDate: new Date(ring.lastSyncDate) }));
	}
}

interface UserRingDto extends Omit<UserRing, "lastSyncDate"> {
	lastSyncDate: string;
}
