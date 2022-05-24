import { useRepresentations } from "@core/representation";
import { isDefined } from "@domain/common/business";
import { ISODay } from "@domain/common/type";
import { DataControlState } from "@domain/measure/representation/api";
import { createActiveMode, isInActiveMode, isInCalibrationMode, trimData, TrimOptions, updateMode } from "@ui/business";
import { LineChart } from "@ui/components/lineChart/LineChart";
import { GraphContainer } from "@ui/components/measure/graphContainer";
import { Spinner } from "@ui/components/spinner";
import { Tag } from "@ui/components/tag";
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

export const DailySpo2Graph: React.FC<Props> = observer(function Spo2Graph({
	selectedDay,
	mode = createActiveMode(),
	dailyTrimOptions,
}: Props) {
	const { format } = useI18n();
	const [isLoading, setLoading] = useState(true);

	const {
		measure: {
			hooks: { useDailySpo2 },
		},
		calendar: {
			hooks: { useDailyTags },
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
	const tags = useDailyTags(selectedDay);

	const averages: Averages = [];
	if (isInActiveMode(updatedMode) && isDefined(constant)) {
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

	useEffect(() => {
		if (isDefined(lines)) {
			setLoading(false);
		}
	}, [lines]);

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
					data={parsedLines}
					shouldShowLabel={true}
					shouldShowMarker={true}
					shouldDrawCircles={false}
					graphColor={colors.darkBlue}
					valueFormatter="date"
					valueFormatterPattern={["h a", "h:mm a"]}
					yMin={yMin}
					yMax={yMax}
					yMinIndex={yMinIndex}
					yMaxIndex={yMaxIndex}
					mode={updatedMode}
					shouldUpdateYmin={false}
					highlightPerTapEnabled={true}
					isDaily
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
									: parsedLines.length == 0
									? format("global.no_data")
									: typeof constant.reference == "undefined" || constant.reference === -1
									? "- %"
									: `${constant.reference} %`,
							},
						]}
					/>
				</View>
			</GraphContainer>
		</View>
	);
});
