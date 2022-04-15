import { useRepresentations } from "@core/representation";
import { isDefined } from "@domain/common/business";
import { ISODay } from "@domain/common/type";
import { DataControlState } from "@domain/measure/representation/api";
import { LineChart } from "@ui/components/lineChart/LineChart";
import { GraphContainer } from "@ui/components/measure/graphContainer";
import { GraphLegend } from "@ui/components/measure/graphLegend";
import { Spinner } from "@ui/components/spinner";
import { Tag } from "@ui/components/tag";
import { TitleText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { Averages } from "@ui/type";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import DashedLine from "react-native-dashed-line";
type Props = {
	selectedDay: ISODay;
	hasNotEnoughData: boolean;
};

export const BreathingRateGraph: React.FC<Props> = observer(function BreathingRateGraph({
	selectedDay,
	hasNotEnoughData,
}: Props) {
	const { format } = useI18n();
	const [isLoading, setLoading] = useState(true);

	const {
		measure: {
			hooks: { useDailyBR },
		},
		calendar: {
			hooks: { useDailyTags },
		},
	} = useRepresentations();

	const dailyBr = useDailyBR(selectedDay);

	const [lines, constant] = [
		dailyBr ? dailyBr.lines : [],
		dailyBr ? dailyBr.constant : { average: undefined, reference: undefined },
	];
	const [yMin, yMax] =
		lines.length > 0 ? [Math.min(...lines!.map((line) => line.y)), Math.max(...lines!.map((line) => line.y))] : [0, 0];

	const [yMinIndex, yMaxIndex] = [
		lines!.findIndex((line) => line.y == yMin),
		lines!.findIndex((line) => line.y == yMax),
	];
	const tags = useDailyTags(selectedDay);
	const averages: Averages = [];
	if (typeof constant.reference !== "undefined") {
		averages.push({
			value: constant.reference,
			color: colors.redLight,
		});
	}
	if (typeof constant.average !== "undefined") {
		averages.push({
			value: constant.average,
			color: colors.darkBlue,
		});
	}
	const shouldDisplay = !hasNotEnoughData && dailyBr?.controlState === DataControlState.READY;

	useEffect(() => {
		if (isDefined(lines)) {
			setLoading(false);
		}
	}, [lines]);

	return isLoading ? (
		<Spinner size={24} />
	) : (
		<View>
			<TitleText style={{ marginBottom: 20, textAlign: "center", textTransform: "uppercase" }}>
				{format("score.details.breathing.label")}
			</TitleText>

			{/** Wait for available data on week/month */}
			<GraphContainer style={{ height: 400 }}>
				{shouldDisplay && (
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
					data={lines}
					shouldShowLabel={false}
					shouldDrawCircles={false}
					graphColor={colors.darkBlue}
					valueFormatter="date"
					valueFormatterPattern={["h a", "h:mm a"]}
					yMin={yMin}
					yMax={yMax}
					yMinIndex={yMinIndex}
					yMaxIndex={yMaxIndex}
					hasNotEnoughData={!shouldDisplay}
					labelCount={5}
				/>
				<View style={{ marginTop: 20 }}>
					<GraphLegend
						hasNotEnoughData={!shouldDisplay}
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
									lines.length == 0
										? format("global.no_data")
										: typeof constant.average == "undefined"
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
								value:
									lines.length == 0
										? format("global.no_data")
										: typeof constant.reference == "undefined"
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
