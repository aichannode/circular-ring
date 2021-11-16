import { observable } from "micro-observables";
import { I_Timer } from "./timer";
import BackgroundTimer from "react-native-background-timer";
import moment from "moment";
import { BleDeviceService } from "@domain/device/bleDeviceService";
import { Melody, serializeMelody } from "@domain/ring/ringAlarm";

export class TimerService {
	timer = observable<I_Timer>({ status: "stop", remainingSecondes: 0, startDate: null, endDate: null });

	constructor(private readonly deviceService: BleDeviceService) {}

	play(remainingSecondes: number) {
		console.log("## Play", remainingSecondes);
		this.timer.set({
			status: "play",
			remainingSecondes: remainingSecondes,
			startDate: moment(),
			endDate: moment().add(remainingSecondes, "seconds"),
		});
		BackgroundTimer.runBackgroundTimer(() => {
			this.timer.update((previousState) => {
				const { status, remainingSecondes, startDate, endDate } = previousState;

				if (remainingSecondes <= 0 && status === "play") {
					console.log("VIBRATE");
					console.log("status", status);
					this.playMelody(Melody.SOS, 32);
					BackgroundTimer.stopBackgroundTimer();
					return { status: "stop", remainingSecondes: 0, startDate: null, endDate: null };
				}
				if (status === "play" && endDate) {
					return {
						status: "play",
						remainingSecondes: endDate.diff(startDate, "seconds"),
						startDate: moment(),
						endDate,
					};
				}
				return previousState;
			});
		}, 100);
	}

	stop() {
		BackgroundTimer.stopBackgroundTimer();
		this.timer.update(() => ({ status: "stop", remainingSecondes: 0, startDate: null, endDate: null }));
	}

	pause() {
		BackgroundTimer.stopBackgroundTimer();
		this.timer.update((previousState) => {
			const { remainingSecondes, startDate, endDate } = previousState;
			return {
				status: "pause",
				remainingSecondes,
				startDate,
				endDate,
			};
		});
	}

	playMelody(melody: Melody, power: number) {
		return this.deviceService.write(serializeMelody(melody, power));
	}
}
