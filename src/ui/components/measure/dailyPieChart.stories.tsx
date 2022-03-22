import { getCurrentLocalISODay } from "@domain/common/business";
import { StageInfos } from "@domain/measure/representation/lib/type";
import { ActivityStage } from "@domain/measure/type";
import { storiesOf } from "@storybook/react-native";
import moment from "moment";
import React from "react";
import { DailyPieChart } from "./dailyPieChart";

const timeCursor = moment().startOf("day").hours(8);

storiesOf("Pie chart", module).add("default", () => (
	<DailyPieChart
		stages={
			[
				{
					level: ActivityStage.SEDENTARY,
					start: timeCursor.toISOString(),
					end: timeCursor.add(10, "minutes").toISOString(),
				},
				{
					level: ActivityStage.LOW,
					start: timeCursor.toISOString(),
					end: timeCursor.add(1, "hour").toISOString(),
				},
				{
					level: ActivityStage.MEDIUM,
					start: timeCursor.toISOString(),
					end: timeCursor.add(20, "minutes").toISOString(),
				},
				{
					level: ActivityStage.HIGH,
					start: timeCursor.toISOString(),
					end: timeCursor.add(15, "minutes").toISOString(),
				},
				{
					level: ActivityStage.MEDIUM,
					start: timeCursor.toISOString(),
					end: timeCursor.add(10, "minutes").toISOString(),
				},
				{
					level: ActivityStage.LOW,
					start: timeCursor.toISOString(),
					end: timeCursor.add(20, "minutes").toISOString(),
				},
			] as Array<StageInfos<ActivityStage>>
		}
		totalDuration={100}
		/** Chart diameter */
		chartSize={300}
		/** The title in the center of the pie */
		title={"activity.duration.title"}
		/** Current date as ISO string */
		currentLocalIsoDay={getCurrentLocalISODay()}
		/** Logic to know the color of the given phase */
		getPhaseLevel={(phase: number) => phase - 1}
		/** Phase colors, indexed by phase level */
		phaseColors={["blue", "pink", "orange", "red"]}
		/** Phase stroke width, indexed by phase level */
		phaseWidths={[5, 5, 7, 9]}
	/>
));
