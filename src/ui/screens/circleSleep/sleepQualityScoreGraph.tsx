import { useRepresentations } from "@core/representation";
import { CalendarTag } from "@domain/calendar/calendar";
import { isDefined } from "@domain/common/business";
import { ISODay } from "@domain/common/type";
import { DataControlState, Points } from "@domain/measure/representation/api";
import { TimeFrame } from "@domain/measure/type";
import { useIsUSCS } from "@domain/user/hooks/useUser";
import { createActiveMode, isInActiveMode, isInCalibrationMode, updateMode } from "@ui/business";
import { LineChart } from "@ui/components/lineChart/LineChart";
import { GraphContainer } from "@ui/components/measure/graphContainer";
import { TimeFrameSwitcher } from "@ui/components/measure/timeFrameSwitcher";
import { Spinner } from "@ui/components/spinner";
import { Tag } from "@ui/components/tag";
import { TitleText } from "@ui/components/text";
import { GraphLegend } from "@ui/containers/graphLegend";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { Averages, Mode } from "@ui/type";
import dayjs from "dayjs";
import { observer } from "mobx-react-lite";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import DashedLine from "react-native-dashed-line";

type Props = {
	selectedDay: ISODay;
	mode?: Mode;
};
export const SleepQualityScoreGraph: React.FC<Props> = observer(function EnergyScoreGraph({
	selectedDay,
	mode = createActiveMode(),
}: Props) {
	const { format } = useI18n();
	const isUSCS = useIsUSCS();
	const [isLoading, setLoading] = useState(true);
	const [graphPeriod, setGraphPeriod] = useState(TimeFrame.TODAY);
	const [tags, setTags] = useState<CalendarTag[]>([]);
	const {
		measure: {
			hooks: { useLast7DaysSleepScore },
		},
		calendar: {
			hooks: { useDailyTags },
		},
	} = useRepresentations();
	const data = useLast7DaysSleepScore(selectedDay);
	const lines: Points = data
		? data.series
				.map((el) => {
					return {
						x: el ? moment(el.date).valueOf() : 0,
						y: el?.value ? el.value * 100 : 0,
					};
				})
				.reverse()
		: [];
	const valueFormatter = lines.map(({ x }) => {
		const day = moment(x).format("dd");
		return day !== "Invalid date" ? day[0] : "";
	});
	const [yMin, yMax] =
		lines.length > 0
			? [
					Math.min(...lines.filter((line) => line.y > 0).map((line) => line.y)),
					Math.max(...lines.map((line) => line.y)),
			  ]
			: [0, 0];

	const constant = data?.constant;
	const averages: Averages = [];
	const updatedMode = updateMode(mode, data?.controlState !== DataControlState.READY);

	if (isDefined(constant) && constant.average !== -1) {
		averages.push({
			value: constant.average * 100,
			color: colors.darkBlue,
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

	return isLoading ? (
		<Spinner size={24} />
	) : !!lines.length ? (
		<View>
			<TitleText style={{ marginBottom: 20, textAlign: "center", textTransform: "uppercase" }}>
				{format("sleep.quality_score")}
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
					yMin={yMin}
					yMax={yMax}
					xColor={colors.textPrimary}
					yColor={colors.darkGray}
					daysItem={[{ lines: lines, color: colors.darkBlue }]}
					averages={averages}
					shouldShowLabel={true}
					shouldDrawCircles={true}
					graphColor={colors.darkBlue}
					valueFormatter={valueFormatter}
					shouldShowMarker={true}
					highlightPerTapEnabled={true}
					scaleXEnabled={false}
					onSelect={(x) => toUpdateTag(x)}
					isMultipleLines={true}
					mode={updatedMode}
					labelFormatter={(x, y) => {
						return isUSCS
							? `${dayjs(new Date(x)).format("MM/DD/YYYY")}\n${y}`
							: `${dayjs(new Date(x)).format("DD/MM/YYYY")}\n${y}`;
					}}
				/>
				<View style={{ marginTop: 20 }}>
					<GraphLegend
						mode={updatedMode}
						rows={[
							{
								label: format("activity.energy_score.7day"),
								element: {
									key: "activity.energy_score.7day",
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
									isDefined(constant) && constant.average != -1 ? `${Math.round(constant.average * 100)} %` : "- %",
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
