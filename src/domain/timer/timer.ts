import moment from "moment";
export interface I_Timer {
	status: string;
	remainingSecondes: number;
	startDate: moment.Moment | null;
	endDate: moment.Moment | null;
	initialRemainingTime: number;
}
