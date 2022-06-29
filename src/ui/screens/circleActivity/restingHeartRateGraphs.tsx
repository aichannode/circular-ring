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
import { ActivityIntensityAllGraph } from "./ActivityIntensityAllGraph";
import { RestingHeartRate30DGraph } from "./restingHeartRate30DGraph";
import { RestingHeartRate7DGraph } from "./restingHeartRate7DGraph";

type Props = {
	selectedDay: ISODay;
	mode?: Mode;
	dailyTrimOptions?: TrimOptions;
};

export function RestingHeartRateGraphs({ selectedDay, mode = createActiveMode(), dailyTrimOptions }: Props) {
	const { format } = useI18n();
	const [graphPeriod, setGraphPeriod] = useState(TimeFrame.LAST_7_DAYS);

	return (
		<View>
			<TitleText style={{ textAlign: "center", textTransform: "uppercase" }}>
				{format("activity.resting_heart_rate")}
			</TitleText>
			<View style={{ marginBottom: 25, marginTop: 20 }}>
				<TimeFrameSwitcher
					setGraphPeriod={setGraphPeriod}
					graphPeriod={graphPeriod}
					color={colors.business.actuvityPrimary}
					frames={[
						{
							label: "graph.time_frame.7days",
							duration: TimeFrame.LAST_7_DAYS,
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

			{graphPeriod === TimeFrame.LAST_7_DAYS && <RestingHeartRate7DGraph selectedDay={selectedDay} mode={mode} />}
			{graphPeriod === TimeFrame.LAST_30_DAYS && <RestingHeartRate30DGraph selectedDay={selectedDay} mode={mode} />}
			{graphPeriod === TimeFrame.ALL && <ActivityIntensityAllGraph selectedDay={selectedDay} mode={mode} />}
		</View>
	);
}
