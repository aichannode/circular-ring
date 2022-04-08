import { getLocalISODayFromUTCDate } from "@domain/common/business";
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

export function SleepDurationPieChart({ coreSleepTiming, duration, napTimings = [], hasNotEnoughData }: Props) {
	// Draw the core sleep
	const stages = [
		{
			start: coreSleepTiming?.[0] ?? moment().startOf("day").toString(),
			end: coreSleepTiming?.[1] ?? moment().endOf("day").toISOString(),
			level: coreSleepTiming ? 1 : 4,
		},
	];

	// Add naps
	if (napTimings.length) {
		stages.push(
			...napTimings.flatMap(([start, end], index) => [
				{
					start: index === 0 ? coreSleepTiming?.[1] ?? moment().startOf("day").toString() : napTimings[index - 1][1],
					end: start,
					level: 4,
				},
				{
					start,
					end,
					level: 1,
				},
			])
		);
	}

	// Complete the circle with awake state
	const wasAsleepBeforeMidnight =
		coreSleepTiming &&
		getLocalISODayFromUTCDate(coreSleepTiming?.[0]) !== getLocalISODayFromUTCDate(coreSleepTiming?.[1]);
	stages.push({
		start: stages[stages.length - 1]?.end,
		end: wasAsleepBeforeMidnight
			? moment(coreSleepTiming?.[0]).add(1, "day").toISOString()
			: moment(coreSleepTiming?.[1]).endOf("day").toISOString(),
		level: 4,
	});

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
