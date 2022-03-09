import moment from "moment";

export function isYesterday(dateIso: string, todayIso: string) {
	const today = moment(todayIso).startOf("day");
	const date = moment(dateIso);
	const yesterday = today.subtract(1, "days");
	return date.isSame(yesterday, "d");
}

export function isToday(dateIso: string, todayIso: string) {
	const today = moment(todayIso).startOf("day");
	const date = moment(dateIso);
	return date.isSame(today, "d");
}
