import {
	useSleepDuration,
	useDailySleepDetails,
	useDailySleepQualityScore,
	useDailySleepStages,
} from "@domain/measure/representation/hooks";
import { dailySleepDetailsMetrics } from "@domain/measure/representation/type";
import { TimeFrame } from "@domain/measure/type";
import { CircularBottomSheet, CircularBottomSheetHandle } from "@ui/components/bottomSheet/bottomSheet";
import { CalendarView } from "@ui/components/calendar/calendarView";
import { CircleCalendarButton } from "@ui/components/calendar/circleCalendarButton";
import { InfoListHeader } from "@ui/components/infoList";
import { Stack } from "@ui/components/layout";
import { GaugeDescription } from "@ui/components/measure/gaugeDescription";
import { GraphLegend } from "@ui/components/measure/graphLegend";
import { ScoreGauge } from "@ui/components/measure/scoreGauge";
import { ScoreSection } from "@ui/components/measure/scoreSection";
import { TimeFrameSwitcher } from "@ui/components/measure/timeFrameSwitcher";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { TitleText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { observer } from "mobx-react-lite";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { LayoutAnimation, View } from "react-native";
import styled from "styled-components/native";
import { scoreDetails } from "./measureDisplayInfos";
import { SleepDurationPieChart } from "./sleepDurationPie";

const scoreGoodThreshold = 0.8;
const scoreOptimalThreshold = 0.9;

export const CircleSleepScreen: React.FC = observer(() => {
	const [selectedDay, setSelectedDay] = useState<string>(moment().format("YYYY-MM-DD"));
	const sleepDuration = useSleepDuration(selectedDay);
	const details = useDailySleepDetails(selectedDay);
	const qualityScore = useDailySleepQualityScore(selectedDay);
	const stages = useDailySleepStages();
	const [focusedGauge, setFocusedGauge] = useState<number | null>(null);
	const { format } = useI18n();
	const calendarBottomSheet = useRef<CircularBottomSheetHandle>(null);
	const [graphPeriod, setGraphPeriod] = useState(TimeFrame.TODAY);

	useEffect(() => {
		console.log("CURRENT PERIOD = ", graphPeriod);
	}, [graphPeriod]);
	//const { result: dailyData } = useDailySleepQualityDetails(selectedDay);

	return (
		<Container>
			<View>
				<ScoreSection
					style={{ marginTop: 20 }}
					label={format("sleep.quality_score")}
					score={qualityScore}
					color={colors.darkBlue}
				/>
				<CircleCalendarButton
					currentDay={selectedDay}
					onPress={() => calendarBottomSheet.current?.present()}
					style={{
						position: "absolute",
						top: 25,
						right: 25,
					}}
				/>
			</View>
			<InfoListHeader>{format("sleep.duration.title")}</InfoListHeader>
			<SleepDurationPieChart stages={stages} duration={sleepDuration ?? 0} />
			<InfoListHeader>{format("sleep.quality.details")}</InfoListHeader>
			<ElementStack gap={10}>
				{
					dailySleepDetailsMetrics
						.map((metric, index) => {
							const dataInfos = scoreDetails[metric];
							const value = details[metric];
							const gaugeValue = dataInfos.gauge ? details[dataInfos.gauge] : value;
							return [
								<ScoreGauge
									key={metric}
									value={value !== undefined ? Math.round(value) : undefined}
									rate={gaugeValue !== undefined ? gaugeValue / 100 : undefined}
									unit={dataInfos.unit}
									goodThreshold={scoreGoodThreshold}
									optimalThreshold={scoreOptimalThreshold}
									label={format(dataInfos.titleKey)}
									displayGaugeValue={dataInfos.displayGaugeValue}
									gaugeInverted={dataInfos.inverted}
									onPress={() => {
										LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
										setFocusedGauge((current) => (current === index ? null : index));
									}}
								/>,
								focusedGauge === index && (
									<GaugeDescription
										key={metric + "description"}
										label={format(dataInfos.titleKey)}
										description={format(dataInfos.descriptionKey)}
										colorType="Sleep"
										onClose={() => {
											LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
											setFocusedGauge(null);
										}}
									/>
								),
							];
						})
						.flatMap((x) => x)
						.filter(Boolean) as JSX.Element[]
				}
			</ElementStack>
			<InfoListHeader>{format("sleep.details.title")}</InfoListHeader>
			<ElementStack gap={10}>
				<TitleText style={{ marginBottom: 20, textAlign: "center", textTransform: "uppercase" }}>
					{format("sleep.details.stages")}
				</TitleText>
				<View style={{ marginVertical: 10 }}>
					<TimeFrameSwitcher
						setGraphPeriod={setGraphPeriod}
						graphPeriod={graphPeriod}
						color={colors.business.sleepPrimary}
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
				<GraphLegend
					rows={[
						{
							label: format("sleep.details.title"),
							element: {
								key: "sleep.details.title",
								node: <View style={{ borderRadius: 100, width: 10, height: 10, backgroundColor: colors.red }} />,
							},
							value: "0 h 45 min (8%)",
						},
						{
							label: format("sleep.details.stages"),
							element: {
								key: "sleep.details.stages",
								node: <View style={{ borderRadius: 100, width: 10, height: 10, backgroundColor: colors.red }} />,
							},
							value: "5 h 48 min (61%)",
						},
						{
							label: format("sleep.duration.title"),
							element: {
								key: "sleep.duration.title",
								node: <View style={{ borderRadius: 100, width: 10, height: 10, backgroundColor: colors.red }} />,
							},
							value: "0 h 48 min (9%)",
						},
					]}
				/>
			</ElementStack>
			<CircularBottomSheet ref={calendarBottomSheet} snapPoints={[480]}>
				<View style={{ padding: 20 }}>
					<CalendarView
						autoSelectDayOnMonthChange={false}
						selectedDay={selectedDay}
						onDaySelected={async (day) => {
							await calendarBottomSheet.current?.asyncClose();
							setSelectedDay(day);
						}}
					/>
				</View>
			</CircularBottomSheet>
		</Container>
	);
});

const Container = styled(ScrollScreen)`
	background-color: ${colors.white};
`;
const ElementStack = styled(Stack)`
	padding: 25px 20px;
	background-color: ${colors.lightgray};
`;
