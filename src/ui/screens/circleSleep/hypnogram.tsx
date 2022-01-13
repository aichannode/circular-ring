import { StageInfos } from "@domain/measure/representation/type";
import { SleepStage } from "@domain/measure/type";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import moment from "moment";
import React from "react";
import { VictoryAxisCommonProps } from "victory-core";
import { VictoryChart, VictoryArea, VictoryAxis } from "victory-native";
import { toStepsData } from "./business";

export type HypnogramData = Array<StageInfos<SleepStage>>;
export type Steps = Array<{
	/** Time in milliseconds */
	x: number;
	/** Stage value */
	y: number;
}>;

const axisYStyle: VictoryAxisCommonProps["style"] = {
	axis: {
		stroke: "transparent",
	},
	tickLabels: {
		fontSize: 10,
		color: colors.darkGray,
	},
};

const axisXStyle: VictoryAxisCommonProps["style"] = {
	...axisYStyle,
	tickLabels: {
		...axisYStyle.tickLabels,
		color: colors.textPrimary,
		padding: -20,
	},
};

type Props = {
	data: HypnogramData;
};

export function Hypnogram({ data }: Props) {
	const stepsData = toStepsData(data);
	const { format } = useI18n();
	// Use to avoid duplicated tick labels on y axis
	const stageValues = Object.values(SleepStage).filter(Number) as number[]; // extract the number value of the enum
	const yDomain = [0, Math.max(...stageValues)] as [number, number];

	return (
		<VictoryChart style={{ parent: { maxWidth: "50%" } }}>
			<VictoryAxis tickFormat={(tick) => moment(tick).format("H A")} style={axisXStyle} />
			<VictoryAxis
				domain={yDomain}
				dependentAxis
				fixLabelOverlap
				style={axisYStyle}
				tickFormat={function (tick) {
					switch (tick) {
						case SleepStage.DEEP:
							return format("sleep.stage.deep");
						case SleepStage.LIGHT:
							return format("sleep.stage.light");
						case SleepStage.REM:
							return format("sleep.stage.REM");
						default:
						case SleepStage.AWAKE:
							return format("sleep.stage.awake");
					}
				}}
			/>
			<VictoryArea
				style={{ data: { stroke: "#1830ae", strokeWidth: 3, fill: "transparent" } }}
				data={stepsData}
				y0={(d) => d.y - 0.1}
			/>
		</VictoryChart>
	);
}
