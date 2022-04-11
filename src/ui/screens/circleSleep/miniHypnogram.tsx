import { StageInfos } from "@domain/measure/representation/lib/type";
import { SleepStage } from "@domain/measure/type";
import { StepChart } from "@ui/components/stepChart/StepChart";
import { Tag } from "@ui/components/tag";
import { useI18n } from "@ui/i18n";
import { toStepsData } from "@ui/screens/circleSleep/business";
import { colors } from "@ui/styles/colors";
import moment from "moment";
import React from "react";
import LinearGradient from "react-native-linear-gradient";
import styled from "styled-components/native";

export type HypnogramData = Array<StageInfos<SleepStage>>;
export type Steps = Array<{
	/** Time in milliseconds */
	x: number;
	/** Stage value */
	y: number;
}>;

type Props = {
	data: HypnogramData;
	hasNotEnoughData?: boolean;
};

const defaultYAxis = [SleepStage.DEEP, SleepStage.LIGHT, SleepStage.REM, SleepStage.AWAKE];
const defaultXAxis = [moment().hour(0).valueOf(), moment().hour(8).valueOf()];

export function MiniHypnogram({ data, hasNotEnoughData }: Props) {
	const stepsData = toStepsData(data);
	console.log("stepsData", stepsData);
	const { format } = useI18n();

	function yColor(y: number) {
		switch (y) {
			case SleepStage.DEEP:
				return colors.business.sleepDeep;
			case SleepStage.LIGHT:
				return colors.business.sleepLight;
			case SleepStage.REM:
				return colors.business.sleepRem;
			default:
			case SleepStage.AWAKE:
				return colors.business.sleepAwake;
		}
	}

	function yLabelFormat(y: number) {
		switch (y) {
			case SleepStage.DEEP:
				return format("sleep.stage.deep");
			case SleepStage.LIGHT:
				return format("sleep.stage.light");
			case SleepStage.REM:
				return format("sleep.stage.REM");
			default:
			case SleepStage.AWAKE:
				return " " + format("sleep.stage.awake");
		}
	}

	return (
		<Gradient start={{ x: 1, y: 0 }} end={{ x: 1, y: 1 }} colors={[...colors.gradient.blue].reverse()}>
			<StepChart
				data={stepsData?.splice(stepsData.length - 20, stepsData.length)}
				yAxisWidth={0}
				yColor={yColor}
				yLabelFormat={(tick) => ""}
				xLabelFormat={(tick) => ""}
				xAxisContentInset={15}
				defaultYAxis={defaultYAxis}
				defaultXAxis={defaultXAxis}
				tooltipYOffset={-30}
				tooltipSize={{ width: 40, height: 30 }}
				chartHeight={200}
				hasNotEnoughData={hasNotEnoughData}
				renderTooltip={(step) => (
					<>
						<Tag containerStyle={{ backgroundColor: colors.blue, marginBottom: 4 }}>
							{moment(step.x).format("HH:mm")}
						</Tag>
						<Tag containerStyle={{ backgroundColor: colors.blue }}>{yLabelFormat(step.y)}</Tag>
					</>
				)}
			/>
		</Gradient>
	);
}

const Gradient = styled(LinearGradient)`
	margin: 20px;
	border-radius: 10px;
`;
