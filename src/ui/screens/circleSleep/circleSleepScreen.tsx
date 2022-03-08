import { useRepresentations } from "@core/representation";
import { useDailyTags } from "@domain/calendar/hooks/useTags";
import { DailySleepData } from "@domain/measure/representation/api";
import { dailySleepScoreContributorsMetrics } from "@domain/measure/representation/lib/type";
import { SleepStage } from "@domain/measure/type";
import { CircularBottomSheet, CircularBottomSheetHandle } from "@ui/components/bottomSheet/bottomSheet";
import { CalendarView } from "@ui/components/calendar/calendarView";
import { CircleCalendarButton } from "@ui/components/calendar/circleCalendarButton";
import { InfoListHeader } from "@ui/components/infoList";
import { Stack } from "@ui/components/layout";
import { GaugeDescription } from "@ui/components/measure/gaugeDescription";
import { GraphContainer } from "@ui/components/measure/graphContainer";
import { GraphLegend } from "@ui/components/measure/graphLegend";
import { ScoreGauge } from "@ui/components/measure/scoreGauge";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { Spinner } from "@ui/components/spinner";
import { TitleText } from "@ui/components/text";
import { ScoreSection } from "@ui/containers/scoreSection";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { isDefined } from "@ui/utils/guard";
import { observer } from "mobx-react-lite";
import moment from "moment";
import React, { useRef, useState } from "react";
import { LayoutAnimation, View } from "react-native";
import styled from "styled-components/native";
import { trimSleepStages } from "./business";
import { Hypnogram } from "./hypnogram";
import { getSleepQualityDetails } from "./measureDisplayInfos";
import { SleepDurationPieChart } from "./sleepDurationPie";

export const CircleSleepScreen: React.FC = observer(() => {
	const [selectedDay, setSelectedDay] = useState<string>(moment().format("YYYY-MM-DD"));
	const {
		useDailySleepScoreContributors: useDailySleepDetails,
		useDailySleepQualityScore,
		useDailySleepStages,
		useCanDisplayData,
	} = useRepresentations().measure.hooks;
	const canDisplay = useCanDisplayData(selectedDay);
	const details = useDailySleepDetails(selectedDay);
	const qualityScore = useDailySleepQualityScore(selectedDay);
	const [dailySleep, setData] = useState<DailySleepData | undefined>();
	const [focusedGauge, setFocusedGauge] = useState<number | null>(null);
	const { format } = useI18n();
	const calendarBottomSheet = useRef<CircularBottomSheetHandle>(null);
	const sleepQualityDetails = getSleepQualityDetails(format);
	const awakeDuration = dailySleep?.sleepStagesDuration[SleepStage.AWAKE];
	const REMDuration = dailySleep?.sleepStagesDuration[SleepStage.REM];
	const lightDuration = dailySleep?.sleepStagesDuration[SleepStage.LIGHT];
	const deepDuration = dailySleep?.sleepStagesDuration[SleepStage.DEEP];
	const sleepStages = trimSleepStages({
		stages: dailySleep?.stages ?? [],
		isoDay: selectedDay,
		userTimeToFallAsleep: dailySleep?.timeToFallASleep,
		napFrames: dailySleep?.napTimings,
		coreSleepFrame: dailySleep?.coreSleepTiming,
	});
	const tags = useDailyTags(selectedDay);

	useDailySleepStages({ setData, isoDay: selectedDay });

	return (
		<Container>
			<View>
				<ScoreSection
					isDisabled={!canDisplay}
					style={{ marginTop: 20 }}
					label={format("sleep.quality_score")}
					score={qualityScore["user.daily.sleep.score"]}
					quality={qualityScore.controlState}
					color={colors.business.sleepPrimary}
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
			{dailySleep ? (
				<SleepDurationPieChart
					stages={sleepStages}
					coreSleepTiming={dailySleep.coreSleepTiming}
					napTimings={dailySleep.napTimings}
					duration={dailySleep.totalMinutesSleepDuration ?? 0}
				/>
			) : (
				<Spinner />
			)}
			<InfoListHeader>{format("sleep.quality.details")}</InfoListHeader>
			<ElementStack gap={10}>
				{
					dailySleepScoreContributorsMetrics
						.map((metric, index) => {
							const dataInfos = sleepQualityDetails[metric];
							const values: {
								value: number;
								thresholdLow: number;
								thresholdHigh: number;
								gaugeFilling: number;
							} = {
								value: (details as any)[dataInfos.metricsName.value],
								thresholdLow: (details as any)[dataInfos.metricsName.thresholdLow],
								thresholdHigh: (details as any)[dataInfos.metricsName.thresholdHigh],
								gaugeFilling: (details as any)[dataInfos.metricsName.gaugeFilling],
							};
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
				{dailySleep ? (
					<GraphContainer>
						<Hypnogram data={sleepStages} tags={tags} />
						<View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
							<GraphLegend
								rows={[
									awakeDuration && {
										label: format("sleep.stage.awake"),
										element: {
											key: "sleep.stage.awake",
											node: <></>,
										},
										value: `${moment.duration(awakeDuration.duration).hours()} h ${moment
											.duration(awakeDuration.duration)
											.minutes()} min ${awakeDuration.percent}%`,
									},
									REMDuration && {
										label: format("sleep.stage.REM"),
										element: {
											key: "sleep.stage.REM",
											node: <></>,
										},
										value: `${moment.duration(REMDuration.duration).hours()} h ${moment
											.duration(REMDuration.duration)
											.minutes()} min ${REMDuration.percent}%`,
									},
									lightDuration && {
										label: format("sleep.stage.light"),
										element: {
											key: "sleep.stage.light",
											node: <></>,
										},
										value: `${moment.duration(lightDuration.duration).hours()} h ${moment
											.duration(lightDuration.duration)
											.minutes()} min ${lightDuration.percent}%`,
									},
									deepDuration && {
										label: format("sleep.stage.deep"),
										element: {
											key: "sleep.stage.deep",
											node: <></>,
										},
										value: `${moment.duration(deepDuration.duration).hours()} h ${moment
											.duration(deepDuration.duration)
											.minutes()} min ${deepDuration.percent}`,
									},
								].filter(isDefined)}
							/>
						</View>
					</GraphContainer>
				) : (
					<Spinner />
				)}
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
