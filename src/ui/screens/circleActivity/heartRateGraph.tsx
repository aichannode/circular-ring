import { useRepresentations } from "@core/representation";
import { isDefined } from "@domain/common/business";
import { ISODay } from "@domain/common/type";
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

const tooltipSize = { width: 40, height: 20 };

export const HeartRateGraph: React.FC<Props> = observer(function HeartRateGraph({
	selectedDay,
	hasNotEnoughData,
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
		dailyHr ? dailyHr.lines : [],
		dailyHr ? dailyHr.constant : { hr: undefined, hrMax: undefined, hrMin: undefined, reference: undefined },
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
			color: colors.red,
		});
	}
	if (typeof constant.hr !== "undefined") {
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
	const shouldDisplay = !hasNotEnoughData;

	return isLoading ? (
		<Spinner size={24} />
	) : (
		<View>
			<TitleText style={{ marginBottom: 20, textAlign: "center", textTransform: "uppercase" }}>
				{format("live.heart_rate.label")}
			</TitleText>

			{/** Wait for available data on week/month */}
			<GraphContainer style={{ height: 600 }}>
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
					labelCount={5}
					averages={averages}
					xColor={colors.textPrimary}
					yColor={colors.darkGray}
					data={lines}
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
					hasNotEnoughData={!shouldDisplay}
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
											<DashedLine dashGap={5} dashLength={10} dashColor={colors.redLight} />
										</View>
									),
								},
								value: typeof constant.hr == "undefined" ? "- bpm" : `${constant.hr} bpm`,
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
								value: typeof constant.reference == "undefined" ? "- bpm" : `${constant.reference} bpm`,
							},
							{
								label: format("hr.hrMax"),
								element: {
									key: "hr.hrMax",
									node: <></>,
								},
								value: typeof constant.hrMax == "undefined" ? "- bpm" : `${constant.hrMax} bpm`,
							},
							{
								label: format("hr.hrMin"),
								element: {
									key: "hr.hrMin",
									node: <></>,
								},

								value: typeof constant.hrMin == "undefined" ? "- bpm" : `${constant.hrMin} bpm`,
							},
						]}
					/>
				</View>
			</GraphContainer>
		</View>
	);
});
