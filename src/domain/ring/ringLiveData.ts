export interface RingLiveData {
	heartRate: number;
	spo2: number;
	hrv: number;
	maxHeartRate: number;
}

export function deserializeLiveData(liveData: string) {
	const liveDataMessageRegex = /FBL(\w\w\w\w\w\w\w\w)(\w\w)(\w\w)(\w\w)(\w\w)(\w\w)/;
	const matches = liveData.match(liveDataMessageRegex);

	if (liveData === "FBLEOS") {
		return;
	}
	if (!matches) {
		throw Error("Invalid live data message " + liveData);
	}

	const [time, type, heartRateHex, spo2HHex, spo2LHex, hrvHex] = matches.slice(1);

	if (type === "00") {
		const heartRate = +`0x${heartRateHex}`;
		const spo2 = +`0x${spo2HHex}` + +`0x${spo2LHex}`;
		const hrv = +`0x${hrvHex}`;
		return {
			heartRate,
			spo2,
			hrv,
		};
	}
}

export enum Intensity {
	HIGH = "HIGH",
	MEDIUM = "MEDIUM",
	LOW = "LOW",
	NONE = "NONE",
}

export function getIntensity(ratio: number | null) {
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
