import { useRepresentations } from "@core/representation";
import { isDefined, toISOMonth } from "@domain/common/business";
import { ISODay } from "@domain/common/type";
import { Points, SleepStageData } from "@domain/measure/representation/api";
import { useUser } from "@domain/user/hooks/useUser";
import { createActiveMode, isInDisabledMode, updateMode } from "@ui/business";
import { LineChart } from "@ui/components/lineChart/LineChart";
import { Spinner } from "@ui/components/spinner";
import { Tags } from "@ui/components/Tags";
import { colors } from "@ui/styles/colors";
import { Mode } from "@ui/type";
import { hasAttributesDefined } from "@ui/utils/filter";
import { observer } from "mobx-react-lite";
import moment from "moment";
import React from "react";
import { View } from "react-native";
import { SleepLegend } from "./SleepLegend";

interface Props {
	selectedDay: ISODay;
	mode?: Mode;
}

export const SleepAllChart = observer(function SleepAllChart({ selectedDay, mode = createActiveMode() }: Props) {
	const user = useUser();
	const beginDay = (user ? moment(user.createdAt).format("YYYY-MM-DD") : "2020-01-01") as ISODay;

	const { useAllMonthsSleep } = useRepresentations().measure.hooks;
	const { useRangeTags } = useRepresentations().calendar.hooks;
	const tags = useRangeTags(beginDay, moment(selectedDay).endOf("day").toISOString() as ISODay);
	const daysAllSleep = useAllMonthsSleep(toISOMonth(beginDay), toISOMonth(selectedDay));

	const lines = daysAllSleep
		? ([...daysAllSleep.sleepStages]
				.reverse()
				.filter((line) => hasAttributesDefined(line, ["REM", "awake", "deep", "light"])) as SleepStageData[])
		: [];
	const valueFormatter = lines.map(({ date }) => moment(date).format("MMMM").substr(0, 3));

	const [awakeData, deepData, REMData, lightData] = lines.reduce<[Points, Points, Points, Points]>(
		([awakeData, deepData, REMData, lightData], { awake, deep, REM, light }, index) => [
			[...awakeData, { x: index, y: awake }],
			[...deepData, { x: index, y: deep }],
			[...REMData, { x: index, y: REM }],
			[...lightData, { x: index, y: light }],
		],
		[[], [], [], []]
	) || [[], [], [], []];

	const updatedMode = updateMode(mode, lines.length === 0);
	const sleepConstant = daysAllSleep?.constant;
	const isLoaded = isDefined(daysAllSleep);

	return (
		<>
			<Tags tags={isInDisabledMode(updatedMode) ? [] : tags} />
			{!isLoaded ? (
				<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
