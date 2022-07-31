import { StageInfos } from "@domain/measure/representation/lib/type";
import { SleepStage } from "@domain/measure/type";
import { createActiveMode, updateMode } from "@ui/business";
import { DailyPieChart } from "@ui/components/measure/dailyPieChart";
import { DailyPieChartLabel } from "@ui/components/measure/dailyPieChartLabel";
import { Spinner } from "@ui/components/spinner";
import { colors } from "@ui/styles/colors";
import { Mode } from "@ui/type";
import moment from "moment";
import React from "react";
import { WordingKey } from "src/wordings";
import styled from "styled-components/native";

type Props = {
	duration: number;
	coreSleepTiming?: [string, string];
	napTimings?: Array<[string, string]>;
	stages: Array<StageInfos<SleepStage>>;
	mode?: Mode;
	isLoading?: boolean;
};

function getPhaseLevel(phase = 4) {
	return phase < 4 ? 1 : 0;
}

export function SleepDurationPieChart({
	coreSleepTiming,
	duration,
	napTimings = [],
	mode = createActiveMode(),
	isLoading = false,
}: Props) {
	// Draw the core sleep
	const stages = [
		{
			start: coreSleepTiming?.[0] ?? moment().startOf("day").toISOString(),
			end: coreSleepTiming?.[1] ?? moment().endOf("day").toISOString(),
			level: coreSleepTiming ? 1 : 4,
		},
	];
	// Add naps
	console.log("napTimings", napTimings);
	console.log("coreSleepTiming", coreSleepTiming);
	console.log("NAP FIRST ELEMENT", coreSleepTiming?.[1] ?? moment().startOf("day").toISOString());
	if (napTimings.length) {
		stages.push(
			...napTimings.flatMap(([start, end], index) => {
				return [
					{
						start:
							index === 0 ? coreSleepTiming?.[1] ?? moment().startOf("day").toISOString() : napTimings[index - 1][1],
						end: start,
						level: 4,
					},
					{
						start,
						end,
						level: 1,
					},
				];
			})
		);
	}
	console.log("stages 1", stages);

	// Complete the circle with awake state
	const midi = moment(coreSleepTiming?.[0]).startOf("day").add(12, "hour");
	const endOfDay = moment(coreSleepTiming?.[0]).endOf("day");
	const wasAsleepBeforeMidnight = coreSleepTiming && moment(coreSleepTiming?.[0]).local().isBetween(midi, endOfDay);
	console.log("wasAsleepBeforeMidnight", wasAsleepBeforeMidnight);
	stages.push({
		start: stages[stages.length - 1]?.end,
		end: wasAsleepBeforeMidnight
			? moment(coreSleepTiming?.[0]).add(1, "day").toISOString()
			: moment(coreSleepTiming?.[1]).endOf("day").toISOString(),
		level: 4,
	});
	console.log("stages", stages);
	const updatedMode = updateMode(mode, stages.length === 0 || isNaN(duration));
	return (
		<Container>
			{isLoading ? (
				<Spinner size={24} />
			) : (
				<DailyPieChart
					stages={stages}
					totalDuration={duration}
					title="sleep.duration.total"
					chartSize={200}
					phaseColors={[colors.lightBlue, colors.darkBlue]}
					phaseWidths={[5, 7]}
					getPhaseLevel={getPhaseLevel}
					mode={updatedMode}
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
