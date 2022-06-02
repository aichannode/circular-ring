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
import { TemperatureVariation30DGraph } from "./temperatureVariation30DGraph";
import { TemperatureVariation7DGraph } from "./temperatureVariation7DGraph";

type Props = {
	selectedDay: ISODay;
	mode?: Mode;
	dailyTrimOptions?: TrimOptions;
};

export function TemperatureVariationGraph({ selectedDay, mode = createActiveMode(), dailyTrimOptions }: Props) {
	const { format } = useI18n();
	const [graphPeriod, setGraphPeriod] = useState(TimeFrame.TODAY);

	return (
		<View>
			<TitleText style={{ textAlign: "center", textTransform: "uppercase" }}>
				{format("score.details.temperature.label")}
			</TitleText>
			<View style={{ marginBottom: 25, marginTop: 20 }}>
				<TimeFrameSwitcher
					setGraphPeriod={setGraphPeriod}
					graphPeriod={graphPeriod}
					color={colors.business.sleepPrimary}
					frames={[
						{
							label: "graph.time_frame.7days",
							duration: TimeFrame.LAST_7_DAYS,
						},
						{
							label: "graph.time_frame.30days",
							duration: TimeFrame.LAST_30_DAYS,
						},
						{
							label: "graph.time_frame.all",
							duration: TimeFrame.ALL,
						},
					]}
				/>
			</View>

			{graphPeriod === TimeFrame.LAST_7_DAYS && <TemperatureVariation7DGraph selectedDay={selectedDay} mode={mode} />}
			{graphPeriod === TimeFrame.LAST_30_DAYS && <TemperatureVariation30DGraph selectedDay={selectedDay} mode={mode} />}
		</View>
	);
}
