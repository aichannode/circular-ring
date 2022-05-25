import { useRepresentations } from "@core/representation";
import { CalendarTag } from "@domain/calendar/calendar";
import { isDefined } from "@domain/common/business";
import { ISODay } from "@domain/common/type";
import { DataControlState } from "@domain/measure/representation/api";
import { createActiveMode, isInActiveMode, isInCalibrationMode, TrimOptions, updateMode } from "@ui/business";
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
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import DashedLine from "react-native-dashed-line";
type Props = {
	selectedDay: ISODay;
	mode?: Mode;
	dailyTrimOptions?: TrimOptions;
};

export const HrGraph30days: React.FC<Props> = observer(function HeartRateGraph({
	selectedDay,
	mode = createActiveMode(),
	dailyTrimOptions,
}: Props) {
	const { format } = useI18n();
	const [isLoading, setLoading] = useState(true);
	const [tags, setTags] = useState<CalendarTag[]>([]);
	const {
		measure: {
			hooks: { useLast30DaysHrNight },
		},
		calendar: {
			hooks: { useDailyTags },
		},
	} = useRepresentations();

	const dailyHRNight = useLast30DaysHrNight(selectedDay);
	const [lines, constant] = [
		dailyHRNight
			? dailyHRNight.series
					.map((el) => {
						return {
							x: el ? moment(el.date).valueOf() : 0,
							y: el?.value ? el.value : 0,
						};
					})
					.reverse()
			: [],
		dailyHRNight ? dailyHRNight.constant : { max: -1, min: -1, average: -1, reference: -1 },
	];
	const updatedMode = updateMode(mode, dailyHRNight?.controlState !== DataControlState.READY);

	const [yMin, yMax] =
		lines.length > 0
			? [
					Math.min(...lines.filter((line) => line.y > 0).map((line) => line.y)),
					Math.max(...lines.map((line) => line.y)),
			  ]
			: [0, 0];
	const averages: Averages = [];
	if (isInActiveMode(updatedMode)) {
		if (constant.reference !== -1) {
			averages.push({
				value: constant.reference,
				color: colors.redLight,
			});
		}
		if (constant.average !== -1) {
			averages.push({
				value: constant.average,

				color: colors.darkBlue,
			});
		}
	}

	const toUpdateTag = (x: number) => {
		const date = moment(lines[x].x).format("Y-MM-DD") as ISODay;
		setTags(useDailyTags(date));
	};

	useEffect(() => {
		if (isDefined(lines)) {
			setLoading(false);
		}
	}, [dailyHRNight]);

	return isLoading ? (
		<Spinner size={24} />
	) : (
		<View>
			{/** Wait for available data on week/month */}
			<GraphContainer style={{ height: 400 }}>
				{(isInActiveMode(mode) || isInCalibrationMode(mode)) && (
					<View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
						{tags.map(({ name, id }) => (
							<View key={id} style={{ marginLeft: 8 }}>
								<Tag>{name}</Tag>
							</View>
						))}
					</View>
				)}
				<LineChart
					labelCount={20}
					averages={averages}
					xColor={colors.textPrimary}
					yColor={colors.darkGray}
					daysItem={[{ lines: lines, color: colors.darkBlue }]}
					shouldShowLabel={true}
					shouldShowMarker={true}
					shouldDrawCircles={false}
					graphColor={colors.darkBlue}
					valueFormatter={lines.map((item) => moment(item.x).format("dd")[0])}
					yMin={yMin}
					yMax={yMax}
					mode={updatedMode}
					shouldUpdateYmin={false}
					highlightPerTapEnabled={true}
					isMultipleLines={true}
					zoom={
						lines?.length > 0
							? {
									scaleX: 2,
									scaleY: 1,
									xValue: lines[lines.length - 1].x,
									yValue: 1,
							  }
							: undefined
					}
					onSelect={(x) => toUpdateTag(x)}
				/>
				<View style={{ marginTop: 20 }}>
					<GraphLegend
						mode={updatedMode}
						rows={[
							{
								label: format("hr.average"),
								element: {
									key: "hr.average",
									node: (
										<View
											style={{
												width: 40,
												marginTop: 5,
											}}
										>
											<DashedLine dashGap={5} dashLength={10} dashColor={colors.darkBlue} />
										</View>
									),
								},

								value:
									typeof constant.average == "undefined" || constant.average === -1
										? "- bpm"
										: `${constant.average} bpm`,
							},
							{
								label: format("hr.reference"),
								element: {
									key: "hr.reference",
									node: (
										<View
											style={{
												width: 40,
												marginTop: 5,
											}}
										>
											<DashedLine dashGap={5} dashLength={10} dashColor={colors.redLight} />
										</View>
									),
								},
								value: isInCalibrationMode(updatedMode)
									? format("calibration.placeholder", { days: updatedMode.nbRemainingDays })
									: typeof constant.reference == "undefined" || constant.reference === -1
									? "- bpm"
									: `${constant.reference} bpm`,
							},
							{
								label: format("hr.hrMax"),
								element: {
									key: "hr.hrMax",
									node: <></>,
								},
								value: typeof constant.max == "undefined" || constant.max === -1 ? "- bpm" : `${constant.max} bpm`,
							},
							{
								label: format("hr.hrMin"),
								element: {
									key: "hr.hrMin",
									node: <></>,
								},

								value: typeof constant.min == "undefined" || constant.max === -1 ? "- bpm" : `${constant.min} bpm`,
							},
						]}
					/>
				</View>
			</GraphContainer>
		</View>
	);
});
