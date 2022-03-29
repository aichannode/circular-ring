import { useI18n } from "@ui/i18n";
import React from "react";
import { View } from "react-native";
import { BarChart as BarChartWrapper, BarChartProps } from "react-native-charts-wrapper";
import { TextPlaceholder } from "../placeholder/TextPlaceholder";

interface Props<T> extends BarChartProps {
	hasNotEnoughData?: boolean;
}

export function BarChart<T>({ hasNotEnoughData, data, style, ...props }: Props<T>) {
	const _hasNotEnoughData = hasNotEnoughData || data.dataSets?.length === 0;

	const { format } = useI18n();

	return (
		<View style={style}>
			{_hasNotEnoughData ? (
				<TextPlaceholder content={format("global.no_data_yet")} />
			) : (
				<BarChartWrapper {...props} data={data} style={style} />
			)}
		</View>
	);
}
