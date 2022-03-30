import { useRepresentations } from "@core/representation";
import { getCurrentLocalISODay } from "@domain/common/business";
import { ISODay } from "@domain/common/type";
import { DailySleepData } from "@domain/measure/representation/api";
import { sleepScoreContributors } from "@domain/measure/representation/lib/type";
import { SleepStage, TimeFrame } from "@domain/measure/type";
import { CircularBottomSheet, CircularBottomSheetHandle } from "@ui/components/bottomSheet/bottomSheet";
import { CircleCalendarButton } from "@ui/components/calendar/circleCalendarButton";
import { InfoListHeader } from "@ui/components/infoList";
import { Stack } from "@ui/components/layout";
import { GaugeDescription } from "@ui/components/measure/gaugeDescription";
import { GraphContainer } from "@ui/components/measure/graphContainer";
import { GraphLegend } from "@ui/components/measure/graphLegend";
import { TimeFrameSwitcher } from "@ui/components/measure/timeFrameSwitcher";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { Spinner } from "@ui/components/spinner";
import { TitleText } from "@ui/components/text";
import { CalendarView } from "@ui/containers/calendarView";
import { ScoreGauge } from "@ui/containers/scoreGauge";
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
import { getSleepGaugesConfig } from "./measureDisplayInfos";
import { SleepDurationPieChart } from "./sleepDurationPie";
import { SleepStage7Days } from "./sleepStage7Days";

export const CircleSleepScreen = observer(function CircleSleepScreen() {
	const [selectedDay, setSelectedDay] = useState<ISODay>(getCurrentLocalISODay());
	const [graphPeriod, setGraphPeriod] = useState(TimeFrame.TODAY);
	const { useDailySleepScoreContributors, useDailySleepQualityScore, useDailySleepStages, hasEnoughData } =
		useRepresentations().measure.hooks;
	const { useDailyTags } = useRepresentations().calendar.hooks;
	const enoughData = hasEnoughData(selectedDay);
	const sleepScoreContributorsData = useDailySleepScoreContributors(selectedDay);
	const qualityScore = useDailySleepQualityScore(selectedDay);
	const [dailySleep, setDailyData] = useState<DailySleepData | undefined>();
	const [focusedGauge, setFocusedGauge] = useState<number | null>(null);
	const { format } = useI18n();
	const calendarBottomSheet = useRef<CircularBottomSheetHandle>(null);
	const sleepGaugesConfig = getSleepGaugesConfig(format);
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

	useDailySleepStages({ setData: setDailyData, localISODay: selectedDay });

	return (
		<Container>
			<View>
				<ScoreSection
					style={{ marginTop: 20 }}
					label={format("sleep.quality_score")}
					score={qualityScore["user.daily.sleep.score"]}
					quality={qualityScore.controlState}
					color={colors.business.sleepPrimary}
					hasNotEnoughData={!enoughData}
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
					hasNotEnoughData={!enoughData}
				/>
			) : (
				<Spinner />
			)}
			<InfoListHeader>{format("sleep.quality.details")}</InfoListHeader>
			<ElementStack gap={10}>
				{
					sleepScoreContributors
						.map((metric, index) => {
							const uiConfig = sleepGaugesConfig[metric];
							const data = sleepScoreContributorsData[metric];
							return [
								<ScoreGauge
									key={metric}
									value={uiConfig.renderValue({
										...data,
									})}
									percent={data.percent}
									label={format(uiConfig.titleKey)}
									quality={data.controlState}
									onPress={() => {
										LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
										setFocusedGauge((current) => (current === index ? null : index));
									}}
									hasNotEnoughData={
										!enoughData ||
										!isDefined(data.value) ||
										!isDefined(data.percent) ||
										isNaN(data.value) ||
										isNaN(data.percent)
									}
								/>,
								focusedGauge === index && (
									<GaugeDescription
										key={metric + "description"}
										label={format(uiConfig.titleKey)}
										description={format(uiConfig.descriptionKey)}
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
							// {
							// 	label: "graph.time_frame.all",
							// 	duration: TimeFrame.ALL,
							// },
						]}
					/>
				</View>
				{dailySleep ? (
					<GraphContainer>
						{graphPeriod === TimeFrame.TODAY && (
							<Hypnogram data={sleepStages} tags={tags} hasNotEnoughData={!enoughData} />
						)}
						{graphPeriod === TimeFrame.LAST_7_DAYS && <SleepStage7Days hasNotEnoughData={!enoughData} />}
						<View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
							<GraphLegend
								hasNotEnoughData={!enoughData}
								rows={[
									{
										label: format("sleep.stage.awake"),
										element: {
											key: "sleep.stage.awake",
											node: <></>,
										},
										value:
											awakeDuration &&
											`${moment.duration(awakeDuration.duration).hours()} h ${moment
												.duration(awakeDuration.duration)
												.minutes()} min ${awakeDuration.percent}%`,
									},
									{
										label: format("sleep.stage.REM"),
										element: {
											key: "sleep.stage.REM",
											node: <></>,
										},
										value:
											REMDuration &&
											`${moment.duration(REMDuration.duration).hours()} h ${moment
												.duration(REMDuration.duration)
												.minutes()} min ${REMDuration.percent}%`,
									},
									{
										label: format("sleep.stage.light"),
										element: {
											key: "sleep.stage.light",
											node: <></>,
										},
										value:
											lightDuration &&
											`${moment.duration(lightDuration.duration).hours()} h ${moment
												.duration(lightDuration.duration)
												.minutes()} min ${lightDuration.percent}%`,
									},
									{
										label: format("sleep.stage.deep"),
										element: {
											key: "sleep.stage.deep",
											node: <></>,
										},
										value:
											deepDuration &&
											`${moment.duration(deepDuration.duration).hours()} h ${moment
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
						selectedLocalIsoDay={selectedDay}
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
