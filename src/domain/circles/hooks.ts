import { useServices } from "@core/services";
import { useObservable } from "micro-observables";
import { Routes } from "@ui/navigation/routes";
import { useEffect } from "react";
import { WordingKey } from "src/wordings";
import { Observable, observable } from "micro-observables";
// import { isToday, isYesterday } from "./business";
import { CircleEntity } from "./type";


// export function useCircles(): CircleEntity[]{

// 	const circles = observable<CircleEntity[]>(
// 		[
// 			{
// 				id: 1,
// 				key: "home.circles.alarm.label",
// 				desc: "home.circles.alarm.description",		
// 				source: require("@assets/images/circleAlarm.png"),
// 				route: Routes.Alarm,
// 				on: true
				
// 			},
// 			{
// 				id: 2,
// 				key: "home.circles.sleep.label",
// 				desc: "home.circles.sleep.description",	
// 				route: Routes.Sleep,
// 				source: require("@assets/images/circleSleep.png"),
// 				on: true
// 			},
			
// 			{
// 				id: 3,
// 				key: "home.circles.activity.label",
// 				desc: "home.circles.activity.description",
// 				route: Routes.Activity,	
// 				source: require("@assets/images/circleActivity.png"),
// 				on: true
// 			},
// 			{
// 				id: 4,
// 				key: "home.circles.live.label",
// 				desc: "home.circles.live.description",
// 				route: Routes.Live,	
// 				source: require("@assets/images/circleLive.png"),
// 				on: true
// 			},
// 		]
// 	)

// 	// return circlesService
//     // return useObservable(circlesService.circles)

// 	return useObservable(circles)
// }