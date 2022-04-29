import { isDefined } from "@domain/common/business";
import { createActiveMode } from "@ui/business";
import { GraphLegend } from "@ui/containers/graphLegend";
import { useI18n } from "@ui/i18n";
import { ActivityIntensityColors } from "@ui/styles/colors";
import { Mode } from "@ui/type";
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
	mode?: Mode;
}

export const ActivityLegend = ({ highDuration, lowDuration, mediumDuration, mode = createActiveMode() }: Props) => {
	const { format, formatDuration } = useI18n();

	return (
		<GraphLegend
			mode={mode}
			rows={[
				{
					label: format("intensity.high"),
					element: {
						key: "intensity.high",
						node: <Circle color={ActivityIntensityColors.HIGH} />,
					},
					value: isDefined(highDuration) ? `${formatDuration(highDuration)}` : undefined,
				},
				{
					label: format("intensity.medium"),
					element: {
						key: "intensity.medium",
						node: <Circle color={ActivityIntensityColors.MEDIUM} />,
					},
					value: isDefined(mediumDuration) ? `${formatDuration(mediumDuration)}` : undefined,
				},
				{
					label: format("intensity.low"),
					element: {
						key: "intensity.low",
						node: <Circle color={ActivityIntensityColors.LOW} />,
					},
					value: isDefined(lowDuration) ? `${formatDuration(lowDuration)}` : undefined,
				},
			]}
		/>
	);
};
