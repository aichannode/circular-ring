import { CalendarTag } from "@domain/calendar/calendar";
import { ActivityStage } from "@domain/measure/type";
import { useIs24h } from "@domain/user/hooks/useUser";
import { GraphContainer } from "@ui/components/measure/graphContainer";
import { GraphLegend } from "@ui/components/measure/graphLegend";
import { Tag } from "@ui/components/tag";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import React from "react";
import { Platform, processColor, View } from "react-native";
import { BarChart } from "react-native-charts-wrapper";
import { getActivityIntensityBarColor } from "./business";

type Props = {
	samples: Array<{ isoTime: string; value: number }>;
	tags: CalendarTag[];
};

export const ActivityIntensityGraph = ({ samples, tags }: Props) => {
	const { format, formatHour } = useI18n();
	const is24h = useIs24h();

	const data = {
		dataSets: [
			{
				values: samples.map(({ value, isoTime }) => {
					const date = new Date(isoTime);
					const marker = `${formatHour(date, is24h)}\n${
						value > 4
							? format("intensity.max_hr")
							: value === 4
							? format("intensity.high")
							: value >= 2
							? format("intensity.medium")
							: value >= 1
							? format("intensity.low")
							: format("intensity.none")
					}`;
					return {
						y: value,
						marker,
					};
				}),
				config: {
					drawValues: false,
					colors: samples.map(({ value }) => processColor(getActivityIntensityBarColor(value))),
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
		valueFormatter: samples.map(({ isoTime }) => {
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
				format("intensity.low"),
				format("intensity.medium"),
				format("intensity.high"),
				format("intensity.max_hr"),
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
		!!samples.length ? (
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
					zoom={{ scaleX: 1, scaleY: 1, xValue: Math.floor(samples.length / 2), yValue: 1 }}
					pinchZoom={true}
					scaleYEnabled={false}
					doubleTapToZoomEnabled={false}
					chartDescription={{ text: "" }}
					visibleRange={{ x: { max: Math.min(samples.length, 100) } }}
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
											backgroundColor: getActivityIntensityBarColor(ActivityStage.HIGH),
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
											backgroundColor: getActivityIntensityBarColor(ActivityStage.MEDIUM),
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
											backgroundColor: getActivityIntensityBarColor(ActivityStage.LOW),
										}}
									/>
								),
							},
							value: "10 h 30 min (79%)",
						},
					]}
				/>
			</GraphContainer>
		) : (
			<></>
		)
	);
};
