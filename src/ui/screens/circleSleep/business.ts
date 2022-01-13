import moment from "moment";
import { HypnogramData, Steps } from "./hypnogram";

export function toStepsData(hypnogramData: HypnogramData): Steps {
	return hypnogramData.flatMap((stage) => [
		// Start point
		{ x: moment(stage.start).valueOf(), y: Number(stage.type) },
		// End point
		{ x: moment(stage.end).valueOf(), y: Number(stage.type) },
	]);
}
