import { useRepresentations } from "@core/representation";
import { isDefined } from "@domain/common/business";
import { ISODay } from "@domain/common/type";
import { useIs24h } from "@domain/user/hooks/useUser";
import { createActiveMode, isInActiveMode, isInCalibrationMode, trimData, TrimOptions, updateMode } from "@ui/business";
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
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import DashedLine from "react-native-dashed-line";

type Props = {
	selectedDay: ISODay;
	mode?: Mode;
	dailyTrimOptions?: TrimOptions;
};

const tooltipSize = { width: 40, height: 20 };

export const DailyHeartRateGraph: React.FC<Props> = observer(function HeartRateGraph({
	selectedDay,
	mode = createActiveMode(),
	dailyTrimOptions,
}: Props) {
	const { format } = useI18n();
	const [isLoading, setLoading] = useState(true);
	const is24h = useIs24h();
	const {
		measure: {
			hooks: { useDailyHRNight, useDailyHRTrend },
		},
		calendar: {
			hooks: { useDailyTags },
		},
	} = useRepresentations();

	const dailyHRNight = useDailyHRNight(selectedDay);

	const dailyHrTrend = useDailyHRTrend(selectedDay);
	const [lines, constant] = [
		dailyHRNight ? dailyHRNight.data : [],
		dailyHRNight ? dailyHRNight.constant : { hr: 0, hrMax: 0, hrMin: 0, reference: 0 },
	];

	const parsedData = dailyTrimOptions ? trimData(lines, (line) => line.x, dailyTrimOptions) : lines;
	const [yMin, yMax] =
		parsedData.length > 0
			? [Math.min(...parsedData.map((line) => line.y)), Math.max(...parsedData.map((line) => line.y))]
			: [0, 0];

	const [yMinIndex, yMaxIndex] = [
		parsedData.findIndex((line) => line.y == yMin),
		parsedData.findIndex((line) => line.y == yMax),
	];
	let xAxisMin, xAxisMax;
	if (isDefined(dailyTrimOptions) && isDefined(dailyTrimOptions.includes)) {
		xAxisMin = Math.min(...dailyTrimOptions.includes.map(([start, end]) => start));
		xAxisMax = Math.min(...dailyTrimOptions.includes.map(([start, end]) => end));
	}
	const tags = useDailyTags(selectedDay);
	const updatedMode = updateMode(mode, parsedData.length === 0);
	const averages: Averages = [];
	if (isInActiveMode(updatedMode) && constant.reference !== -1) {
		averages.push({
			value: constant.reference,
			color: colors.redLight,
		});
	}
	if ((isInActiveMode(updatedMode) || isInCalibrationMode(updatedMode)) && constant.hr !== -1) {
		averages.push({
			value: constant.hr,
			color: colors.darkBlue,
		});
	}

	useEffect(() => {
		if (isDefined(dailyHRNight)) {
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
					labelCount={5}
					yLabelCount={5}
					averages={averages}
					xColor={colors.textPrimary}
					shouldShowLabel={true}
					yColor={colors.darkGray}
					data={parsedData}
					shouldDrawCircles={false}
					graphColor={colors.darkBlue}
					valueFormatter="date"
					valueFormatterPattern={[is24h ? "H'h'" : "h a", is24h ? "H:mm" : "h:mm a"]}
					yMin={yMin}
					yMax={yMax}
					yMinIndex={yMinIndex}
					yMaxIndex={yMaxIndex}
					mode={updatedMode}
					xAxisContentInset={15}
					tooltipYMin={15}
					tooltipYMax={-30}
					tooltipSize={tooltipSize}
					xAxisMin={xAxisMin}
					xAxisMax={xAxisMax}
					renderTooltip={(value) => (
						<>
							<Tag containerStyle={{ backgroundColor: colors.sleepTag, marginBottom: 4 }}>{`${value}`}</Tag>
						</>
					)}
					movingAverage={dailyHrTrend?.data}
					shouldShowMarker={true}
					highlightPerTapEnabled={true}
					labelFormatter={(x, y) => {
						return `${is24h ? dayjs(x).format("HH:mm") : dayjs(x).format("hh:mm A")}\n${Math.round(y)}`;
					}}
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
												width: 30,
												marginTop: 5,
											}}
										>
											<DashedLine dashGap={5} dashLength={10} dashColor={colors.darkBlue} />
										</View>
									),
								},

								value: typeof constant.hr == "undefined" || constant.hr === -1 ? "- bpm" : `${constant.hr} bpm`,
							},
							{
								label: format("hr.reference"),
								element: {
									key: "hr.reference",
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
									: typeof constant.reference == "undefined" || constant.reference === -1
									? "- bpm"
									: `${Math.round(constant.reference)} bpm`,
							},
							{
								label: format("hr.hrMax"),
								element: {
									key: "hr.hrMax",
									node: <></>,
								},
								value:
									typeof constant.hrMax == "undefined" || constant.hrMax === -1 ? "- bpm" : `${constant.hrMax} bpm`,
							},
							{
								label: format("hr.hrMin"),
								element: {
									key: "hr.hrMin",
									node: <></>,
								},

								value:
									typeof constant.hrMin == "undefined" || constant.hrMin === -1 ? "- bpm" : `${constant.hrMin} bpm`,
							},
						]}
					/>
				</View>
			</GraphContainer>
		</View>
	);
});
