import { GraphLegend } from "@ui/components/measure/graphLegend";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
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

interface Duration {
	duration: number;
	percent: number;
}

interface Props {
	awakeDuration?: Duration;
	REMDuration?: Duration;
	lightDuration?: Duration;
	deepDuration?: Duration;
	hasNotEnoughData?: boolean;
}

export const SleepLegend = ({ REMDuration, awakeDuration, deepDuration, lightDuration, hasNotEnoughData }: Props) => {
	const { format, formatDuration } = useI18n();

	return (
		<GraphLegend
			hasNotEnoughData={hasNotEnoughData}
			rows={[
				{
					label: format("sleep.stage.awake"),
					element: {
						key: "sleep.stage.awake",
						node: <Circle color={colors.business.sleepAwake} />,
					},
					value:
						awakeDuration &&
						`${formatDuration(awakeDuration.duration * 60)} (${Math.round(awakeDuration.percent * 100)}%)`,
				},
				{
					label: format("sleep.stage.REM"),
					element: {
						key: "sleep.stage.REM",
						node: <Circle color={colors.business.sleepRem} />,
					},
					value:
						REMDuration && `${formatDuration(REMDuration.duration * 60)} (${Math.round(REMDuration.percent * 100)}%)`,
				},
				{
					label: format("sleep.stage.light"),
					element: {
						key: "sleep.stage.light",
						node: <Circle color={colors.business.sleepLight} />,
					},
					value:
						lightDuration &&
						`${formatDuration(lightDuration.duration * 60)} (${Math.round(lightDuration.percent * 100)}%)`,
				},
				{
					label: format("sleep.stage.deep"),
					element: {
						key: "sleep.stage.deep",
						node: <Circle color={colors.business.sleepDeep} />,
					},
					value:
						deepDuration &&
						`${formatDuration(deepDuration.duration * 60)} (${Math.round(deepDuration.percent * 100)}%)`,
				},
			]}
		/>
	);
};
