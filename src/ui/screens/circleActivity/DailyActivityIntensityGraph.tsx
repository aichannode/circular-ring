import { useRepresentations } from "@core/representation";
import { getLocalISODayFromLocalDate } from "@domain/common/business";
import { ISODay } from "@domain/common/type";
import { DailyActivityIntensityData } from "@domain/measure/representation/api";
import { useIs24h } from "@domain/user/hooks/useUser";
import { CalendarTags } from "@ui/components/calendar/CalendarTags";
import { TextPlaceholder } from "@ui/components/placeholder/TextPlaceholder";
import { Spinner } from "@ui/components/spinner";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Platform, processColor, View } from "react-native";
import { BarChart } from "react-native-charts-wrapper";
import { ActivityLegend } from "./ActivityLegend";
import { getActivityIntensityBarColor } from "./business";

type Props = {
	selectedDay: ISODay;
	hasNotEnoughData?: boolean;
};

export const DailyActivityIntensityGraph: React.FC<Props> = observer(function DailyActivityIntensityGraph({
	selectedDay,
	hasNotEnoughData,
}: Props) {
	const { format, formatHour } = useI18n();
	const [isLoading, setLoading] = useState(true);

	const is24h = useIs24h();

	const [dataActivityIntensity, setData] = useState<DailyActivityIntensityData>({
		stages: [],
		duration: {
			total: 0,
			highActivity: 0,
			mediumActivity: 0,
			lowActivity: 0,
		},
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

	const _hasNotEnoughData = hasNotEnoughData || graphData.length === 0;

	const tags = useDailyTags(getLocalISODayFromLocalDate(selectedDay));
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

	useEffect(() => {
		setTimeout(() => {
			setLoading(false);
		}, 500);
	}, [graphData]);

	if (isLoading) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<Spinner size={24} />
			</View>
		);
	}
	return (
		<>
			{/* TODO: This is temporary modification, use useRangeTags instead */}
			<CalendarTags tags={tags.map((tag) => ({ nb: 1, tag }))} />
			<View style={{ height: 200 }}>
				{_hasNotEnoughData ? (
					<View style={{ flex: 1 }}>
						<TextPlaceholder content={format("global.no_data_yet")} />
					</View>
				) : (
					<BarChart
						style={{
							flex: 1,
							marginBottom: 27,
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
				)}
			</View>
			<ActivityLegend
				hasNotEnoughData={hasNotEnoughData}
				highDuration={dataActivityIntensity.duration.highActivity}
				mediumDuration={dataActivityIntensity.duration.mediumActivity}
				lowDuration={dataActivityIntensity.duration.lowActivity}
			/>
		</>
	);
});
