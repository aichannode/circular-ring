import { observable } from "micro-observables";
import { I_Timer } from "./timer";
import BackgroundTimer from "react-native-background-timer";

export class TimerService {
	timer = observable<I_Timer>({ status: "stop", remainingSecondes: 0 });

	play(remainingSecondes: number) {
		console.log("## Play", remainingSecondes);
		this.timer.set({ status: "play", remainingSecondes: remainingSecondes });
		BackgroundTimer.runBackgroundTimer(() => {
			this.timer.update((previousState) => {
				// console.log("## Play", previousState.remainingSecondes);
				if (previousState.status === "play") {
					return {
						status: "play",
						remainingSecondes: previousState.remainingSecondes - 1,
					};
				}
				return previousState;
			});
		}, 1000);
	}

	stop() {
		BackgroundTimer.stopBackgroundTimer();
		this.timer.update(() => ({ status: "stop", remainingSecondes: 0 }));
	}

	pause() {
		this.timer.update((previousState) => ({
			status: "pause",
			remainingSecondes: previousState.remainingSecondes,
		}));
	}
}
