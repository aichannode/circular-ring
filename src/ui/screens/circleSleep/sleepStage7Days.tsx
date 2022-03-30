import { useRepresentations } from "@core/representation";
import { LineChart } from "@ui/components/lineChart/LineChart";
import { colors } from "@ui/styles/colors";
import { MultipleDataSets } from "@ui/type";
import React from "react";
import { View } from "react-native";

type Props = {
	hasNotEnoughData?: boolean;
};

export function SleepStage7Days({ hasNotEnoughData }: Props) {
	const { useCircleSleep } = useRepresentations().measure.hooks;
	const items = useCircleSleep();

	const dataSets: MultipleDataSets = [
		{
			lines: items
				? items.map(({ awake }, index) => {
						return { x: index, y: awake };
				  })
				: [],
			color: colors.business.sleepAwake,
		},
		{
			lines: items
				? items.map(({ deep }, index) => {
						return { x: index, y: deep };
				  })
				: [],
			color: colors.business.sleepDeep,
		},
		{
			lines: items
				? items.map(({ rem }, index) => {
						return { x: index, y: rem };
				  })
				: [],
			color: colors.business.sleepRem,
		},
		{
			lines: items
				? items.map(({ light }, index) => {
						return { x: index, y: light };
				  })
				: [],
			color: colors.business.sleepLight,
		},
	];
	return (
		<View style={{ height: 200 }}>
			<LineChart
				daysItem={dataSets}
				isMultipleLines={true}
				xColor={colors.textPrimary}
				yColor={colors.darkGray}
				shouldDrawCircles={true}
				valueFormatter={["S", "M", "T", "W", "T", "F", "S"]}
				hasNotEnoughData={hasNotEnoughData}
			/>
		</View>
	);
}
