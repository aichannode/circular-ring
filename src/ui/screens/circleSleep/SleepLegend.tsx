import { GraphLegend } from "@ui/components/measure/graphLegend";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import moment from "moment";
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
	const { format } = useI18n();

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
						`${moment.duration(awakeDuration.duration).hours()} h ${moment
							.duration(awakeDuration.duration)
							.minutes()} min (${awakeDuration.percent}%)`,
				},
				{
					label: format("sleep.stage.REM"),
					element: {
						key: "sleep.stage.REM",
						node: <Circle color={colors.business.sleepRem} />,
					},
					value:
						REMDuration &&
						`${moment.duration(REMDuration.duration).hours()} h ${moment
							.duration(REMDuration.duration)
							.minutes()} min (${REMDuration.percent}%)`,
				},
				{
					label: format("sleep.stage.light"),
					element: {
						key: "sleep.stage.light",
						node: <Circle color={colors.business.sleepLight} />,
					},
					value:
						lightDuration &&
						`${moment.duration(lightDuration.duration).hours()} h ${moment
							.duration(lightDuration.duration)
							.minutes()} min (${lightDuration.percent}%)`,
				},
				{
					label: format("sleep.stage.deep"),
					element: {
						key: "sleep.stage.deep",
						node: <Circle color={colors.business.sleepDeep} />,
					},
					value:
						deepDuration &&
						`${moment.duration(deepDuration.duration).hours()} h ${moment
							.duration(deepDuration.duration)
							.minutes()} min (${deepDuration.percent})`,
				},
			]}
		/>
	);
};
