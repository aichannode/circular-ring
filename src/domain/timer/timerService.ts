import { BleDeviceService } from "@domain/device/bleDeviceService";
import { Melody, serializeMelody } from "@domain/ring/ringAlarm";
import { observable } from "micro-observables";
import moment from "moment";
import BackgroundTimer from "react-native-background-timer";
import { I_Timer } from "./timer";

export class TimerService {
	timer = observable<I_Timer>({
		status: "stop",
		remainingSecondes: 0,
		startDate: null,
		endDate: null,
		initialRemainingTime: 0,
	});

	constructor(private readonly deviceService: BleDeviceService) {}

	play(remainingSecondes: number) {
		this.deviceService.write("TMR" + remainingSecondes);
		this.timer.set({
			status: "play",
			remainingSecondes: remainingSecondes,
			startDate: moment(),
			endDate: moment().add(remainingSecondes, "seconds"),
			initialRemainingTime: remainingSecondes,
		});
		BackgroundTimer.runBackgroundTimer(() => {
			this.timer.update((previousState) => {
				const { status, remainingSecondes, startDate, endDate, initialRemainingTime } = previousState;

				if (remainingSecondes <= 0 && status === "play") {
					BackgroundTimer.stopBackgroundTimer();
					return { status: "stop", remainingSecondes: 0, startDate: null, endDate: null, initialRemainingTime: 0 };
				}
				if (status === "play" && endDate) {
					return {
						status: "play",
						remainingSecondes: endDate.diff(startDate, "seconds"),
						startDate: moment(),
						endDate,
						initialRemainingTime,
					};
				}
				return previousState;
			});
		}, 100);
	}

	stop() {
		BackgroundTimer.stopBackgroundTimer();
		this.timer.update(() => ({
			status: "stop",
			remainingSecondes: 0,
			startDate: null,
			endDate: null,
			initialRemainingTime: 0,
		}));
		this.deviceService.write("TMR0");
	}

	pause() {
		this.deviceService.write("TMR0");
		BackgroundTimer.stopBackgroundTimer();
		this.timer.update((previousState) => {
			const { remainingSecondes, startDate, endDate, initialRemainingTime } = previousState;
			return {
				status: "pause",
				remainingSecondes,
				startDate,
				endDate,
				initialRemainingTime,
			};
		});
	}

	playMelody(melody: Melody, power: number) {
		return this.deviceService.write(serializeMelody(melody, power));
	}
}
