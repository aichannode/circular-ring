import { StageInfos } from "@domain/measure/representation/lib/type";
import { SleepStage } from "@domain/measure/type";
import { useIs24h } from "@domain/user/hooks/useUser";
import { createActiveMode } from "@ui/business";
import { StepChart } from "@ui/components/stepChart/StepChart";
import { Tag } from "@ui/components/tag";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { Mode } from "@ui/type";
import React from "react";
import { toStepsData } from "./business";

export type HypnogramData = Array<StageInfos<SleepStage>>;
export type { Steps } from "@ui/components/stepChart/StepChart";

type Props = {
	data: HypnogramData;
	mode?: Mode;
};

export function Hypnogram({ data, mode = createActiveMode() }: Props) {
	const stepsData = toStepsData(data);
	console.log("stepsData", stepsData);
	const { format, formatHour } = useI18n();
	const is24h = useIs24h();
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
		<StepChart
			data={stepsData}
			yAxisWidth={45}
			yColor={yColor}
			yLabelFormat={yLabelFormat}
			xLabelFormat={(tick) => formatHour(new Date(tick), is24h)}
			xAxisPadding={25}
			tooltipYOffset={-30}
			tooltipSize={{ width: 60, height: 30 }}
			chartHeight={200}
			mode={mode}
			renderTooltip={(step) => (
				<>
					<Tag containerStyle={{ backgroundColor: colors.blue, marginBottom: 4 }}>
						{formatHour(new Date(step.x), is24h)}
					</Tag>
					<Tag containerStyle={{ backgroundColor: colors.blue }}>{yLabelFormat(step.y)}</Tag>
				</>
			)}
		/>
	);
}
