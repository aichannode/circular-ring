import { StageInfos } from "@domain/measure/representation/lib/type";
import { SleepStage } from "@domain/measure/type";
import { DailyPieChart } from "@ui/components/measure/dailyPieChart";
import { DailyPieChartLabel } from "@ui/components/measure/dailyPieChartLabel";
import { colors } from "@ui/styles/colors";
import moment from "moment";
import React from "react";
import styled from "styled-components/native";

type Props = {
	duration: number;
	coreSleepTiming?: [string, string];
	stages: Array<StageInfos<SleepStage>>;
};

function getPhaseLevel(phase = 4) {
	return phase < 4 ? 1 : 0;
}

export function SleepDurationPieChart({ coreSleepTiming, stages, duration }: Props) {
	return (
		<Container>
			<DailyPieChart
				stages={stages}
				totalDuration={duration}
				title="sleep.duration.total"
				chartSize={200}
				currentIsoDate={moment("2021-12-21").hour(20).toISOString()}
				phaseColors={[colors.lightBlue, colors.darkBlue]}
				phaseWidths={[5, 7]}
				getPhaseLevel={getPhaseLevel}
			>
				{coreSleepTiming && (
					<DailyPieChartLabel
						chartSize={200}
						labels={[
							{
								text: "sleep.duration.label.start_sleep",
								date: coreSleepTiming[0],
							},
							{
								text: "sleep.duration.label.start_sleep",
								date: coreSleepTiming[1],
							},
						]}
					/>
				)}
			</DailyPieChart>
		</Container>
	);
}

const Container = styled.View`
	background-color: ${colors.lightgray};
	align-items: center;
	padding: 50px;
`;
