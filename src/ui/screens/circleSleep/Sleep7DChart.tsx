import { useRepresentations } from "@core/representation";
import { CalendarTag } from "@domain/calendar/calendar";
import { isDefined } from "@domain/common/business";
import { ISODay } from "@domain/common/type";
import { Points, SleepStageData } from "@domain/measure/representation/api";
import { useIsUSCS } from "@domain/user/hooks/useUser";
import { createActiveMode, isInActiveMode, isInCalibrationMode, updateMode } from "@ui/business";
import { LineChart } from "@ui/components/lineChart/LineChart";
import { Spinner } from "@ui/components/spinner";
import { Tag } from "@ui/components/tag";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { Mode } from "@ui/type";
import { hasAttributesDefined } from "@ui/utils/filter";
import dayjs from "dayjs";
import { observer } from "mobx-react-lite";
import moment from "moment";
import React, { useState } from "react";
import { View } from "react-native";
import { SleepLegend } from "./SleepLegend";

interface Props {
	selectedDay: ISODay;
	mode?: Mode;
}

const yValueFormatter = [
	"",
	"30min",
	...Array(16)
		.fill(0)
		.map((_, i) => `${1 + Math.floor(i / 2)}h  ${i % 2 !== 0 ? "30" : ""}`),
];

// XXX: From @farook implementation (sleepStage7Days.tsx)
// TODO: Add add on press, add yValueFormatter
export const Sleep7DChart = observer(function Sleep7DDChart({ selectedDay, mode = createActiveMode() }: Props) {
	const { formatDuration } = useI18n();
	const isUSCS = useIsUSCS();
	const { use7DaysSleep } = useRepresentations().measure.hooks;
	const { useDailyTags } = useRepresentations().calendar.hooks;
	const [tags, setTags] = useState<CalendarTag[]>([]);
	const days7DSleep = use7DaysSleep(selectedDay);
	const lines = days7DSleep
		? ([...days7DSleep.sleepStages]
				.reverse()
				.filter((line) => hasAttributesDefined(line, ["REM", "awake", "deep", "light"])) as SleepStageData[])
		: [];
	const valueFormatter = lines.map(({ date }) => moment(date).format("dd")[0].toUpperCase());
	const [awakeData, deepData, REMData, lightData] = lines.reduce<[Points, Points, Points, Points]>(
		([awakeData, deepData, REMData, lightData], { awake, deep, REM, light }, index) => [
			[...awakeData, { x: index, y: (awake * 60) / 30 }],
			[...deepData, { x: index, y: (deep * 60) / 30 }],
			[...REMData, { x: index, y: (REM * 60) / 30 }],
			[...lightData, { x: index, y: (light * 60) / 30 }],
		],
		[[], [], [], []]
	) || [[], [], [], []];
	const [yMin, yMax] = [
		Math.min(
			...[
				Math.min(...awakeData.map((line) => line.y)),
				Math.min(...deepData.map((line) => line.y)),
				Math.min(...REMData.map((line) => line.y)),
				Math.min(...lightData.map((line) => line.y)),
			].map((el) => el)
		),
		Math.max(
			...[
				Math.max(...awakeData.map((line) => line.y)),
				Math.max(...deepData.map((line) => line.y)),
				Math.max(...REMData.map((line) => line.y)),
				Math.max(...lightData.map((line) => line.y)),
			].map((el) => el)
		),
	];

	const updatedMode = updateMode(mode, lines.length === 0);
	const sleepConstant = days7DSleep?.constant;
	const isLoaded = isDefined(days7DSleep);
	const toUpdateTag = (x: number) => {
		const date = moment(lines[x].date).format("Y-MM-DD") as ISODay;
		setTags(useDailyTags(date));
	};
	return (
		<>
			<View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
				{(isInActiveMode(updatedMode) || isInCalibrationMode(updatedMode)) &&
					tags.map(({ name, id }) => (
						<View key={id} style={{ marginLeft: 8 }}>
							<Tag>{name}</Tag>
						</View>
					))}
			</View>

			{!isLoaded ? (
				<View style={{ height: 400, flex: 1, justifyContent: "center", alignItems: "center" }}>
					<Spinner size={35} />
				</View>
			) : (
				<>
					<View style={{ height: 200 }}>
						<LineChart
							daysItem={[
								{
									lines: awakeData,
									color: colors.business.sleepAwake,
								},
								{
									lines: deepData,
									color: colors.business.sleepDeep,
								},
								{
									lines: REMData,
									color: colors.business.sleepRem,
								},
								{
									lines: lightData,
									color: colors.business.sleepLight,
								},
							]}
							isMultipleLines={true}
							xColor={colors.textPrimary}
							yColor={colors.darkGray}
							shouldDrawCircles={true}
							valueFormatter={valueFormatter}
							mode={updatedMode}
							scaleXEnabled={false}
							yMin={yMin}
							yMax={yMax}
							highlightPerTapEnabled
							shouldShowMarker
							shouldShowLabel
							graphColor={colors.darkBlue}
							labelFormatter={(x, y, index) => {
								const values = [
									`${formatDuration(lines[index].light * 3600)}`,
									`${formatDuration(lines[index].REM * 3600)}`,
									`${formatDuration(lines[index].deep * 3600)}`,
									`${formatDuration(lines[index].awake * 3600)}`,
								];
								///TODO à voir dans le daily pour le formatage
								return isUSCS
									? `${dayjs(new Date(lines[index].date)).format("MM/DD/YYYY")}\n${values.join("\n")}`
									: `${dayjs(new Date(lines[index].date)).format("DD/MM/YYYY")}\n${values.join("\n")}`;
							}}
							yValueFormatter={yValueFormatter}
							onSelect={(x) => toUpdateTag(x)}
						/>
					</View>
					<View style={{ marginTop: 30 }}>
						<SleepLegend
							REMDuration={
								sleepConstant && isDefined(sleepConstant.REMDuration) && isDefined(sleepConstant.REMPerc)
									? {
											duration: sleepConstant.REMDuration,
											percent: sleepConstant.REMPerc,
									  }
									: undefined
							}
							awakeDuration={
								sleepConstant && isDefined(sleepConstant.awakeDuration) && isDefined(sleepConstant.awakePerc)
									? {
											duration: sleepConstant.awakeDuration,
											percent: sleepConstant.awakePerc,
									  }
									: undefined
							}
							lightDuration={
								sleepConstant && isDefined(sleepConstant.lightDuration) && isDefined(sleepConstant.lightPerc)
									? {
											duration: sleepConstant.lightDuration,
											percent: sleepConstant.lightPerc,
									  }
									: undefined
							}
							deepDuration={
								sleepConstant && isDefined(sleepConstant.deepDuration) && isDefined(sleepConstant.deepPerc)
									? {
											duration: sleepConstant.deepDuration,
											percent: sleepConstant.deepPerc,
									  }
									: undefined
							}
							mode={updatedMode}
						/>
					</View>
				</>
			)}
		</>
	);
});
