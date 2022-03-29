import { StageInfos } from "@domain/measure/representation/lib/type";
import { SleepStage } from "@domain/measure/type";
import { DailyPieChart } from "@ui/components/measure/dailyPieChart";
import { DailyPieChartLabel } from "@ui/components/measure/dailyPieChartLabel";
import { colors } from "@ui/styles/colors";
import moment from "moment";
import React from "react";
import { WordingKey } from "src/wordings";
import styled from "styled-components/native";

type Props = {
	duration: number;
	coreSleepTiming?: [string, string];
	napTimings?: Array<[string, string]>;
	stages: Array<StageInfos<SleepStage>>;
	hasNotEnoughData?: boolean;
};

function getPhaseLevel(phase = 4) {
	return phase < 4 ? 1 : 0;
}

export function SleepDurationPieChart({
	coreSleepTiming,
	stages: _stages,
	duration,
	napTimings = [],
	hasNotEnoughData,
}: Props) {
	// Complete circle with dummy data
	const endCircle = {
		start: _stages[_stages.length - 1]?.end,
		end: moment(_stages[_stages.length - 1]?.end)
			.endOf("day")
			.toISOString(),
		level: 4,
	};

	const stages = endCircle.start ? _stages.concat([endCircle]) : _stages;
	return (
		<Container>
			<DailyPieChart
				stages={stages}
				totalDuration={duration}
				title="sleep.duration.total"
				chartSize={200}
				phaseColors={[colors.lightBlue, colors.darkBlue]}
				phaseWidths={[5, 7]}
				getPhaseLevel={getPhaseLevel}
				hasNotEnoughData={hasNotEnoughData}
				noDataPhaseColor={colors.lightBlue}
			>
				{coreSleepTiming && (
					<DailyPieChartLabel
						chartSize={200}
						labels={[
							{
								text: "sleep.duration.label.start_sleep" as WordingKey,
								date: coreSleepTiming[0],
							},
							{
								text: "sleep.duration.label.wake_up" as WordingKey,
								date: coreSleepTiming[1],
							},
						].concat(
							napTimings.flatMap((nap) => [
								{
									text: "sleep.duration.label.nap_start" as WordingKey,
									date: nap[0],
								},
								{
									text: "sleep.duration.label.nap_end" as WordingKey,
									date: nap[1],
								},
							])
						)}
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
