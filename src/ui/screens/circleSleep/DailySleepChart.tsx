import { useRepresentations } from "@core/representation";
import { toLocale } from "@domain/common/business";
import { ISODay } from "@domain/common/type";
import { DailySleepData } from "@domain/measure/representation/api";
import { SleepStage } from "@domain/measure/type";
import { CalendarTags } from "@ui/components/calendar/CalendarTags";
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

	return (
		<View style={{ flex: 1, position: "relative" }}>
			<View style={{ position: "absolute", top: 0, right: 0 }}>
				<CalendarTags tags={tags} />
			</View>
			<Hypnogram data={data.stages} hasNotEnoughData={hasNotEnoughData} />
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
