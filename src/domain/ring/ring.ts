export interface UserRing {
	id: string;
	firmware: string;
	userId: number;
	lastSyncDate: Date;
	connected?: boolean;
}

export interface NamedUserRing extends UserRing {
	name?: string;
}
