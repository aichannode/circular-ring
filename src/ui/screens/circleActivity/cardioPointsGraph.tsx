import { useRepresentations } from "@core/representation";
import { CalendarTag } from "@domain/calendar/calendar";
import { isDefined } from "@domain/common/business";
import { ISODay } from "@domain/common/type";
import { DataControlState, Points } from "@domain/measure/representation/api";
import { TimeFrame } from "@domain/measure/type";
import { createActiveMode, isInActiveMode, isInCalibrationMode, updateMode } from "@ui/business";
import { BarChart } from "@ui/components/measure/barChart";
import { GraphContainer } from "@ui/components/measure/graphContainer";
import { TimeFrameSwitcher } from "@ui/components/measure/timeFrameSwitcher";
import { Spinner } from "@ui/components/spinner";
import { Tag } from "@ui/components/tag";
import { TitleText } from "@ui/components/text";
import { GraphLegend } from "@ui/containers/graphLegend";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { Averages, Mode } from "@ui/type";
import { observer } from "mobx-react-lite";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import DashedLine from "react-native-dashed-line";

type Props = {
	selectedDay: ISODay;
	mode?: Mode;
};
export const CardioPointsGraph: React.FC<Props> = observer(function CardioPointsGraph({
	selectedDay,
	mode = createActiveMode(),
}: Props) {
	const { format, formatDate } = useI18n();
	const [isLoading, setLoading] = useState(true);
	const [graphPeriod, setGraphPeriod] = useState(TimeFrame.TODAY);
	const [tags, setTags] = useState<CalendarTag[]>([]);

	const {
		measure: {
			hooks: { useLast7DaysCardioPoints },
		},
		calendar: {
			hooks: { useDailyTags },
		},
	} = useRepresentations();

	const data = useLast7DaysCardioPoints(selectedDay);
	const lines: Points = data
		? data.series
				.map((el) => {
					return {
						x: el ? moment(el.date).valueOf() : 0,
						y: el?.value ? el.value : 0,
					};
				})
				.reverse()
		: [];
	const updatedMode = updateMode(mode, data?.controlState !== DataControlState.READY);

	const valueFormatter = lines.map(({ x }) => {
		const day = moment(x).format("dd");
		return day !== "Invalid date" ? day[0] : "";
	});

	const constant = data?.constant;
	const averages: Averages = [];
	if (isInActiveMode(updatedMode) && isDefined(constant) && constant.average !== -1) {
		averages.push({
			value: constant.average,
			color: colors.red,
		});
	}
	if (isInActiveMode(updatedMode) && isDefined(constant) && constant.baseline !== -1) {
		averages.push({
			value: constant.baseline,
			color: colors.redLight,
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
	const [yMin, yMax] =
		lines.length > 0
			? [
					Math.min(...lines.filter((line) => line.y > 0).map((line) => line.y)),
					Math.max(...lines.map((line) => line.y)),
			  ]
			: [0, 0];

	return isLoading ? (
		<Spinner size={24} />
	) : !!lines ? (
		<View>
			<TitleText style={{ marginBottom: 20, textAlign: "center", textTransform: "uppercase" }}>
				{format("metric.cardio")}
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
				<View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
					{(isInActiveMode(updatedMode) || isInCalibrationMode(updatedMode)) &&
						tags.map(({ name, id }) => (
							<View key={id} style={{ marginLeft: 8 }}>
								<Tag>{name}</Tag>
							</View>
						))}
				</View>
				<BarChart
					averages={averages}
					shouldShowMarker={true}
					xColor={colors.textPrimary}
					yColor={colors.darkGray}
					data={lines}
					valueFormatter={valueFormatter}
					graphColor={colors.red}
					onSelect={(x) => toUpdateTag(x)}
					mapMarker={(el) => `${formatDate(new Date(el.x))}\n${el.y}`}
					mode={updatedMode}
					yMin={yMin}
					yMax={yMax}
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
												width: 40,
												marginTop: 5,
											}}
										>
											<DashedLine dashGap={5} dashLength={10} dashColor={colors.red} />
										</View>
									),
								},
								value: isDefined(constant) && constant.average != -1 ? `${constant.average}` : "-",
							},
							{
								label: format("cardio.baseline"),
								element: {
									key: "cardio.baseline",
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
									: isDefined(constant) && constant.baseline != -1
									? `${constant.baseline}`
									: "-",
							},
							{
								label: format("cardio.7day.total"),
								element: {
									key: "cardio.7day.total",
									node: <></>,
								},

								value: isDefined(constant) && constant.total != -1 ? `${constant.total}` : "-",
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
