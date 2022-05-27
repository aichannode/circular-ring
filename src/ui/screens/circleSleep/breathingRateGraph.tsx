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

export const BreathingRateGraph: React.FC<Props> = observer(function BreathingRateGraph({
	selectedDay,
	mode = createActiveMode(),
	dailyTrimOptions,
}: Props) {
	const { format, formatHour } = useI18n();
	const [isLoading, setLoading] = useState(true);
	const is24h = useIs24h();
	const {
		measure: {
			hooks: { useDailyBR },
		},
		calendar: {
			hooks: { useDailyTags },
		},
	} = useRepresentations();

	const dailyBr = useDailyBR(selectedDay);
	const [data, constant] = [dailyBr ? dailyBr.data : [], dailyBr ? dailyBr.constant : { average: 0, reference: 0 }];

	const parsedData = dailyTrimOptions ? trimData(data, (line) => line.x, dailyTrimOptions) : data;

	const updatedMode = updateMode(mode, dailyBr?.controlState !== DataControlState.READY);
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
	if (isInCalibrationMode(updatedMode) && constant.reference !== -1) {
		averages.push({
			value: constant.reference,
			color: colors.redLight,
		});
	}
	if (isInActiveMode(updatedMode) && constant.average !== -1) {
		averages.push({
			value: constant.average,
			color: colors.darkBlue,
		});
	}
	useEffect(() => {
		if (isDefined(data)) {
			setLoading(false);
		}
	}, [data]);

	return isLoading ? (
		<Spinner size={24} />
	) : (
		<View>
			<TitleText style={{ marginBottom: 20, textAlign: "center", textTransform: "uppercase" }}>
				{format("score.details.breathing.label")}
			</TitleText>

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
					averages={averages}
					xColor={colors.textPrimary}
					yColor={colors.darkGray}
					data={parsedData}
					shouldShowLabel={false}
					shouldDrawCircles={false}
					graphColor={colors.darkBlue}
					valueFormatter="date"
					valueFormatterPattern={["h a", "h:mm a"]}
					yMin={yMin}
					yMax={yMax}
					yMinIndex={yMinIndex}
					yMaxIndex={yMaxIndex}
					mode={updatedMode}
					labelCount={5}
					highlightPerTapEnabled={true}
					shouldShowMarker={true}
					labelFormatter={(x, y) => {
						return `${formatHour(new Date(x), is24h)}\n${Math.round(y)}`;
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
										: typeof constant.average == "undefined" || constant.average == 0
										? "- rpm"
										: `${constant.average.toFixed(1)} rpm`,
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
									: typeof constant.reference == "undefined" || constant.reference == 0
									? "- rpm"
									: `${constant.reference.toFixed(1)} rpm`,
							},
						]}
					/>
				</View>
			</GraphContainer>
		</View>
	);
});
