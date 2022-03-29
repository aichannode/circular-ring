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
	isToday: boolean;
	duration: number;
	sportSessionDates: [string | undefined, string | undefined][];
	stages: Array<StageInfos<ActivityStage>>;
	hasNotEnoughData?: boolean;
};

function getPhaseLevel(phase = 1) {
	return phase - 1;
}

/**
 * @implements 00023: the chart should start at 00:00
 * @implements 00023: the chart should end at 00:00
 * @implements 00023: the arc during a sport session is always bold and red
 */
export function ActivityDurationPieChart({ stages, duration, sportSessionDates, isToday, hasNotEnoughData }: Props) {
	const _hasNotEnoughData = hasNotEnoughData || isNaN(duration);

	// Check if the stage start at 00:00 and add a dummy stage if not
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
		// Add a fake stage to end the pie at 00:00 if not today pie
		if (isToday && moment(draft[stages.length - 1].end).isBefore(endOfDay)) {
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
		<Container>
			<DailyPieChart
				stages={correctedStages}
				totalDuration={duration}
				title="activity.duration.total"
				chartSize={200}
				phaseColors={[
					colors.business.activityDurationNone,
					colors.business.activityDurationShort,
					colors.business.activityDurationShort,
					colors.business.activityDurationSession,
				]}
				phaseWidths={[5, 7, 7, 7]}
				getPhaseLevel={getPhaseLevel}
				hasNotEnoughData={_hasNotEnoughData}
				noDataPhaseColor={colors.business.activityDurationNone}
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
