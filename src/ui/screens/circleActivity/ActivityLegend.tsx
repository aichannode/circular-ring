import { GraphLegend } from "@ui/components/measure/graphLegend";
import { useI18n } from "@ui/i18n";
import { ActivityIntensityColors } from "@ui/styles/colors";
import { isDefined } from "@ui/utils/filter";
import React from "react";
import { View } from "react-native";

const Circle = ({ color }: { color: string }) => (
	<View
		style={{
			width: 10,
			height: 10,
			borderRadius: 5,
			backgroundColor: color,
		}}
	/>
);

interface Props {
	highDuration?: number;
	mediumDuration?: number;
	lowDuration?: number;
	hasNotEnoughData?: boolean;
}

export const ActivityLegend = ({ highDuration, lowDuration, mediumDuration, hasNotEnoughData }: Props) => {
	const { format, formatDuration } = useI18n();

	const isValidHighDuration = !hasNotEnoughData && isDefined(highDuration);
	const isValidMediumDuration = !hasNotEnoughData && isDefined(mediumDuration);
	const isValidLowDuration = !hasNotEnoughData && isDefined(lowDuration);

	return (
		<GraphLegend
			rows={[
				{
					label: format("intensity.high"),
					element: {
						key: "intensity.high",
						node: <Circle color={ActivityIntensityColors.HIGH} />,
					},
					value: isValidHighDuration ? `${formatDuration(highDuration)}` : undefined,
				},
				{
					label: format("intensity.medium"),
					element: {
						key: "intensity.medium",
						node: <Circle color={ActivityIntensityColors.MEDIUM} />,
					},
					value: isValidMediumDuration ? `${formatDuration(mediumDuration)}` : undefined,
				},
				{
					label: format("intensity.low"),
					element: {
						key: "intensity.low",
						node: <Circle color={ActivityIntensityColors.LOW} />,
					},
					value: isValidLowDuration ? `${formatDuration(lowDuration)}` : undefined,
				},
			]}
			hasNotEnoughData={hasNotEnoughData}
		/>
	);
};
