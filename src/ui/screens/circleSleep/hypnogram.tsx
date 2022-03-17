import { CalendarTag } from "@domain/calendar/calendar";
import { StageInfos } from "@domain/measure/representation/lib/type";
import { SleepStage } from "@domain/measure/type";
import { StepChart } from "@ui/components/stepChart/StepChart";
import { Tag } from "@ui/components/tag";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { observer } from "mobx-react-lite";
import moment from "moment";
import React from "react";
import { View } from "react-native";
import { toStepsData } from "./business";

export type HypnogramData = Array<StageInfos<SleepStage>>;
export type { Steps } from "@ui/components/stepChart/StepChart";

type Props = {
	data: HypnogramData;
	tags: CalendarTag[];
};

const defaultYAxis = [SleepStage.DEEP, SleepStage.LIGHT, SleepStage.REM, SleepStage.AWAKE];
const defaultXAxis = [moment().hour(0).valueOf(), moment().hour(8).valueOf()];

export const Hypnogram = observer(function Hypnogram({ data, tags }: Props) {
	const stepsData = toStepsData(data);
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
				return format("sleep.stage.awake");
		}
	}

	return (
		<>
			<View style={{ flex: 1, flexDirection: "row-reverse", flexWrap: "wrap" }}>
				{tags.map((tag) => (
					<Tag
						key={`tag-${tag.id}`}
						containerStyle={{
							marginLeft: 7,
							marginBottom: 7,
						}}
					>
						{tag.name}
					</Tag>
				))}
			</View>
			<StepChart
				data={stepsData}
				yAxisWidth={31}
				yColor={yColor}
				yLabelFormat={yLabelFormat}
				xLabelFormat={(tick) => moment(tick).format("H A")}
				xAxisContentInset={15}
				defaultYAxis={defaultYAxis}
				defaultXAxis={defaultXAxis}
				tooltipYOffset={-30}
				tooltipSize={{ width: 40, height: 30 }}
				chartHeight={200}
				renderTooltip={(step) => (
					<>
						<Tag containerStyle={{ backgroundColor: colors.blue, marginBottom: 4 }}>
							{moment(step.x).format("HH:mm")}
						</Tag>
						<Tag containerStyle={{ backgroundColor: colors.blue }}>{yLabelFormat(step.y)}</Tag>
					</>
				)}
			/>
		</>
	);
});
