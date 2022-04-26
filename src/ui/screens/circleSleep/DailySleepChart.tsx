import { useRepresentations } from "@core/representation";
import { toLocale } from "@domain/common/business";
import { ISODay } from "@domain/common/type";
import { DailySleepData } from "@domain/measure/representation/api";
import { SleepStage } from "@domain/measure/type";
import { Tags } from "@ui/components/Tags";
import produce from "immer";
import moment from "moment";
import React from "react";
import { View } from "react-native";
import { Hypnogram } from "./hypnogram";
import { SleepLegend } from "./SleepLegend";

interface Props {
	data: DailySleepData;
	selectedDay: ISODay;
	hasNotEnoughData?: boolean;
}

export function DailySleepChart({ data, selectedDay, hasNotEnoughData }: Props) {
	const { useRangeTags } = useRepresentations().calendar.hooks;
	const tags = useRangeTags(
		toLocale(moment(selectedDay).startOf("day").toISOString()),
		toLocale(moment(selectedDay).endOf("day").toISOString())
	);

	const awakeDuration = data.sleepStagesDuration[SleepStage.AWAKE];
	const REMDuration = data.sleepStagesDuration[SleepStage.REM];
	const lightDuration = data.sleepStagesDuration[SleepStage.LIGHT];
	const deepDuration = data.sleepStagesDuration[SleepStage.DEEP];

	// Spec 00033 The graph always needs to start in an “awake” phase and always needs to end in an “awake” phase.
	const correctedStages = produce(data.stages, function (draft) {
		if (draft.length) {
			draft.unshift({
				start: moment(draft[0].start)
					.subtract(10 * 60 * 1000) // add 10 minutes of awake phase at the begining of the graph
					.toISOString(),
				end: draft[0].start,
				level: 4,
			});
			draft.push({
				start: draft[draft.length - 1].end,
				end: moment(draft[draft.length - 1].end)
					.add(5, "minutes")
					.toISOString(),
				level: 4,
			});
		}
	});
	return (
		<View style={{ flex: 1, position: "relative" }}>
			<View>
				<Tags tags={!hasNotEnoughData ? tags : []} />
			</View>
			<Hypnogram data={correctedStages} hasNotEnoughData={hasNotEnoughData} />
			<View style={{ marginTop: 30 }}>
				<SleepLegend
					hasNotEnoughData={hasNotEnoughData}
					REMDuration={REMDuration}
					awakeDuration={awakeDuration}
					lightDuration={lightDuration}
					deepDuration={deepDuration}
				/>
			</View>
		</View>
	);
}
