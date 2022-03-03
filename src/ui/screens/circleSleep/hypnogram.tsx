import { StageInfos } from "@domain/measure/representation/lib/type";
import { SleepStage } from "@domain/measure/type";
import { StepChart } from "@ui/components/stepChart/StepChart";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import moment from "moment";
import React from "react";
import { toStepsData } from "./business";

export type HypnogramData = Array<StageInfos<SleepStage>>;
export type { Steps } from "@ui/components/stepChart/StepChart";

type Props = {
	data: HypnogramData;
};

const defaultYAxis = [SleepStage.DEEP, SleepStage.LIGHT, SleepStage.REM, SleepStage.AWAKE];
const defaultXAxis = [moment().hour(0).valueOf(), moment().hour(8).valueOf()];

export function Hypnogram({ data }: Props) {
	const stepsData = toStepsData(data);
	const { format } = useI18n();

	return (
		<StepChart
			data={stepsData}
			yAxisWidth={31}
			yColor={function (y: number) {
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
			}}
			yLabelFormat={function (y: number) {
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
			}}
			xLabelFormat={(tick) => moment(tick).format("H A")}
			xAxisContentInset={15}
			defaultYAxis={defaultYAxis}
			defaultXAxis={defaultXAxis}
		/>
	);
}
