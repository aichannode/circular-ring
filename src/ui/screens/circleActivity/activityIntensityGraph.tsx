import { ISODay } from "@domain/common/type";
import { DailyActivityIntensityData } from "@domain/measure/representation/api";
import { TimeFrame } from "@domain/measure/type";
import { createActiveMode, TrimOptions } from "@ui/business";
import { GraphContainer } from "@ui/components/measure/graphContainer";
import { TimeFrameSwitcher } from "@ui/components/measure/timeFrameSwitcher";
import { TitleText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { Mode } from "@ui/type";
import React, { useState } from "react";
import { View } from "react-native";
import { ActivityIntensity7DGraph } from "./ActivityIntensity7DGraph";
import { ActivityIntensityAllGraph } from "./ActivityIntensityAllGraph";
import { DailyActivityIntensityGraph } from "./DailyActivityIntensityGraph";

type Props = {
	selectedDay: ISODay;
	mode?: Mode;
	dailyTrimOptions?: TrimOptions;
	dataActivityIntensity: DailyActivityIntensityData | undefined;
};

export function ActivityIntensityGraph({
	selectedDay,
	mode = createActiveMode(),
	dailyTrimOptions,
	dataActivityIntensity,
}: Props) {
	const { format } = useI18n();
	const [graphPeriod, setGraphPeriod] = useState(TimeFrame.TODAY);

	return (
		<View>
			<TitleText style={{ textAlign: "center", textTransform: "uppercase" }}>{format("activity.intensity")}</TitleText>
			<View style={{ marginBottom: 25, marginTop: 20 }}>
				<TimeFrameSwitcher
					setGraphPeriod={setGraphPeriod}
					graphPeriod={graphPeriod}
					color={colors.business.actuvityPrimary}
					frames={[
						{
							label: "graph.time_frame.today",
							duration: TimeFrame.TODAY,
						},
						{
							label: "graph.time_frame.7days",
							duration: TimeFrame.LAST_7_DAYS,
						},
						// {
						// 	label: "graph.time_frame.all",
						// 	duration: TimeFrame.ALL,
						// },
					]}
				/>
			</View>

			<GraphContainer>
				{graphPeriod === TimeFrame.TODAY && (
					<DailyActivityIntensityGraph
						dataActivityIntensity={dataActivityIntensity}
						selectedDay={selectedDay}
						mode={mode}
						trimOptions={dailyTrimOptions}
					/>
				)}
				{graphPeriod === TimeFrame.LAST_7_DAYS && <ActivityIntensity7DGraph selectedDay={selectedDay} mode={mode} />}
				{graphPeriod === TimeFrame.ALL && <ActivityIntensityAllGraph selectedDay={selectedDay} mode={mode} />}
			</GraphContainer>
		</View>
	);
}
