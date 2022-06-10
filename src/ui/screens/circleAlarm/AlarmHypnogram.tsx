import { StageInfos } from "@domain/measure/representation/lib/type";
import { SleepStage } from "@domain/measure/type";
import { createActiveMode } from "@ui/business";
import { StepChart } from "@ui/components/stepChart/StepChart";
import { Tag } from "@ui/components/tag";
import { useI18n } from "@ui/i18n";
import { toStepsData } from "@ui/screens/circleSleep/business";
import { colors } from "@ui/styles/colors";
import { Mode } from "@ui/type";
import moment from "moment";
import React from "react";
import { Text, View } from "react-native";
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
	endSleep?: string | number;
	phaseBeforeWakeUp?: number;
	mode?: Mode;
};

const defaultYAxis = [SleepStage.DEEP, SleepStage.LIGHT, SleepStage.REM, SleepStage.AWAKE];
const defaultXAxis = [moment().hour(0).valueOf(), moment().hour(8).valueOf()];

export function AlarmHypnogram({
	data,
	phaseBeforeWakeUp = data[data.length - 1]?.level,
	endSleep = data[data.length - 1]?.end,
	mode = createActiveMode(),
}: Props) {
	const stepsData = toStepsData(data);
	const { format, formatHour } = useI18n();

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
				return format("sleep.stage.awake");
		}
	}

	return (
		<Gradient start={{ x: 1, y: 0 }} end={{ x: 1, y: 1 }} colors={[...colors.gradient.blue].reverse()}>
			<View style={{ marginRight: 100 }}>
				<StepChart
					data={stepsData}
					labelColor={colors.white}
					yAxisWidth={31}
					yColor={yColor}
					yLabelFormat={yLabelFormat}
					yAxisRight
					xLabelFormat={(tick) => moment(tick).format("H A")}
					rightPadding={15}
					hideXAxis
					defaultYAxis={defaultYAxis}
					defaultXAxis={defaultXAxis}
					tooltipYOffset={-30}
					tooltipSize={{ width: 40, height: 30 }}
					chartHeight={200}
					mode={mode}
					renderTooltip={(step) => (
						<>
							<Tag containerStyle={{ backgroundColor: colors.blue, marginBottom: 4 }}>
								{moment(step.x).format("HH:mm")}
							</Tag>
							<Tag containerStyle={{ backgroundColor: colors.blue }}>{yLabelFormat(step.y)}</Tag>
						</>
					)}
					renderRightChild={(graphContentInset) => (
						<View style={{ flexDirection: "column", flex: 1, alignItems: "center" }}>
							<View
								style={{
									position: "absolute",
									width: 50,
									alignItems: "center",
									top: 15,
								}}
							>
								<Text style={{ color: colors.white, fontSize: 15 }}>{formatHour(moment(endSleep).toDate(), true)}</Text>
							</View>
							<View
								style={{
									flex: 1,
									backgroundColor: colors.white,
									width: 1,
									marginTop: graphContentInset.top - 5,
								}}
							/>
							<View
								style={{
									width: 5,
									height: 5,
									borderRadius: 5,
									backgroundColor: colors.white,
								}}
							/>
						</View>
					)}
				/>
			</View>
			<Text style={{ marginHorizontal: 27, marginTop: 25, color: colors.white }}>
				{phaseBeforeWakeUp === 4 && format("sleep.phase.description.awake")}
				{phaseBeforeWakeUp === 3 && format("sleep.phase.description.REM")}
				{phaseBeforeWakeUp === 2 && format("sleep.phase.description.light")}
				{phaseBeforeWakeUp === 1 && format("sleep.phase.description.deep")}
			</Text>
		</Gradient>
	);
}

const Gradient = styled(LinearGradient)`
	margin: 20px;
	padding-top: 25px;
	padding-bottom: 25px;
	border-radius: 10px;
`;
