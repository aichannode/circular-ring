import { useRepresentations } from "@core/representation";
import { isDefined } from "@domain/common/business";
import { ISODay } from "@domain/common/type";
import { Point } from "@domain/measure/representation/api";
import {
	createActiveMode,
	isInActiveMode,
	isInCalibrationMode,
	isInSomeIntervals,
	trimData,
	TrimOptions,
	updateMode,
} from "@ui/business";
import { LineChart } from "@ui/components/lineChart/LineChart";
import { GraphContainer } from "@ui/components/measure/graphContainer";
import { Spinner } from "@ui/components/spinner";
import { Tag } from "@ui/components/tag";
import { TitleText } from "@ui/components/text";
import { GraphLegend } from "@ui/containers/graphLegend";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { Averages, Mode } from "@ui/type";
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

export const HeartRateGraph: React.FC<Props> = observer(function HeartRateGraph({
	selectedDay,
	mode = createActiveMode(),
	dailyTrimOptions,
}: Props) {
	const { format } = useI18n();
	const [isLoading, setLoading] = useState(true);

	const {
		measure: {
			hooks: { useDailyHR },
		},
		calendar: {
			hooks: { useDailyTags },
		},
	} = useRepresentations();

	const dailyHr = useDailyHR(selectedDay);
	const [lines, constant] = [
		dailyHr ? dailyHr.data : [],
		dailyHr ? dailyHr.constant : { hr: 0, hrMax: 0, hrMin: 0, reference: 0 },
	];

	const getTimestampFromValue = (line: Point) => line.x;
	const parsedLines = dailyTrimOptions
		? trimData(lines, getTimestampFromValue, { includes: dailyTrimOptions.includes }).map((line) => ({
				...line,
				y: isInSomeIntervals(getTimestampFromValue(line), dailyTrimOptions.excludes ?? []) ? 0 : line.y,
		  }))
		: lines;

	// This allows to fix the x axis domain for any data.
	let xAxisMin, xAxisMax;
	if (isDefined(dailyTrimOptions) && isDefined(dailyTrimOptions.includes)) {
		xAxisMin = Math.min(...dailyTrimOptions.includes.map(([start, end]) => start));
		xAxisMax = Math.min(...dailyTrimOptions.includes.map(([start, end]) => end));
	}

	const [yMin, yMax] =
		parsedLines.length > 0
			? [Math.min(...parsedLines.map((line) => line.y)), Math.max(...parsedLines.map((line) => line.y))]
			: [0, 0];

	const [yMinIndex, yMaxIndex] = [
		parsedLines.findIndex((line) => line.y == yMin),
		parsedLines.findIndex((line) => line.y == yMax),
	];
	const tags = useDailyTags(selectedDay);
	const updatedMode = updateMode(mode, parsedLines.length === 0);
	const averages: Averages = [];
	if (isInActiveMode(updatedMode) && constant.reference !== 0) {
		averages.push({
			value: constant.reference,
			color: colors.red,
		});
	}
	if (isInActiveMode(updatedMode) && constant.hr !== 0) {
		averages.push({
			value: constant.hr,

			color: colors.redLight,
		});
	}

	useEffect(() => {
		if (isDefined(dailyHr)) {
			setLoading(false);
		}
	}, [dailyHr]);

	return isLoading ? (
		<Spinner size={24} />
	) : (
		<View>
			<TitleText style={{ marginBottom: 20, textAlign: "center", textTransform: "uppercase" }}>
				{format("live.heart_rate.label")}
			</TitleText>

			{/** Wait for available data on week/month */}
			<GraphContainer style={{ height: 600 }}>
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
					labelCount={5}
					averages={averages}
					xColor={colors.textPrimary}
					yColor={colors.darkGray}
					data={parsedLines}
					shouldShowLabel={true}
					shouldDrawCircles={false}
					graphColor={colors.red}
					valueFormatter="date"
					valueFormatterPattern={["H'h'", "HH'h':mm"]}
					yMin={yMin}
					yMax={yMax}
					yMinIndex={yMinIndex}
					yMaxIndex={yMaxIndex}
					xAxisContentInset={15}
					tooltipYMin={15}
					tooltipYMax={-30}
					tooltipSize={tooltipSize}
					renderTooltip={(value) => (
						<>
							<Tag containerStyle={{ backgroundColor: colors.red, marginBottom: 4 }}>{`${value}`}</Tag>
						</>
					)}
					mode={updatedMode}
					xAxisMin={xAxisMin}
					xAxisMax={xAxisMax}
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
											<DashedLine dashGap={5} dashLength={10} dashColor={colors.redLight} />
										</View>
									),
								},

								value: isInCalibrationMode(updatedMode)
									? format("calibration.placeholder", { days: updatedMode.nbRemainingDays })
									: typeof constant.hr == "undefined" || constant.hr === 0
									? "- bpm"
									: `${constant.hr} bpm`,
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
											<DashedLine dashGap={5} dashLength={10} dashColor={colors.red} />
										</View>
									),
								},
								value: isInCalibrationMode(updatedMode)
									? format("calibration.placeholder", { days: updatedMode.nbRemainingDays })
									: typeof constant.reference == "undefined" || constant.reference === 0
									? "- bpm"
									: `${constant.reference} bpm`,
							},
							{
								label: format("hr.hrMax"),
								element: {
									key: "hr.hrMax",
									node: <></>,
								},
								value: isInCalibrationMode(updatedMode)
									? format("calibration.placeholder", { days: updatedMode.nbRemainingDays })
									: typeof constant.hrMax == "undefined" || constant.hrMax === 0
									? "- bpm"
									: `${constant.hrMax} bpm`,
							},
							{
								label: format("hr.hrMin"),
								element: {
									key: "hr.hrMin",
									node: <></>,
								},

								value: isInCalibrationMode(updatedMode)
									? format("calibration.placeholder", { days: updatedMode.nbRemainingDays })
									: typeof constant.hrMin == "undefined" || constant.hrMin === 0
									? "- bpm"
									: `${constant.hrMin} bpm`,
							},
						]}
					/>
				</View>
			</GraphContainer>
		</View>
	);
});
