import { useRepresentations } from "@core/representation";
import { CalendarTag } from "@domain/calendar/calendar";
import { isDefined } from "@domain/common/business";
import { ISODay } from "@domain/common/type";
import { DataControlState, Lines } from "@domain/measure/representation/api";
import { TimeFrame } from "@domain/measure/type";
import { LineChart } from "@ui/components/lineChart/LineChart";
import { GraphContainer } from "@ui/components/measure/graphContainer";
import { GraphLegend } from "@ui/components/measure/graphLegend";
import { TimeFrameSwitcher } from "@ui/components/measure/timeFrameSwitcher";
import { Spinner } from "@ui/components/spinner";
import { Tag } from "@ui/components/tag";
import { TitleText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { Averages } from "@ui/type";
import { observer } from "mobx-react-lite";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import DashedLine from "react-native-dashed-line";

type Props = {
	selectedDay: ISODay;
	hasNotEnoughData: boolean;
};
export const EnergyScoreGraph: React.FC<Props> = observer(function EnergyScoreGraph({
	selectedDay,
	hasNotEnoughData,
}: Props) {
	const { format } = useI18n();
	const [isLoading, setLoading] = useState(true);
	const [graphPeriod, setGraphPeriod] = useState(TimeFrame.TODAY);
	const [tags, setTags] = useState<CalendarTag[]>([]);
	const {
		measure: {
			hooks: { useLast7DaysEnergyScore },
		},
		calendar: {
			hooks: { useDailyTags },
		},
	} = useRepresentations();
	const data = useLast7DaysEnergyScore(selectedDay);
	const lines: Lines = data
		? data.series
				.map((el) => {
					return {
						x: el ? moment(el.date).valueOf() : 0,
						y: el?.value ? el.value * 100 : 0,
					};
				})
				.reverse()
		: [];
	const valueFormatter = lines.map(({ x, y }) => {
		const day = moment(x).format("dd");
		return day !== "Invalid date" ? day[0] : "";
	});
	const [yMin, yMax] =
		lines.length > 0 ? [Math.min(...lines!.map((line) => line.y)), Math.max(...lines!.map((line) => line.y))] : [0, 0];
	const constant = data?.constant;
	const averages: Averages = [];
	if (typeof constant !== "undefined") {
		averages.push({
			value: constant?.average,
			color: colors.red,
		});
	}

	useEffect(() => {
		if (isDefined(data)) {
			setLoading(false);
		}
	}, [data]);

	const toUpdateTag = (x: number) => {
		const date = moment(lines[x].x).format("Y-MM-DD") as ISODay;
		setTags(useDailyTags(date));
	};
	const shouldDisplay = !hasNotEnoughData && data?.controlState === DataControlState.READY;

	return isLoading ? (
		<Spinner size={24} />
	) : !!lines.length ? (
		<View>
			<TitleText style={{ marginBottom: 20, textAlign: "center", textTransform: "uppercase" }}>
				{format("activity.energy_score")}
			</TitleText>
			<View style={{ display: "none" }}>
				<TimeFrameSwitcher
					setGraphPeriod={setGraphPeriod}
					graphPeriod={graphPeriod}
					color={colors.business.actuvityPrimary}
					frames={[
						{
							label: "graph.time_frame.today",
							duration: TimeFrame.TODAY,
						},
						{
							label: "graph.time_frame.7days",
							duration: TimeFrame.LAST_7_DAYS,
						},
						{
							label: "graph.time_frame.all",
							duration: TimeFrame.ALL,
						},
					]}
				/>
			</View>

			<GraphContainer style={{ height: 400, marginTop: 20 }}>
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
					yMin={yMin}
					yMax={yMax}
					xColor={colors.textPrimary}
					yColor={colors.darkGray}
					daysItem={[{ lines: lines, color: colors.red }]}
					averages={averages}
					shouldShowLabel={true}
					shouldDrawCircles={true}
					graphColor={colors.red}
					valueFormatter={valueFormatter}
					shouldShowMarker={true}
					highlightPerTapEnabled={true}
					scaleXEnabled={false}
					onSelect={(x) => toUpdateTag(x)}
					isMultipleLines={true}
					hasNotEnoughData={!shouldDisplay}
				/>
				<View style={{ marginTop: 20 }}>
					<GraphLegend
						hasNotEnoughData={!shouldDisplay}
						rows={[
							{
								label: format("activity.energy_score.7day"),
								element: {
									key: "activity.energy_score.7day",
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
								value: constant ? `${constant?.average} %` : "- %",
							},
						]}
					/>
				</View>
			</GraphContainer>
		</View>
	) : (
		<></>
	);
});
