import { isDefined } from "@domain/common/business";
import { DataControlState } from "@domain/measure/representation/api";
import { StageInfos } from "@domain/measure/representation/lib/type";
import { ActivityStage } from "@domain/measure/type";
import { createActiveMode, updateMode } from "@ui/business";
import { DailyPieChart } from "@ui/components/measure/dailyPieChart";
import { DailyPieChartLabel } from "@ui/components/measure/dailyPieChartLabel";
import { Spinner } from "@ui/components/spinner";
import { colors } from "@ui/styles/colors";
import { Mode } from "@ui/type";
import produce from "immer";
import moment from "moment";
import React from "react";
import styled from "styled-components/native";

type Props = {
	isToday: boolean;
	duration: number;
	controlState: DataControlState;
	sportSessionDates: [number | string, number | string][];
	stages: Array<StageInfos<ActivityStage>>;
	mode?: Mode;
	isLoading?: boolean;
};

function getPhaseLevel(phase = 1) {
	return phase - 1;
}

/**
 * @implements 00023: the chart should start at 00:00
 * @implements 00023: the chart should end at 00:00
 * @implements 00023: the arc during a sport session is always bold and red
 */
export function ActivityDurationPieChart({
	controlState,
	stages,
	duration,
	sportSessionDates,
	isToday,
	mode = createActiveMode(),
	isLoading = false,
}: Props) {
	const updatedMode = updateMode(
		mode,
		controlState === DataControlState.NO_DATA || stages.length === 0 || isNaN(duration)
	);

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
		if (!isToday && moment(draft[stages.length - 1].end).isBefore(endOfDay)) {
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
			{isLoading ? (
				<Spinner size={24} />
			) : (
				<DailyPieChart
					stages={correctedStages}
					totalDuration={duration}
					title="activity.active.minutes"
					chartSize={200}
					phaseColors={[
						colors.business.activityDurationNone,
						colors.business.activityDurationShort,
						colors.business.activityDurationShort,
						colors.business.activityDurationSession,
					]}
					phaseWidths={[5, 7, 7, 7]}
					getPhaseLevel={getPhaseLevel}
					mode={updatedMode}
					noDataPhaseColor={colors.business.activityDurationNone}
				>
					<DailyPieChartLabel
						linedUpText={true}
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
			)}
		</Container>
	);
}

const Container = styled.View`
	background-color: ${colors.lightgray};
	align-items: center;
	padding: 50px;
	padding-bottom: 60px;
	padding-top: 60px;
`;
