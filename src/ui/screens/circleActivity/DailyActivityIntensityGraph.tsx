import { useRepresentations } from "@core/representation";
import { toLocale } from "@domain/common/business";
import { ISODay } from "@domain/common/type";
import { DailyActivityIntensityData, DataControlState } from "@domain/measure/representation/api";
import { useIs24h } from "@domain/user/hooks/useUser";
import { createActiveMode, isInDisabledMode, isInSomeIntervals, trimData, TrimOptions, updateMode } from "@ui/business";
import { TextPlaceholder } from "@ui/components/placeholder/TextPlaceholder";
import { Spinner } from "@ui/components/spinner";
import { Tags } from "@ui/components/Tags";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { Mode } from "@ui/type";
import { observer } from "mobx-react-lite";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Platform, processColor, View } from "react-native";
import { BarChart } from "react-native-charts-wrapper";
import { ActivityLegend } from "./ActivityLegend";
import { getActivityIntensityBarColor } from "./business";

type Props = {
	selectedDay: ISODay;
	mode?: Mode;
	trimOptions?: TrimOptions;
};

export const DailyActivityIntensityGraph: React.FC<Props> = observer(function DailyActivityIntensityGraph({
	selectedDay,
	mode = createActiveMode(),
	trimOptions,
}: Props) {
	const { format, formatHour } = useI18n();
	const [isLoading, setLoading] = useState(true);

	const is24h = useIs24h();

	const [dataActivityIntensity, setData] = useState<DailyActivityIntensityData>({
		stages: [],
		controlState: DataControlState.NO_DATA,
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
			hooks: { useRangeTags },
		},
	} = useRepresentations();
	useDailyActivityIntensity({ localISODay: selectedDay, setData });

	const graphData: Array<{
		value: number;
		isoTime: string;
	}> = dataActivityIntensity.stages.map((stage) => ({ value: stage.level, isoTime: stage.start }));

	const updatedMode = updateMode(mode, graphData.length === 0);

	const tags = useRangeTags(
		toLocale(moment(selectedDay).startOf("day").toISOString()),
		toLocale(moment(selectedDay).endOf("day").toISOString())
	);

	const getTimestampFromValue = (x: { value: number; isoTime: string }) => moment(x.isoTime).valueOf();
	const parsedData = trimOptions
		? trimData(graphData, getTimestampFromValue, { includes: trimOptions.includes }).map((x) => ({
				...x,
				value: isInSomeIntervals(getTimestampFromValue(x), trimOptions.excludes ?? []) ? 1 : x.value,
		  }))
		: graphData;

	const data = {
		dataSets: [
			{
				values: parsedData.map(({ value, isoTime }) => {
					const date = new Date(isoTime);
					const marker = `${formatHour(date, is24h)}\n${
						value === 0
							? format("intensity.none")
							: value === 1
							? format("intensity.rest")
							: value === 2
							? format("intensity.low")
							: value === 3
							? format("intensity.medium")
							: format("intensity.high")
					}`;
					return {
						y: value,
						marker,
					};
				}),
				config: {
					drawValues: false,
					colors: parsedData.map(({ value }) => processColor(getActivityIntensityBarColor(Math.round(value)))),

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
		valueFormatter: parsedData.map(({ isoTime }) => {
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
	}, [parsedData]);

	if (isLoading) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<Spinner size={24} />
			</View>
		);
	}

	return (
		<>
			<Tags tags={isInDisabledMode(updatedMode) ? [] : tags} />
			<View style={{ height: 200 }}>
				{isInDisabledMode(updatedMode) ? (
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
						zoom={{ scaleX: 1, scaleY: 1, xValue: Math.floor(parsedData.length / 2), yValue: 1 }}
						pinchZoom={true}
						scaleYEnabled={false}
						doubleTapToZoomEnabled={false}
						chartDescription={{ text: "" }}
						visibleRange={{ x: { max: Math.min(parsedData.length, 100) } }}
						drawValueAboveBar={false}
						highlightFullBarEnabled={true}
					/>
				)}
			</View>
			<View style={{ marginTop: 30 }}>
				<ActivityLegend
					mode={updatedMode}
					highDuration={dataActivityIntensity.duration.highActivity}
					mediumDuration={dataActivityIntensity.duration.mediumActivity}
					lowDuration={dataActivityIntensity.duration.lowActivity}
				/>
			</View>
		</>
	);
});
