import { observable } from "micro-observables";
import { CircleEntity } from "./type";
import { Routes } from "@ui/navigation/routes";

export class CirclesService {
	private _circles = observable<CircleEntity[]>([
		{
			id: 1,
			key: "home.circles.alarm.label",
			desc: "home.circles.alarm.description",
			source: require("@assets/images/circleAlarm.png"),
			sleepModeIcon: require("@assets/images/circleAlarm.png"),
			route: Routes.Alarm,
			on: true,
			type: "Vibration",
			canNavigateInSleepMode: true,
		},
		{
			id: 2,
			key: "home.circles.sleep.label",
			desc: "home.circles.sleep.description",
			route: Routes.Sleep,
			source: require("@assets/images/circleSleep.png"),
			sleepModeIcon: require("@assets/images/ciclesSleepAnalysisSleeepmode.png"),
			on: true,
			type: "Wellness",
			canNavigateInSleepMode: false,
		},

		{
			id: 3,
			key: "home.circles.activity.label",
			desc: "home.circles.activity.description",
			route: Routes.Activity,
			source: require("@assets/images/circleActivity.png"),
			sleepModeIcon: require("@assets/images/ciclesActivitySleeepmode.png"),
			on: true,
			type: "Wellness",
			canNavigateInSleepMode: false,
		},
		{
			id: 4,
			key: "home.circles.live.label",
			desc: "home.circles.live.description",
			route: Routes.Live,
			source: require("@assets/images/circleLive.png"),
			sleepModeIcon: require("@assets/images/ciclesAlarmSleeepmode.png"),
			on: true,
			type: "Wellness",
			canNavigateInSleepMode: false,
		},
	]);

	readonly circles = this._circles.readOnly();

	toggleCircle(id: number) {
		this._circles.update((circles) =>
			circles.map((circle) => (circle.id === id ? { ...circle, on: !circle.on } : circle))
		);
	}
}
