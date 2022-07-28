import { useRepresentations } from "@core/representation";
import { isDefined } from "@domain/common/business";
import { ISODay } from "@domain/common/type";
import { DataControlState } from "@domain/measure/representation/api";
import { useIs24h } from "@domain/user/hooks/useUser";
import { createActiveMode, isInActiveMode, isInCalibrationMode, trimData, TrimOptions, updateMode } from "@ui/business";
import { DailyTags } from "@ui/components/dailyTags";
import { LineChart } from "@ui/components/lineChart/LineChart";
import { GraphContainer } from "@ui/components/measure/graphContainer";
import { Spinner } from "@ui/components/spinner";
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

export const DailySpo2Graph: React.FC<Props> = observer(function Spo2Graph({
	selectedDay,
	mode = createActiveMode(),
	dailyTrimOptions,
}: Props) {
	const { format } = useI18n();
	const [isLoading, setLoading] = useState(true);
	const is24h = useIs24h();

	const {
		measure: {
			hooks: { useDailySpo2 },
		},
	} = useRepresentations();

	const dailySpo2 = useDailySpo2(selectedDay);
	const [lines, constant] = [
		dailySpo2 ? dailySpo2.data : [],
		dailySpo2 ? dailySpo2.constant : { average: 0, reference: 0 },
	];

	const parsedLines = dailyTrimOptions ? trimData(lines, (line) => line.x, dailyTrimOptions) : lines;

	const updatedMode = updateMode(mode, dailySpo2?.controlState !== DataControlState.READY);

	const [yMin, yMax] =
		parsedLines.length > 0
			? [Math.min(...parsedLines.map((line) => line.y)), Math.max(...parsedLines.map((line) => line.y))]
			: [0, 0];
	const [yMinIndex, yMaxIndex] = [
		parsedLines.findIndex((line) => line.y == yMin),
		parsedLines.findIndex((line) => line.y == yMax),
	];

	let xAxisMin, xAxisMax;
	if (isDefined(dailyTrimOptions) && isDefined(dailyTrimOptions.includes)) {
		xAxisMin = Math.min(...dailyTrimOptions.includes.map(([start, end]) => start));
		xAxisMax = Math.min(...dailyTrimOptions.includes.map(([start, end]) => end));
	}
	const averages: Averages = [];
	if (
		(isInActiveMode(updatedMode) || isInCalibrationMode(updatedMode)) &&
		isDefined(constant) &&
		constant.average !== -1
	) {
		averages.push({
			value: constant.average,
			color: colors.darkBlue,
		});
	}
	if (isInActiveMode(updatedMode) && isDefined(constant) && constant.reference !== -1) {
		averages.push({
			value: constant.reference,
			color: colors.redLight,
		});
	}
	useEffect(() => {
		if (isDefined(lines)) {
			setLoading(false);
		}
	}, [lines]);

	return (
		<View>
			{/** Wait for available data on week/month */}
			<GraphContainer style={{ height: 400 }}>
				<DailyTags selectedDay={selectedDay}></DailyTags>
				{isLoading ? (
					<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
						<Spinner size={35} />
					</View>
				) : (
					<>
						<LineChart
							labelCount={5}
							yLabelCount={5}
							averages={averages}
							xColor={colors.textPrimary}
							yColor={colors.darkGray}
							data={parsedLines}
							shouldShowLabel={true}
							shouldShowMarker={true}
							shouldDrawCircles={false}
							graphColor={colors.darkBlue}
							valueFormatter="date"
							valueFormatterPattern={[is24h ? "H'h'" : "h a", is24h ? "H'h'mm" : "h:mm a"]}
							yMin={yMin}
							yMax={99}
							yMinIndex={yMinIndex}
							yMaxIndex={yMaxIndex}
							mode={updatedMode}
							shouldUpdateYmin={false}
							highlightPerTapEnabled={true}
							xAxisMin={xAxisMin}
							xAxisMax={xAxisMax}
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
													<DashedLine dashGap={5} dashLength={10} dashColor={colors.darkBlue} />
												</View>
											),
										},
										value:
											parsedLines.length == 0
												? format("global.no_data")
												: typeof constant.average == "undefined" || constant.average === -1
												? "- %"
												: `${constant.average} %`,
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
											: parsedLines.length == 0
											? format("global.no_data")
											: typeof constant.reference == "undefined" || constant.reference === -1
											? "- %"
											: `${constant.reference} %`,
									},
								]}
							/>
						</View>
					</>
				)}
			</GraphContainer>
		</View>
	);
});
