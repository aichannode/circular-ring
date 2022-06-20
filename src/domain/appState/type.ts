import { CalendarTag } from "@domain/calendar/calendar";
import { CircleEntity } from "@domain/circles/type";
import { NamedUserRing } from "@domain/ring/ring";

export interface I_QuickAccessElem {
	title: string;
	desc: string;
	id: string;
}

export interface I_QuickAccess {
	active: I_QuickAccessElem[];
	disabled: I_QuickAccessElem[];
}

export const LAST_TAGS_SIZE = 14;

export interface I_AppState {
	quickAccess: I_QuickAccess;
	isInSleepMode: boolean;
	lastUsedTags: CalendarTag[];
	defaultCircles: CircleEntity[];
	userRings: NamedUserRing[];
	userCircles: CircleEntity[];
	waitForRingRegistration: boolean;
	showLiveCircleWaringBottomSheet: boolean;
}
