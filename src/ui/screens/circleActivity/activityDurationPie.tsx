import { StageInfos } from "@domain/measure/representation/lib/type";
import { ActivityStage } from "@domain/measure/type";
import { DailyPieChart } from "@ui/components/measure/dailyPieChart";
import { DailyPieChartLabel } from "@ui/components/measure/dailyPieChartLabel";
import { colors } from "@ui/styles/colors";
import { isDefined } from "@ui/utils/filter";
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

export function ActivityDurationPieChart({ stages, duration, sportSessionDates }: Props) {
	return (
		<Container>
			<DailyPieChart
				stages={stages}
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
