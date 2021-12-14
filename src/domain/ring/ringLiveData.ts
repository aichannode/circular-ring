import { Sex } from "./../user/user";
export interface RingLiveData {
	heartRate?: number;
	spo2?: number;
	hrv?: number;
	correlation: number;
	maxHeartRate?: number;
}

export function deserializeLiveData(liveData: string) {
	const liveDataMessageRegex =
		/FBL(\w\w\w\w\w\w\w\w)(\w\w)(\w\w)(\w\w\w\w)(\w\w)(\w\w)(\w\w\w\w)(\w\w\w\w)(\w\w)(\w\w\w\w)/;
	const matches = liveData.match(liveDataMessageRegex);

	console.log("LIve DATA matches => ", matches);

	if (liveData === "FBLEOS") {
		return;
	}
	if (!matches) {
		throw Error("Invalid live data message " + liveData);
	}

	const [, type, heartRateHex, spo2Hex, hrvHex, , , , , correlHex] = matches.slice(1);

	if (type === "00") {
		const correlation = hexToSint16(correlHex);
		const heartRate = +`0x${heartRateHex}`;
		const spo2 = hexToSint16(spo2Hex) / 100;
		const hrv = +`0x${hrvHex}`;

		console.log(`Live DATA => correlation : ${correlation} heartRate : ${heartRate} spo2 : ${spo2} hrv : ${hrv}`);

		return {
			heartRate,
			spo2,
			hrv,
			correlation,
		};
	}
}

export enum Intensity {
	HIGH = "HIGH",
	MEDIUM = "MEDIUM",
	LOW = "LOW",
	NONE = "NONE",
}

export function getMaxHr(sex: Sex | undefined, age: number | undefined, hr: number | undefined) {
	console.log("sex", sex, "hr", hr);
	if (sex === undefined || age === undefined || hr === undefined) return hr;
	if (sex === "female") return (hr / (201 - 0.63 * age)) * 100;
	return (hr / (208 - 0.8 * age)) * 100;
}

export function getIntensity(ratio: number | null | undefined) {
	return ratio
		? ratio > 70
			? Intensity.HIGH
			: ratio > 55
			? Intensity.MEDIUM
			: ratio > 40
			? Intensity.LOW
			: Intensity.NONE
		: Intensity.NONE;
}

function hexToSint16(str: string) {
	const n = parseInt(str, 16);
	return (n & 0x8000) > 0 ? n - 0x10000 : n;
}

export const CORRELATION_GOOD_THRESHOLD = 60;
export const CORRELATION_OPTIMAL_THRESHOLD = 90;
