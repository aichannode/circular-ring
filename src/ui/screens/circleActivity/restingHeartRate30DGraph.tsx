import { useRepresentations } from "@core/representation";
import { CalendarTag } from "@domain/calendar/calendar";
import { isDefined } from "@domain/common/business";
import { ISODay } from "@domain/common/type";
import { DataControlState, Points } from "@domain/measure/representation/api";
import { useIsUSCS } from "@domain/user/hooks/useUser";
import { createActiveMode, isInActiveMode, isInCalibrationMode, updateMode } from "@ui/business";
import { LineChart } from "@ui/components/lineChart/LineChart";
import { GraphContainer } from "@ui/components/measure/graphContainer";
import { Spinner } from "@ui/components/spinner";
import { Tag } from "@ui/components/tag";
import { GraphLegend } from "@ui/containers/graphLegend";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { Averages, Mode } from "@ui/type";
import dayjs from "dayjs";
import { observer } from "mobx-react-lite";
import moment from "moment";
import React, { useState } from "react";
import { View } from "react-native";
import DashedLine from "react-native-dashed-line";

type Props = {
	selectedDay: ISODay;
	mode?: Mode;
};
export const RestingHeartRate30DGraph: React.FC<Props> = observer(function RestingHeartRateGraph({
	selectedDay,
	mode = createActiveMode(),
}: Props) {
	const { format } = useI18n();
	const [tags, setTags] = useState<CalendarTag[]>([]);
	const isUSCS = useIsUSCS();
	const {
		measure: {
			hooks: { useLast7DaysRHR, useMonthlyRHR },
		},
		calendar: {
			hooks: { useDailyTags },
		},
	} = useRepresentations();
	const monthlyRhr = useMonthlyRHR(selectedDay);
	const isLoaded = isDefined(monthlyRhr);
	const data = useLast7DaysRHR(selectedDay);
	const lines: Points = monthlyRhr?.series
		? monthlyRhr?.series
				.map((el) => {
					return {
						x: el ? moment(el.date).valueOf() : 0,
						y: el?.value ? el.value : 0,
					};
				})
				.reverse()
		: [];
	const [yMin, yMax] =
		lines.length > 0
			? [Math.min(...lines.filter(({ y }) => y != -1).map((line) => line.y)), Math.max(...lines.map((line) => line.y))]
			: [0, 0];
	const constant = monthlyRhr?.constant;
	const averages: Averages = [];

	const updatedMode = updateMode(mode, data?.controlState !== DataControlState.READY);

	if (isInActiveMode(updatedMode) && isDefined(constant) && constant.average !== 0) {
		averages.push({
			value: constant.average,
			color: colors.red,
		});
	}
	if (isInActiveMode(updatedMode) && isDefined(constant) && constant.reference !== 0) {
		averages.push({
			value: constant.reference,
			color: colors.redLight,
		});
	}

	const toUpdateTag = (x: number) => {
		const date = moment(new Date(x)).format("Y-MM-DD") as ISODay;
		setTags(useDailyTags(date));
	};

	return !isLoaded ? (
		<Spinner size={24} />
	) : !!lines.length ? (
		<View>
			<GraphContainer style={{ height: 400 }}>
				{(isInActiveMode(updatedMode) || isInCalibrationMode(updatedMode)) && (
					<View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
						{tags.map(({ name, id }) => (
							<View key={id} style={{ marginLeft: 8 }}>
								<Tag>{name}</Tag>
							</View>
						))}
					</View>
				)}
				<LineChart
					labelCount={30}
					averages={averages}
					xColor={colors.textPrimary}
					yColor={colors.darkGray}
					data={lines}
					shouldShowLabel={true}
					shouldShowMarker={true}
					shouldDrawCircles={true}
					graphColor={colors.red}
					valueFormatterPattern="EEEEE"
					valueFormatter="date"
					yMin={yMin}
					yMax={yMax}
					mode={updatedMode}
					highlightPerTapEnabled={true}
					isMultipleLines={false}
					daysItem={[{ lines: lines, color: colors.red }]}
					scaleXEnabled={true}
					onSelect={(x) => toUpdateTag(x)}
					xAxisContentInset={15}
					// labelFormatter={(x, y) => {
					// 	return y + "";
					// }}
					labelFormatter={(x, y) => {
						return isUSCS
							? `${dayjs(new Date(x)).format("MM/DD/YYYY")}\n${Math.round(y)}`
							: `${dayjs(new Date(x)).format("DD/MM/YYYY")}\n${Math.round(y)}`;
					}}
				/>
				<View style={{ marginTop: 20 }}>
					<GraphLegend
						mode={updatedMode}
						rows={[
							{
								label: format("activity.resting_heart_rate.30day"),
								element: {
									key: "activity.energy_score.7day",
									node: (
										<View
											style={{
												width: 30,
												marginTop: 5,
											}}
										>
											<DashedLine dashGap={5} dashLength={10} dashColor={colors.red} />
										</View>
									),
								},
								value: isInCalibrationMode(updatedMode)
									? format("calibration.placeholder", { days: updatedMode.nbRemainingDays })
									: isDefined(monthlyRhr?.constant) && monthlyRhr?.constant.average
									? `${monthlyRhr?.constant.average.toFixed(0)} bpm`
									: "- %",
							},
							{
								label: format("activity.resting_heart_rate.reference"),
								element: {
									key: "activity.resting_heart_rate.reference",
									node: (
										<View
											style={{
												width: 30,
												marginTop: 5,
											}}
										>
											<DashedLine dashGap={5} dashLength={10} dashColor={colors.redLight} />
										</View>
									),
								},
								value: isInCalibrationMode(updatedMode)
									? format("calibration.placeholder", { days: updatedMode.nbRemainingDays })
									: isDefined(constant) && monthlyRhr?.constant?.reference != 0
									? `${monthlyRhr?.constant?.reference.toFixed(0)} bpm`
									: "- %",
							},
						]}
					/>
				</View>
			</GraphContainer>
		</View>
	) : (
		<></>
	);
});
