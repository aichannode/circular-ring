import { useRepresentations } from "@core/representation";
import { isDefined } from "@domain/common/business";
import { ISODay } from "@domain/common/type";
import { DataControlState } from "@domain/measure/representation/api";
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

export const DailyHRVGraph: React.FC<Props> = observer(function HRVGraph({
	selectedDay,
	mode = createActiveMode(),
	dailyTrimOptions,
}: Props) {
	const { format } = useI18n();
	const [isLoading, setLoading] = useState(true);
	const is24h = useIs24h();
	const {
		measure: {
			hooks: { useDailyHRV, useDailyHRVTrend },
		},
		calendar: {
			hooks: { useDailyTags },
		},
	} = useRepresentations();

	const dailyHrv = useDailyHRV(selectedDay);
	const dailyHrvTrend = useDailyHRVTrend(selectedDay);
	const [lines, constant] = [
		dailyHrv ? dailyHrv.data : [],
		dailyHrv ? dailyHrv.constant : { average: 0, reference: 0 },
	];
	const parsedData = dailyTrimOptions ? trimData(lines, (line) => line.x, dailyTrimOptions) : lines;

	parsedData.sort(function (a, b) {
		return a.x - b.x;
	});
	const [yMin, yMax] =
		parsedData.length > 0
			? [Math.min(...parsedData.map((line) => line.y)), Math.max(...parsedData.map((line) => line.y))]
			: [0, 0];

	const [yMinIndex, yMaxIndex] = [
		parsedData.findIndex((line) => line.y == yMin),
		parsedData.findIndex((line) => line.y == yMax),
	];
	const tags = useDailyTags(selectedDay);
	const averages: Averages = [];
	const updatedMode = updateMode(mode, dailyHrv?.controlState !== DataControlState.READY);
	if (isInActiveMode(updatedMode) && isDefined(constant) && constant.reference !== -1) {
		{
			averages.push({
				value: constant.reference,
				color: colors.redLight,
			});
		}
	}

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

	useEffect(() => {
		if (isDefined(dailyHrv)) {
			setLoading(false);
		}
	}, [dailyHrv]);

	return isLoading ? (
		<Spinner size={24} />
	) : (
		<View>
			{/** Wait for available data on week/month */}
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
					labelCount={5}
					averages={averages}
					xColor={colors.textPrimary}
					yColor={colors.darkGray}
					data={parsedData}
					shouldShowLabel={false}
					shouldDrawCircles={false}
					graphColor={colors.darkBlue}
					valueFormatter="date"
					valueFormatterPattern={[is24h ? "h" : "h a", is24h ? "h:mm" : "h:mm a"]}
					yMin={yMin}
					yMax={yMax}
					yMinIndex={yMinIndex}
					yMaxIndex={yMaxIndex}
					mode={updatedMode}
					movingAverage={dailyHrvTrend?.data}
					shouldShowMarker={true}
					highlightPerTapEnabled={true}
					labelFormatter={(x, y) => {
						return `${is24h ? dayjs(new Date(x)).format("HH:mm") : dayjs(new Date(x)).format("hh:mm A")}\n${Math.round(
							y
						)}`;
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
												width: 40,
												marginTop: 5,
											}}
										>
											<DashedLine dashGap={5} dashLength={10} dashColor={colors.darkBlue} />
										</View>
									),
								},
								value:
									parsedData.length == 0
										? format("global.no_data")
										: typeof constant.average == "undefined" || constant.average === 0
										? "- ms"
										: `${constant.average} ms`,
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
									: parsedData.length == 0
									? format("global.no_data")
									: typeof constant.reference == "undefined" || constant.reference === 0
									? "- ms"
									: `${constant.reference} ms`,
							},
						]}
					/>
				</View>
			</GraphContainer>
		</View>
	);
});
