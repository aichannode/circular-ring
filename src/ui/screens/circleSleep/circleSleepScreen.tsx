import {
	useSleepDuration,
	useDailySleepQualityScore,
	useDailySleepStages,
	useDailySleepDetails,
} from "@domain/measure/representation/hooks";
import { dailySleepDetailsMetrics } from "@domain/measure/representation/type";
import { SleepStage, TimeFrame } from "@domain/measure/type";
import { CircularBottomSheet, CircularBottomSheetHandle } from "@ui/components/bottomSheet/bottomSheet";
import { CalendarView } from "@ui/components/calendar/calendarView";
import { CircleCalendarButton } from "@ui/components/calendar/circleCalendarButton";
import { InfoListHeader } from "@ui/components/infoList";
import { Stack } from "@ui/components/layout";
import { GaugeDescription } from "@ui/components/measure/gaugeDescription";
import { GraphContainer } from "@ui/components/measure/graphContainer";
import { GraphLegend } from "@ui/components/measure/graphLegend";
import { ScoreGauge } from "@ui/components/measure/scoreGauge";
import { ScoreSection } from "@ui/components/measure/scoreSection";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { TitleText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { observer } from "mobx-react-lite";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { LayoutAnimation, View } from "react-native";
import styled from "styled-components/native";
import { Hypnogram } from "./hypnogram";
import { getSleepQualityDetails } from "./measureDisplayInfos";
import { SleepDurationPieChart } from "./sleepDurationPie";

/* const scoreGoodThreshold = 0.8;
const scoreOptimalThreshold = 0.9;
 */
export const CircleSleepScreen: React.FC = observer(() => {
	const [selectedDay, setSelectedDay] = useState<string>(moment().format("YYYY-MM-DD"));
	const centerCircleSleepDuration = useSleepDuration(selectedDay);
	const details = useDailySleepDetails(selectedDay);
	const qualityScore = useDailySleepQualityScore(selectedDay);
	const stages = useDailySleepStages();
	const [focusedGauge, setFocusedGauge] = useState<number | null>(null);
	const { format } = useI18n();
	const calendarBottomSheet = useRef<CircularBottomSheetHandle>(null);
	const [graphPeriod /* , setGraphPeriod */] = useState(TimeFrame.TODAY);
	const sleepQualityDetails = getSleepQualityDetails(format)

	// TODO remove and use the hook
	const sleepDuration = moment(stages[stages.length - 1].end)
		.diff(stages[0].start)
		.valueOf();

	useEffect(() => {
		console.log("CURRENT PERIOD = ", graphPeriod);
	}, [graphPeriod]);

	const awakeDuration = stages
		.filter(({ type }) => type === SleepStage.AWAKE)
		.reduce((sum, { start, end }) => sum + moment(end).diff(start).valueOf(), 0);
	const REMDuration = stages
		.filter(({ type }) => type === SleepStage.REM)
		.reduce((sum, { start, end }) => sum + moment(end).diff(start).valueOf(), 0);
	const lightDuration = stages
		.filter(({ type }) => type === SleepStage.LIGHT)
		.reduce((sum, { start, end }) => sum + moment(end).diff(start).valueOf(), 0);
	const deepDuration = stages
		.filter(({ type }) => type === SleepStage.DEEP)
		.reduce((sum, { start, end }) => sum + moment(end).diff(start).valueOf(), 0);

	console.log("FIX SLEEP END ", moment(stages[stages.length - 1].end).format("HH:mm"));

	console.log("AWAKE DURATION", awakeDuration);

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
			<SleepDurationPieChart stages={stages} duration={centerCircleSleepDuration ?? 0} />
			<InfoListHeader>{format("sleep.quality.details")}</InfoListHeader>
			<ElementStack gap={10}>
				{
					dailySleepDetailsMetrics
						.map((metric, index) => {
							const dataInfos = sleepQualityDetails[metric];
							const values: {
								value: number,
								thresholdLow: number,
								thresholdHigh: number,
								gaugeFilling: number
							} = {
								value: (details as any)[dataInfos.metricsName.value],
								thresholdLow: (details as any)[dataInfos.metricsName.thresholdLow],
								thresholdHigh: (details as any)[dataInfos.metricsName.thresholdHigh],
								gaugeFilling: (details as any)[dataInfos.metricsName.gaugeFilling],
							}
							return [
								<ScoreGauge
									key={metric}
									value={dataInfos.renderValue(values)}
									gaugeFilling={values.gaugeFilling}
									color={dataInfos.getGaugeColor(values)}
									label={format(dataInfos.titleKey)}
									isInverted={dataInfos.isInverted}
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
					{/* <TimeFrameSwitcher
						setGraphPeriod={setGraphPeriod}
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
					/> */}
				</View>
				<GraphContainer>
					<Hypnogram data={stages} />
					<View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
						<GraphLegend
							rows={[
								{
									label: format("sleep.stage.awake"),
									element: {
										key: "sleep.stage.awake",
										node: <></>,
									},
									value: `${moment.duration(awakeDuration).hours()} h ${moment.duration(awakeDuration).minutes()} min ${
										sleepDuration ? `${Math.round((awakeDuration * 100) / sleepDuration)}%` : ""
									}`,
								},
								{
									label: format("sleep.stage.REM"),
									element: {
										key: "sleep.stage.REM",
										node: <></>,
									},
									value: `${moment.duration(REMDuration).hours()} h ${moment.duration(REMDuration).minutes()} min ${
										sleepDuration ? `${Math.round((REMDuration * 100) / sleepDuration)}%` : ""
									}`,
								},
								{
									label: format("sleep.stage.light"),
									element: {
										key: "sleep.stage.light",
										node: <></>,
									},
									value: `${moment.duration(lightDuration).hours()} h ${moment.duration(lightDuration).minutes()} min ${
										sleepDuration ? `${Math.round((lightDuration * 100) / sleepDuration)}%` : ""
									}`,
								},
								{
									label: format("sleep.stage.deep"),
									element: {
										key: "sleep.stage.deep",
										node: <></>,
									},
									value: `${moment.duration(deepDuration).hours()} h ${moment.duration(deepDuration).minutes()} min ${
										sleepDuration ? `${Math.round((deepDuration * 100) / sleepDuration)}%` : ""
									}`,
								},
							]}
						/>
					</View>
				</GraphContainer>
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
