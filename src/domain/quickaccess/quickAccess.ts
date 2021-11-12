export interface I_Active {
	title: string;
	desc: string;
	id: string;
}

export interface I_QuickAccess {
	active: I_Active[];
	disabled: I_Active[];
}
