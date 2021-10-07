import { Storage } from "@core/storage";
import { NamedUserRing } from "./ring";

const userRingsStorageKey = "@userRings";

export class UserRingsStorage {
	save(rings: NamedUserRing[]) {
		return Storage.save(userRingsStorageKey, rings);
	}

	async load() {
		const dtos = await Storage.load<NamedUserRingDto[]>(userRingsStorageKey);
		return dtos?.map((ring) => ({ ...ring, lastSyncDate: new Date(ring.lastSyncDate) }));
	}
}

interface NamedUserRingDto extends Omit<NamedUserRing, "lastSyncDate"> {
	lastSyncDate: string;
}
