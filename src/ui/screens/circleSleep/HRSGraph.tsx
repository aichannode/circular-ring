import { useRepresentations } from "@core/representation";
import { CalendarTag } from "@domain/calendar/calendar";
import { isDefined } from "@domain/common/business";
import { ISODay } from "@domain/common/type";
import { DataControlState } from "@domain/measure/representation/api";
import { TimeFrame } from "@domain/measure/type";
import { createActiveMode, isInActiveMode, isInCalibrationMode, updateMode } from "@ui/business";
import { Row } from "@ui/components/layout";
import { BarChart } from "@ui/components/measure/barChart";
import { GraphContainer } from "@ui/components/measure/graphContainer";
import { TimeFrameSwitcher } from "@ui/components/measure/timeFrameSwitcher";
import { Spinner } from "@ui/components/spinner";
import { Tag } from "@ui/components/tag";
import { PrimaryText, TitleText } from "@ui/components/text";
import { GraphLegend } from "@ui/containers/graphLegend";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { Averages, Mode } from "@ui/type";
import { observer } from "mobx-react-lite";
import moment from "moment";
import React, { useState } from "react";
import { View } from "react-native";
import DashedLine from "react-native-dashed-line";

type Props = {
	selectedDay: ISODay;
	mode?: Mode;
};
export const HRSGraph: React.FC<Props> = observer(function HRSGraph({ selectedDay, mode = createActiveMode() }: Props) {
	const { format, formatDuration, formatDate } = useI18n();
	const [graphPeriod, setGraphPeriod] = useState(TimeFrame.TODAY);
	const [tags, setTags] = useState<CalendarTag[]>([]);

	const {
		measure: {
			hooks: { useLast7DaysHRS },
		},
		calendar: {
			hooks: { useDailyTags },
		},
	} = useRepresentations();
	const data = useLast7DaysHRS(selectedDay);

	const series = data?.series.reverse();
	const lines = series
		? series.flatMap((item, index) => {
				if (!isDefined(item)) {
					return [];
				}
				const [totalSleep, realSleep] = item.value;
				const [x1, x2] =
					index === 0
						? [index, index + 0.2]
						: index === series.length - 1
						? [index - 0.2, index]
						: [index - 0.1, index + 0.1];
				return [
					{
						x: moment(item.date).valueOf(),
						y: moment.duration(totalSleep, "minutes").as("hours"),
						mappedX: x1,
						color: colors.darkBlue,
					},
					{
						x: moment(item.date).valueOf(),
						y: moment.duration(realSleep, "minutes").as("hours"),
						mappedX: x2,
						color: colors.sleepBlue,
					},
				];
		  })
		: [];
	const updatedMode = updateMode(mode, data?.controlState !== DataControlState.READY || lines.length === 0);

	const valueFormatter = series?.map((item) => {
		const day = moment(item?.date).format("dd");
		return day !== "Invalid date" ? day[0] : "";
	});

	const constant = data?.constant;
	const averages: Averages = [];
	if (isDefined(constant) && constant.totalAverage !== -1) {
		averages.push({
			value: constant.totalAverage / 60,
			color: colors.darkBlue,
		});
	}
	if (isDefined(constant) && constant.realAverage !== -1) {
		averages.push({
			value: constant.realAverage / 60,
			color: colors.redLight,
		});
	}
	if (isDefined(constant) && constant.recommendation !== -1) {
		averages.push({
			value: constant.recommendation / 60,
			color: colors.darkGreen,
		});
	}

	const isLoading = !isDefined(data);

	const toUpdateTag = (x: number) => {
		const item = series ? series[Math.round(x)] : undefined;
		const date = moment(item?.date).format("Y-MM-DD") as ISODay;
		setTags(useDailyTags(date));
	};
	const yMin = lines.length > 0 ? Math.min(...lines.filter((line) => line.y > 0).map((line) => line.y)) : 0;

	return isLoading ? (
		<Spinner size={24} />
	) : !!lines ? (
		<View>
			<TitleText style={{ marginBottom: 20, textAlign: "center", textTransform: "uppercase" }}>
				{format("hrs.title")}
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
					mapXAxis={(el) => (el as typeof lines[number]).mappedX}
					mapBarColor={(el) => (el as typeof lines[number]).color}
					mapMarker={(el) =>
						`${formatDate(new Date(el.x))}\n${formatDuration(
							moment.duration((el as typeof lines[number]).y, "hours").as("seconds")
						)}`
					}
					xColor={colors.textPrimary}
					yColor={colors.darkGray}
					data={lines}
					valueFormatter={valueFormatter}
					graphColor={colors.darkBlue}
					onSelect={(x) => toUpdateTag(x)}
					mode={updatedMode}
					yMin={yMin}
				/>
				<View style={{ marginTop: 20 }}>
					<Row justify="space-between" style={{ marginBottom: 7 }}>
						<Row align="center">
							<PrimaryText style={{ fontSize: 9 }}>{format("hrs.legend.total")}</PrimaryText>
							<View
								style={{ marginLeft: 8, width: 16, height: 4, borderRadius: 2.5, backgroundColor: colors.darkBlue }}
							/>
						</Row>
						<Row align="center">
							<PrimaryText style={{ fontSize: 9 }}>{format("hrs.legend.real")}</PrimaryText>
							<View
								style={{ marginLeft: 8, width: 16, height: 4, borderRadius: 2.5, backgroundColor: colors.sleepBlue }}
							/>
						</Row>
					</Row>
					<GraphLegend
						mode={updatedMode}
						rows={[
							{
								label: format("hrs.totalAverage"),
								element: {
									key: "hrs.totalAverage",
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
									isDefined(constant) && constant.totalAverage != -1 ? formatDuration(constant.totalAverage * 60) : "-",
							},
							{
								label: format("hrs.realAverage"),
								element: {
									key: "hrs.realAverage",
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
									isDefined(constant) && constant.realAverage != -1 ? formatDuration(constant.realAverage * 60) : "-",
							},
							{
								label: format("hrs.recommendation"),
								element: {
									key: "hrs.recommendation",
									node: (
										<View
											style={{
												width: 40,
												marginTop: 5,
											}}
										>
											<DashedLine dashGap={5} dashLength={10} dashColor={colors.darkGreen} />
										</View>
									),
								},
								value:
									isDefined(constant) && constant.recommendation != -1
										? formatDuration(constant.recommendation * 60)
										: "-",
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
