import { StageInfos } from "@domain/measure/representation/lib/type";
import { ActivityStage } from "@domain/measure/type";
import { DailyPieChart } from "@ui/components/measure/dailyPieChart";
import { DailyPieChartLabel } from "@ui/components/measure/dailyPieChartLabel";
import { colors } from "@ui/styles/colors";
import { isDefined } from "@ui/utils/filter";
import produce from "immer";
import moment from "moment";
import React from "react";
import styled from "styled-components/native";

type Props = {
	duration: number;
	sportSessionDates: [string | undefined, string | undefined][];
	stages: Array<StageInfos<ActivityStage>>;
};

function getPhaseLevel(phase = 4) {
	// console.log("FIX phase", phase - 1);
	return phase - 1;
}

/**
 * @implements 00023: the chart should start at 00:001
 */
export function ActivityDurationPieChart({ stages, duration, sportSessionDates }: Props) {
	// Check if the stage start at 00:00 and add a dummy stage if not
	const correctedStages = produce(stages, (draft) => {
		const startOfDay = moment(draft[0].start).startOf("day").toISOString();
		const endOfDay = moment(draft[stages.length - 1].end)
			.endOf("day")
			.toISOString();
		if (draft[0].start !== startOfDay) {
			draft.unshift({
				level: ActivityStage.SEDENTARY,
				start: startOfDay,
				end: draft[1]?.start ?? endOfDay,
			});
		}
		if (draft[stages.length - 1].end !== endOfDay) {
			draft.push({
				level: ActivityStage.SEDENTARY,
				start: draft[stages.length - 2].end ?? startOfDay,
				end: endOfDay,
			});
		}
	});
	return (
		<Container>
			<DailyPieChart
				stages={correctedStages}
				totalDuration={duration}
				title="activity.duration.total"
				chartSize={200}
				currentIsoDate={moment().toISOString()}
				phaseColors={[colors.business.activityNone, colors.business.activityLow, colors.business.activityHigh]}
				phaseWidths={[5, 7, 7]}
				getPhaseLevel={getPhaseLevel}
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
		</Container>
	);
}

const Container = styled.View`
	background-color: ${colors.lightgray};
	align-items: center;
	padding: 50px;
`;
