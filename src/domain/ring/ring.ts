export interface UserRing {
	id: string;
	firmware: string;
	userId: number;
	lastSyncDate: Date;
}

export interface NamedUserRing extends UserRing {
	name?: string;
}
