export interface UserRing {
	id: string;
	firmware?: string;
	userId?: number;
	ringId?: string;
	lastSyncDate?: Date;
	connected?: boolean;
}

export interface NamedUserRing extends UserRing {
	name?: string;
}
