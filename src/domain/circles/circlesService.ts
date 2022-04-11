import { CircleEntityIcon } from "@domain/circles/type";
import { AppStateService } from "./../appState/appStateService";
import { CirclesApi } from "@domain/circles/circlesApi";

import circleAdd from "@assets/images/circleAdd.png";
import circleAlarm from "@assets/images/circleAlarm.png";
import circleSleep from "@assets/images/circleSleep.png";
import circleSleepSleepMode from "@assets/images/circlesSleepAnalysisSleepMode.png";
import circleActivity from "@assets/images/circleActivity.png";
import circleActivitySleepMode from "@assets/images/circlesActivitySleepMode.png";
import circleLive from "@assets/images/circleLive.png";
import circleLiveSleepMode from "@assets/images/sleepModeLive.png";

export class CirclesService {
	constructor(private readonly circlesApi: CirclesApi, private readonly appStateService: AppStateService) {}

	async init() {}

	async fetchUserCircles() {
		const userCircles = await this.circlesApi.getUserCircles();
		const defaultCircles = await this.circlesApi.getAllCircles();
		this.appStateService.defaultCircles.set(defaultCircles);
		this.appStateService.userCircles.set(userCircles);
	}

	async toggleCircle(id: number) {
		const circleToToggle = this.appStateService.userCircles.get().find((circle) => circle.id === id);
		const defaultCircles = this.appStateService.defaultCircles.get().find((circle) => circle.id === id);
		try {
			if (!circleToToggle) {
				await this.circlesApi.addUserCircle(id);
				if (defaultCircles)
					this.appStateService.userCircles.update((circles) =>
						[...circles, defaultCircles].sort((a, b) => a.order - b.order)
					);
			}
			if (circleToToggle) {
				await this.circlesApi.removeUserCircle(id);
				this.appStateService.userCircles.update((circles) => circles.filter((circle) => circle.id !== id));
			}
		} catch (err) {}
	}

	getIcon(icon: CircleEntityIcon) {
		if (icon.type === "LOCAL") {
			switch (icon.icon) {
				case "@assets/images/circleAdd.png":
					return circleAdd;
				case "@assets/images/circleAlarm.png":
					return circleAlarm;
				case "@assets/images/circleSleep.png":
					return circleSleep;
				case "@assets/images/circlesSleepAnalysisSleepMode.png":
					return circleSleepSleepMode;
				case "@assets/images/circleActivity.png":
					return circleActivity;
				case "@assets/images/circlesActivitySleepMode.png":
					return circleActivitySleepMode;
				case "@assets/images/circleLive.png":
					return circleLive;
				case "@assets/images/sleepModeLive.png":
					return circleLiveSleepMode;
			}
		}
		return icon.icon;
	}
}
