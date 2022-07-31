import { ISODay } from "@domain/common/type";
import { DailySleepData } from "@domain/measure/representation/api";
import { SleepStage } from "@domain/measure/type";
import { createActiveMode, updateMode } from "@ui/business";
import { DailyTags } from "@ui/components/dailyTags";
import { Mode } from "@ui/type";
import moment from "moment";
import React from "react";
import { View } from "react-native";
import { Hypnogram } from "./hypnogram";
import { SleepLegend } from "./SleepLegend";

interface Props {
	data: DailySleepData;
	selectedDay: ISODay;
	mode?: Mode;
}

export function DailySleepChart({ data, selectedDay, mode = createActiveMode() }: Props) {
	const awakeDuration = data.sleepStagesDuration[SleepStage.AWAKE];
	const REMDuration = data.sleepStagesDuration[SleepStage.REM];
	const lightDuration = data.sleepStagesDuration[SleepStage.LIGHT];
	const deepDuration = data.sleepStagesDuration[SleepStage.DEEP];

	// Spec 00033 The graph always needs to start in an “awake” phase and always needs to end in an “awake” phase.
	const stages = [];
	if (data?.coreSleepTiming?.[1] && data?.coreSleepTiming?.[0]) {
		data.coreSleepTiming[1];
		data.coreSleepTiming[0];
	}
	if (data?.stages?.[0]?.start) {
		stages.push({
			start: moment(data.stages[0].start)
				.subtract(10, "minutes") // add 10 minutes of awake phase at the begining of the graph
				.toISOString(),
			end: data.stages[0].start,
			level: 4,
		});
		for (const stage of data.stages) {
			// filter so we have data trimmed on end coreSleep
			if (data?.coreSleepTiming?.[1] && moment(data?.coreSleepTiming?.[1]).isAfter(stage.end)) {
				stages.push(stage);
			}
		}
		stages.push({
			start: moment(data.stages[stages.length - 1].end).toISOString(),
			end: moment(data.stages[stages.length - 1].end)
				.add(10, "minutes") // add 10 minutes of awake phase at the end of the graph
				.toISOString(),
			level: 4,
		});
	}
	const updatedMode = updateMode(mode, data?.consoType === 0);

	return (
		<View style={{ flex: 1, position: "relative" }}>
			<DailyTags selectedDay={selectedDay} />

			<Hypnogram data={stages} mode={updatedMode} />
			<View style={{ marginTop: 30 }}>
				<SleepLegend
					mode={mode}
					REMDuration={REMDuration}
					awakeDuration={awakeDuration}
					lightDuration={lightDuration}
					deepDuration={deepDuration}
				/>
			</View>
		</View>
	);
}
