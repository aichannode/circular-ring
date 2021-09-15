export interface RingLiveData {
	heartRate: number;
	spo2: number;
	hrv: number;
}

export function deserializeLiveData(liveData: string) {
	const liveDataMessageRegex = /FB(\w\w\w\w\w\w\w\w)(\w\w)(\w\w)(\w\w)(\w\w)(\w\w)/;
	const matches = liveData.match(liveDataMessageRegex);

	if (!matches) {
		throw Error("Invalid live data message " + liveData);
	}

	const [time, type, heartRate, spo2H, spo2L, hrv] = matches.slice(1);

	if (type === "01") {
		return {
			heartRate: +`0x${heartRate}`,
			spo2: +`0x${spo2H}` + +`0x${spo2L}`,
			hrv: +`0x${hrv}`,
		};
	}
}
