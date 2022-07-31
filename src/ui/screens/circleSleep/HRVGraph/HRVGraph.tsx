import { ISODay } from "@domain/common/type";
import { TimeFrame } from "@domain/measure/type";
import { createActiveMode, TrimOptions } from "@ui/business";
import { TimeFrameSwitcher } from "@ui/components/measure/timeFrameSwitcher";
import { TitleText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { Mode } from "@ui/type";
import React, { useState } from "react";
import { View } from "react-native";
import { DailyHRVGraph } from "./dailyHRVGraph";
import { HrVGraph30days } from "./hrvGraph30days";

type Props = {
	selectedDay: ISODay;
	mode?: Mode;
	dailyTrimOptions?: TrimOptions;
	screenModeWithoutDisabled?: Mode;
};

export function HRVGraph({
	selectedDay,
	mode = createActiveMode(),
	screenModeWithoutDisabled,
	dailyTrimOptions,
}: Props) {
	const { format } = useI18n();
	const [graphPeriod, setGraphPeriod] = useState(TimeFrame.TODAY);
	console.log("dailyTrimOptions", dailyTrimOptions);
	return (
		<View>
			<TitleText style={{ textAlign: "center", textTransform: "uppercase" }}>
				{format("score.details.hrv.label")}
			</TitleText>
			<View style={{ marginBottom: 25, marginTop: 20 }}>
				<TimeFrameSwitcher
					setGraphPeriod={setGraphPeriod}
					graphPeriod={graphPeriod}
					color={colors.business.sleepPrimary}
					frames={[
						{
							label: "graph.time_frame.today",
							duration: TimeFrame.TODAY,
						},
						{
							label: "graph.time_frame.30days",
							duration: TimeFrame.LAST_30_DAYS,
						},
						// {
						// 	label: "graph.time_frame.all",
						// 	duration: TimeFrame.ALL,
						// },
					]}
				/>
			</View>
			{graphPeriod === TimeFrame.TODAY && (
				<DailyHRVGraph selectedDay={selectedDay} mode={mode} dailyTrimOptions={dailyTrimOptions} />
			)}
			{graphPeriod === TimeFrame.LAST_30_DAYS && (
				<HrVGraph30days
					selectedDay={selectedDay}
					mode={screenModeWithoutDisabled}
					dailyTrimOptions={dailyTrimOptions}
				/>
			)}
		</View>
	);
}
