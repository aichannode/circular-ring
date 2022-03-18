import { useRepresentations } from "@core/representation";
import { getLocalISODayFromLocalDate } from "@domain/common/business";
import { LineChart } from "@ui/components/lineChart/LineChart";
import { GraphContainer } from "@ui/components/measure/graphContainer";
import { Spinner } from "@ui/components/spinner";
import { TitleText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { View } from "react-native";

type Props = {
	selectedDay: string;
};

export const HeartRateGraph: React.FC<Props> = observer(function HeartRateGraph({ selectedDay }: Props) {
	const { format } = useI18n();
	const [isLoading, setLoading] = useState(true);

	const {
		measure: {
			hooks: { useDailyHR },
		},
	} = useRepresentations();

	const dailyHr = useDailyHR(getLocalISODayFromLocalDate(selectedDay));
	const lines = dailyHr ? dailyHr.lines : [];
	const [yMin, yMax] =
		lines.length > 0 ? [Math.min(...lines!.map((line) => line.y)), Math.max(...lines!.map((line) => line.y))] : [0, 0];

	const [yMinIndex, yMaxIndex] = [
		lines!.findIndex((line) => line.y == yMin),
		lines!.findIndex((line) => line.y == yMax),
	];
	useEffect(() => {
		setTimeout(() => {
			setLoading(false);
		}, 500);
	}, [lines]);
	return isLoading ? (
		<Spinner size={24} />
	) : !!lines.length ? (
		<View>
			<TitleText style={{ marginBottom: 20, textAlign: "center", textTransform: "uppercase" }}>
				{format("live.heart_rate.label")}
			</TitleText>

			<GraphContainer style={{ height: 300 }}>
				{/** Wait for available data on week/month */}
				<LineChart
					xColor={colors.textPrimary}
					yColor={colors.darkGray}
					data={lines}
					shouldShowLabel={true}
					shouldDrawCircles={false}
					graphColor={colors.red}
					valueFormatter="date"
					valueFormatterPattern="H'h'"
					yMin={yMin}
					yMax={yMax}
					yMinIndex={yMinIndex}
					yMaxIndex={yMaxIndex}
				/>
			</GraphContainer>
		</View>
	) : (
		<></>
	);
});
