import { CirclesApi } from "./circlesApi";
import { Observable, observable } from "micro-observables";
import { CircleEntity } from "./type";
import { Routes } from "@ui/navigation/routes";

export class CirclesService {
  private  _circles = observable<CircleEntity[]>([
        {
            id: 1,
            key: "home.circles.alarm.label",
            desc: "home.circles.alarm.description",		
            source: require("@assets/images/circleAlarm.png"),
            route: Routes.Alarm,
            on: true,
            type: "Vibration"
            
        },
        {
            id: 2,
            key: "home.circles.sleep.label",
            desc: "home.circles.sleep.description",	
            route: Routes.Sleep,
            source: require("@assets/images/circleSleep.png"),
            on: true,
            type: "Wellness"
        },
        
        {
            id: 3,
            key: "home.circles.activity.label",
            desc: "home.circles.activity.description",
            route: Routes.Activity,	
            source: require("@assets/images/circleActivity.png"),
            on: true,
            type: "Wellness"
        },
        {
            id: 4,
            key: "home.circles.live.label",
            desc: "home.circles.live.description",
            route: Routes.Live,	
            source: require("@assets/images/circleLive.png"),
            on: true,
            type: "Wellness"
        },
    ]);

    readonly circles = this._circles.readOnly()
	// constructor(private readonly circlesApi: CirclesApi) {

    // }

    toggleCircle(id: number) {
        this._circles.update(circles => circles.map((circle) => (circle.id === id ? { ...circle, on: !circle.on } : circle)));
      }
    
	// async fetchUserCircles() {
        
	//     this.circlesApi.fetchUserCircles().then(c => this.circles.set(c))
    // }
    // addCircle(text: string) {
    //     this._circles.update(circles => [...circles, { text, done: false }]);
    //   }
 

        
	    // this.circlesApi.addCircle(circleId)
    }

