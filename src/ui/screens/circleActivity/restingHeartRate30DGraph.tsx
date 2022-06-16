import { useRepresentations } from "@core/representation";
import { CalendarTag } from "@domain/calendar/calendar";
import { isDefined } from "@domain/common/business";
import { ISODay } from "@domain/common/type";
import { DataControlState, Points } from "@domain/measure/representation/api";
import { createActiveMode, isInActiveMode, isInCalibrationMode, updateMode } from "@ui/business";
import { LineChart } from "@ui/components/lineChart/LineChart";
import { GraphContainer } from "@ui/components/measure/graphContainer";
import { Spinner } from "@ui/components/spinner";
import { Tag } from "@ui/components/tag";
import { GraphLegend } from "@ui/containers/graphLegend";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { Averages, Mode } from "@ui/type";
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
	const {
		measure: {
			hooks: { useLast7DaysRHR, useMonthlyRHR },
		},
		calendar: {
			hooks: { useDailyTags },
		},
	} = useRepresentations();
	const { isLoading, RHR30daysMetrics, RHR30daysConstants } = useMonthlyRHR(selectedDay);
	const data = useLast7DaysRHR(selectedDay);
	const lines: Points = RHR30daysMetrics
		? RHR30daysMetrics.map((el) => {
				return {
					x: el ? moment(el.date).valueOf() : 0,
					y: el?.value ? el.value : 0,
				};
		  }).reverse()
		: [];
	const valueFormatter = lines.map(({ x }) => {
		const day = moment(x).format("dd");
		return day !== "Invalid date" ? day[0] : "";
	});
	const [yMin, yMax] =
		lines.length > 0 ? [Math.min(...lines.map((line) => line.y)), Math.max(...lines.map((line) => line.y))] : [0, 0];
	const constant = RHR30daysConstants;
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
			color: colors.redOrange,
		});
	}

	const toUpdateTag = (x: number) => {
		const date = moment(lines[x].x).format("Y-MM-DD") as ISODay;
		setTags(useDailyTags(date));
	};

	return isLoading ? (
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
					yMin={yMin}
					yMax={yMax}
					xColor={colors.textPrimary}
					yColor={colors.darkGray}
					daysItem={[{ lines: lines, color: colors.red }]}
					averages={averages}
					shouldShowLabel={true}
					shouldDrawCircles={true}
					graphColor={colors.red}
					valueFormatter={valueFormatter}
					shouldShowMarker={true}
					highlightPerTapEnabled={true}
					scaleXEnabled={true}
					onSelect={(x) => toUpdateTag(x)}
					isMultipleLines={true}
					mode={updatedMode}
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
												width: 40,
												marginTop: 5,
											}}
										>
											<DashedLine dashGap={5} dashLength={10} dashColor={colors.red} />
										</View>
									),
								},
								value: isInCalibrationMode(updatedMode)
									? format("calibration.placeholder", { days: updatedMode.nbRemainingDays })
									: isDefined(RHR30daysConstants) && RHR30daysConstants.average
									? `${RHR30daysConstants.average.toFixed(0)} bpm`
									: "- %",
							},
							{
								label: format("activity.resting_heart_rate.reference"),
								element: {
									key: "activity.resting_heart_rate.reference",
									node: (
										<View
											style={{
												width: 40,
												marginTop: 5,
											}}
										>
											<DashedLine dashGap={5} dashLength={10} dashColor={colors.orange} />
										</View>
									),
								},
								value: isInCalibrationMode(updatedMode)
									? format("calibration.placeholder", { days: updatedMode.nbRemainingDays })
									: isDefined(constant) && RHR30daysConstants?.reference != 0
									? `${RHR30daysConstants?.reference.toFixed(0)} bpm`
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
