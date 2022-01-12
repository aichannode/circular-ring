export interface I_QuickAccessElem {
	title: string;
	desc: string;
	id: string;
}

export interface I_QuickAccess {
	active: I_QuickAccessElem[];
	disabled: I_QuickAccessElem[];
}

export interface I_AppState {
	quickAccess?: I_QuickAccess | undefined;
	isInSleepMode?: boolean | undefined;
}
