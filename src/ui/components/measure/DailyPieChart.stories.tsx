// components/Task.stories.js
import { StageInfos } from "@domain/measure/representation/lib/type";
import { ActivityStage } from "@domain/measure/type";
import { boolean, withKnobs } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react-native";
import { colors } from "@ui/styles/colors";
import { isDefined } from "@ui/utils/filter";
import produce from "immer";
import moment from "moment";
import * as React from "react";
import { DailyPieChart } from "./dailyPieChart";
import { DailyPieChartLabel } from "./dailyPieChartLabel";

function getPhaseLevel(phase = 1) {
	return phase - 1;
}

export default storiesOf("DailyPieChart", module)
	.addDecorator(withKnobs)
	.add("default", () => {
		const stages: Array<StageInfos<ActivityStage>> = [];
		const sportSessionDates: [string | undefined, string | undefined][] = [];

		const correctedStages = produce(stages, function (draft) {
			if (!draft.length) {
				return draft;
			}
			const startOfDay = moment(draft[0].start).startOf("day").toISOString();
			const endOfDay = moment(draft[stages.length - 1].end)
				.endOf("day")
				.toISOString();
			// Add a fake stage to start the pie à 00:00
			if (draft[0].start !== startOfDay) {
				draft.unshift({
					level: ActivityStage.SEDENTARY,
					start: startOfDay,
					end: draft[1]?.start ?? endOfDay,
				});
			}
			// Add a fake stage to end the pie à 00:00
			if (draft[stages.length - 1].end !== endOfDay) {
				draft.push({
					level: ActivityStage.SEDENTARY,
					start: draft[stages.length - 2].end ?? startOfDay,
					end: endOfDay,
				});
			}
			// Spec 00023: arc inside a session is always red and bold
			for (const [sessionStart, sessionEnd] of sportSessionDates) {
				if (sessionStart && sessionEnd) {
					for (const stage of draft) {
						if (new Date(stage.start) >= new Date(sessionStart) && new Date(stage.end) <= new Date(sessionEnd)) {
							stage.level = ActivityStage.HIGH;
						}
					}
				}
			}
		});

		return (
			<DailyPieChart
				stages={correctedStages}
				totalDuration={0}
				title="activity.duration.total"
				chartSize={200}
				phaseWidths={[5, 7, 7, 7]}
				phaseColors={[colors.lightBlue, colors.darkBlue]}
				getPhaseLevel={getPhaseLevel}
				hasNotEnoughData={boolean("hasNotEnoughData", false)}
				noDataPhaseColor={colors.lightBlue}
			>
				<DailyPieChartLabel
					chartSize={200}
					labels={sportSessionDates.flatMap((session) =>
						[
							session[0]
								? {
										text: "activity.duration.label.sport_start" as const,
										date: session[0],
								  }
								: undefined,
							session[1]
								? {
										text: "activity.duration.label.sport_end" as const,
										date: session[1],
								  }
								: undefined,
						].filter(isDefined)
					)}
				/>
			</DailyPieChart>
		);
	});
