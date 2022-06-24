import { useRepresentations } from "@core/representation";
import { isDefined } from "@domain/common/business";
import { ISODay } from "@domain/common/type";
import { Point } from "@domain/measure/representation/api";
import { useIs24h } from "@domain/user/hooks/useUser";
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

export const DailyHRGraph: React.FC<Props> = observer(function HeartRateGraph({
	selectedDay,
	mode = createActiveMode(),
	dailyTrimOptions,
}: Props) {
	const { format } = useI18n();
	const is24h = useIs24h();
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
		? trimData(lines, getTimestampFromValue, { includes: [] }).map((line) => ({
				...line,
				y: isInSomeIntervals(getTimestampFromValue(line), dailyTrimOptions.excludes ?? []) ? 0 : line.y,
		  }))
		: lines;

	// This allows to fix the x axis domain for any data.
	let xAxisMin, xAxisMax;
	if (isDefined(dailyTrimOptions) && isDefined(dailyTrimOptions.includes)) {
		xAxisMin = Math.min(...dailyTrimOptions.includes.map(([start, end]) => start));
		//xAxisMax = Math.max(...dailyTrimOptions.includes.map(([start, end]) => end));
	}

	const [yMin, yMax] =
		parsedLines.length > 0
			? [
					Math.min(...parsedLines.filter((line) => line.y > 0).map((line) => line.y)),
					Math.max(...parsedLines.map((line) => line.y)),
			  ]
			: [0, 0];

	const [yMinIndex, yMaxIndex] = [
		parsedLines.findIndex((line) => line.y == yMin),
		parsedLines.findIndex((line) => line.y == yMax),
	];
	const tags = useDailyTags(selectedDay);
	const updatedMode = updateMode(mode, parsedLines.length === 0);
	const averages: Averages = [];
	console.log({ lines });
	if (isInActiveMode(updatedMode) && constant.reference !== -1) {
		averages.push({
			value: constant.reference,
			color: colors.redLight,
		});
	}
	if ((isInActiveMode(updatedMode) || isInCalibrationMode(updatedMode)) && constant.hr !== -1) {
		averages.push({
			value: constant.hr,
			color: colors.red,
		});
	}

	useEffect(() => {
		if (isDefined(dailyHr)) {
			setLoading(false);
		}
	}, [dailyHr]);

	return (
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
				{isLoading ? (
					<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
						<Spinner size={35} />
					</View>
				) : (
					!!lines && (
						<>
							<LineChart
								labelCount={6}
								averages={averages}
								xColor={colors.textPrimary}
								yColor={colors.darkGray}
								data={parsedLines}
								shouldShowLabel={true}
								shouldDrawCircles={false}
								graphColor={colors.red}
								valueFormatter={"date"}
								valueFormatterPattern={[is24h ? "h'h'" : "h a", is24h ? "h'h':mm" : "h:mm a"]}
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
								shouldShowMarker={true}
								highlightPerTapEnabled={true}
								labelFormatter={(x, y) => {
									return `${
										is24h ? dayjs(new Date(x)).format("HH:mm") : dayjs(new Date(x)).format("hh:mm A")
									}\n${Math.round(y)}`;
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
														<DashedLine dashGap={5} dashLength={10} dashColor={colors.red} />
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
												typeof constant.hrMax == "undefined" || constant.hrMax === -1
													? "- bpm"
													: `${constant.hrMax} bpm`,
										},
										{
											label: format("hr.hrMin"),
											element: {
												key: "hr.hrMin",
												node: <></>,
											},

											value:
												typeof constant.hrMin == "undefined" || constant.hrMin === -1
													? "- bpm"
													: `${constant.hrMin} bpm`,
										},
									]}
								/>
							</View>
						</>
					)
				)}
			</GraphContainer>
		</View>
	);
});
