import { useRepresentations } from "@core/representation";
import { ISODay } from "@domain/common/type";
import { DailyActivityIntensityData } from "@domain/measure/representation/api";
import { TimeFrame } from "@domain/measure/type";
import { useIs24h } from "@domain/user/hooks/useUser";
import { GraphContainer } from "@ui/components/measure/graphContainer";
import { GraphLegend } from "@ui/components/measure/graphLegend";
import { TimeFrameSwitcher } from "@ui/components/measure/timeFrameSwitcher";
import { Spinner } from "@ui/components/spinner";
import { Tag } from "@ui/components/tag";
import { TitleText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { ActivityIntensityColors, colors } from "@ui/styles/colors";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Platform, processColor, View } from "react-native";
import { BarChart } from "react-native-charts-wrapper";
import { getActivityIntensityBarColor } from "./business";

type Props = {
	selectedDay: ISODay;
};

export const ActivityIntensityGraph: React.FC<Props> = observer(function ActivityIntensityGraph({
	selectedDay,
}: Props) {
	const { format, formatHour } = useI18n();
	const [isLoading, setLoading] = useState(true);

	const is24h = useIs24h();
	const [graphPeriod, setGraphPeriod] = useState(TimeFrame.TODAY);

	const [dataActivityIntensity, setData] = useState<DailyActivityIntensityData>({
		stages: [],
		duration: 0,
		sportSessionDates: [],
	});
	const {
		measure: {
			hooks: { useDailyActivityIntensity },
		},
		calendar: {
			hooks: { useDailyTags },
		},
	} = useRepresentations();
	useDailyActivityIntensity({ localISODay: selectedDay, setData });

	const graphData: Array<{
		value: number;
		isoTime: string;
	}> = dataActivityIntensity.stages.map((stage) => ({ value: stage.level, isoTime: stage.start }));
	useEffect(() => {
		setTimeout(() => {
			setLoading(false);
		}, 500);
	}, [graphData]);
	const tags = useDailyTags(selectedDay);
	const data = {
		dataSets: [
			{
				values: graphData.map(({ value, isoTime }) => {
					const date = new Date(isoTime);
					const marker = `${formatHour(date, is24h)}\n${
						value > 4
							? format("intensity.high")
							: value === 4
							? format("intensity.medium")
							: value >= 2
							? format("intensity.low")
							: value >= 1
							? format("intensity.rest")
							: format("intensity.none")
					}`;
					return {
						y: value,
						marker,
					};
				}),
				config: {
					drawValues: false,
					colors: graphData.map(({ value }) => processColor(getActivityIntensityBarColor(value))),

					// Alpha value depends on plateform
					// https://github.com/wuxudong/react-native-charts-wrapper#convention
					highlightAlpha: Platform.OS === "ios" ? 100 : 255,
					highlightColor: processColor(colors.selected),
				},
			},
		],

		config: {
			barWidth: 0.5,
			xEntrySpace: 50,
		},
	};

	const xAxis = {
		position: "BOTTOM" as const,
		valueFormatter: graphData.map(({ isoTime }) => {
			const date = new Date(isoTime);
			return `${formatHour(date, is24h)}`;
		}),
		labelCount: 3,
		drawGridLines: false,
		drawAxisLine: false,
	};

	const yAxis = {
		left: {
			valueFormatter: [
				"",
				format("intensity.rest"),
				format("intensity.low"),
				format("intensity.medium"),
				format("intensity.high"),
			],
			granularityEnabled: true,
			granularity: 1,
			drawGridLines: false,
			drawAxisLine: false,
		},
		right: { enabled: false }, // used to delete the right axis
	};

	return (
		// Important! The current lib does not support update of data size from 0
		// because zoom/visibleRange props update won't be taken in account internaly.
		// This will lead to an empty chart.
		// Workaround: We need to unmount the chart when there is no data.
		isLoading ? (
			<Spinner size={24} />
		) : graphData.length ? (
			<View>
				<TitleText style={{ marginBottom: 20, textAlign: "center", textTransform: "uppercase" }}>
					{format("activity.intensity")}
				</TitleText>
				<View style={{ display: "none", marginVertical: 10 }}>
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

				<GraphContainer style={{ height: 300 }}>
					<View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
						{tags.map(({ name, id }) => (
							<View key={id} style={{ marginLeft: 8 }}>
								<Tag>{name}</Tag>
							</View>
						))}
					</View>
					<BarChart
						style={{
							flex: 1,
						}}
						data={data}
						xAxis={xAxis}
						yAxis={yAxis}
						legend={{
							formToTextSpace: 5,
							enabled: false,
							xEntrySpace: 50,
						}}
						marker={{
							enabled: true,
							markerColor: processColor(colors.orangeRed),
							textColor: processColor("white"),
							textSize: 14,
						}}
						zoom={{ scaleX: 1, scaleY: 1, xValue: Math.floor(graphData.length / 2), yValue: 1 }}
						pinchZoom={true}
						scaleYEnabled={false}
						doubleTapToZoomEnabled={false}
						chartDescription={{ text: "" }}
						visibleRange={{ x: { max: Math.min(graphData.length, 100) } }}
						drawValueAboveBar={false}
						highlightFullBarEnabled={true}
						onSelect={console.log}
					/>
					<GraphLegend
						rows={[
							{
								label: format("intensity.high"),
								element: {
									key: "intensity.high",
									node: (
										<View
											style={{
												borderRadius: 100,
												width: 10,
												height: 10,
												backgroundColor: ActivityIntensityColors.HIGH,
											}}
										/>
									),
								},
								value: "1 h 00 min   (7%)",
							},
							{
								label: format("intensity.medium"),
								element: {
									key: "intensity.medium",
									node: (
										<View
											style={{
												borderRadius: 100,
												width: 10,
												height: 10,
												backgroundColor: ActivityIntensityColors.MEDIUM,
											}}
										/>
									),
								},
								value: "2 h 00 min (14%)",
							},
							{
								label: format("intensity.low"),
								element: {
									key: "intensity.low",
									node: (
										<View
											style={{
												borderRadius: 100,
												width: 10,
												height: 10,
												backgroundColor: ActivityIntensityColors.LOW,
											}}
										/>
									),
								},
								value: "10 h 30 min (79%)",
							},
						]}
					/>
				</GraphContainer>
			</View>
		) : (
			<></>
		)
	);
});
