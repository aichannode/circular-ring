import { useRepresentations } from "@core/representation";
import { isDefined, toISOMonth } from "@domain/common/business";
import { ISODay } from "@domain/common/type";
import { Lines, SleepStageData } from "@domain/measure/representation/api";
import { useUser } from "@domain/user/hooks/useUser";
import { LineChart } from "@ui/components/lineChart/LineChart";
import { Spinner } from "@ui/components/spinner";
import { Tags } from "@ui/components/Tags";
import { colors } from "@ui/styles/colors";
import { hasAttributesDefined } from "@ui/utils/filter";
import { observer } from "mobx-react-lite";
import moment from "moment";
import React from "react";
import { View } from "react-native";
import { SleepLegend } from "./SleepLegend";

interface Props {
	selectedDay: ISODay;
	hasNotEnoughData?: boolean;
}

export const SleepAllChart = observer(function SleepAllChart({ selectedDay, hasNotEnoughData }: Props) {
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
	const valueFormatter = lines.map(({ date }) => moment(date).format("dd")[0]);

	const [awakeData, deepData, REMData, lightData] = lines.reduce<[Lines, Lines, Lines, Lines]>(
		([awakeData, deepData, REMData, lightData], { awake, deep, REM, light }, index) => [
			[...awakeData, { x: index, y: awake }],
			[...deepData, { x: index, y: deep }],
			[...REMData, { x: index, y: REM }],
			[...lightData, { x: index, y: light }],
		],
		[[], [], [], []]
	) || [[], [], [], []];

	const hasValidData = lines.length !== 0;
	const shouldDisplay = !hasNotEnoughData && hasValidData;
	const sleepConstant = daysAllSleep?.constant;
	const isLoaded = isDefined(daysAllSleep);

	return isLoaded ? (
		<>
			<Tags tags={shouldDisplay ? tags : []} />
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
					hasNotEnoughData={hasNotEnoughData}
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
					hasNotEnoughData={hasNotEnoughData}
				/>
			</View>
		</>
	) : (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center", height: 200 }}>
			<Spinner />
		</View>
	);
});
