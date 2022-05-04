import { useRepresentations } from "@core/representation";
import { isDefined } from "@domain/common/business";
import { ISODay } from "@domain/common/type";
import { createActiveMode, isInActiveMode, isInCalibrationMode } from "@ui/business";
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
};

const tooltipSize = { width: 40, height: 20 };

export const HeartRateGraph: React.FC<Props> = observer(function HeartRateGraph({
	selectedDay,
	mode = createActiveMode(),
}: Props) {
	const { format } = useI18n();
	const [isLoading, setLoading] = useState(true);

	const {
		measure: {
			hooks: { useDailyHRNight },
		},
		calendar: {
			hooks: { useDailyTags },
		},
	} = useRepresentations();

	const dailyHRNight = useDailyHRNight(selectedDay);
	const [lines, constant] = [
		dailyHRNight ? dailyHRNight.data : [],
		dailyHRNight ? dailyHRNight.constant : { hr: 0, hrMax: 0, hrMin: 0, reference: 0 },
	];

	const [yMin, yMax] =
		lines.length > 0 ? [Math.min(...lines.map((line) => line.y)), Math.max(...lines.map((line) => line.y))] : [0, 0];

	const [yMinIndex, yMaxIndex] = [lines.findIndex((line) => line.y == yMin), lines.findIndex((line) => line.y == yMax)];
	const tags = useDailyTags(selectedDay);
	const averages: Averages = [];
	if (isInActiveMode(mode)) {
		if (constant.reference !== 0) {
			averages.push({
				value: constant.reference,
				color: colors.redLight,
			});
		}
		if (constant.hr !== 0) {
			averages.push({
				value: constant.hr,

				color: colors.darkBlue,
			});
		}
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
			<TitleText style={{ marginBottom: 20, textAlign: "center", textTransform: "uppercase" }}>
				{format("live.heart_rate.label")}
			</TitleText>

			{/** Wait for available data on week/month */}
			<GraphContainer style={{ height: 600 }}>
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
					averages={averages}
					xColor={colors.textPrimary}
					shouldShowLabel={true}
					yColor={colors.darkGray}
					data={lines}
					shouldDrawCircles={false}
					graphColor={colors.darkBlue}
					valueFormatter="date"
					valueFormatterPattern={["h a", "h:mm a"]}
					yMin={yMin}
					yMax={yMax}
					yMinIndex={yMinIndex}
					yMaxIndex={yMaxIndex}
					mode={mode}
					xAxisContentInset={15}
					tooltipYMin={15}
					tooltipYMax={-30}
					tooltipSize={tooltipSize}
					renderTooltip={(value) => (
						<>
							<Tag containerStyle={{ backgroundColor: colors.sleepTag, marginBottom: 4 }}>{`${value}`}</Tag>
						</>
					)}
				/>
				<View style={{ marginTop: 20 }}>
					<GraphLegend
						mode={mode}
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

								value: isInCalibrationMode(mode)
									? format("calibration.placeholder", { days: mode.nbRemainingDays })
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
											<DashedLine dashGap={5} dashLength={10} dashColor={colors.redLight} />
										</View>
									),
								},
								value: isInCalibrationMode(mode)
									? format("calibration.placeholder", { days: mode.nbRemainingDays })
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
								value: isInCalibrationMode(mode)
									? format("calibration.placeholder", { days: mode.nbRemainingDays })
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

								value: isInCalibrationMode(mode)
									? format("calibration.placeholder", { days: mode.nbRemainingDays })
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
