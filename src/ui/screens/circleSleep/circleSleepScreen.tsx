import { useRepresentations } from "@core/representation";
import { getCurrentLocalISODay } from "@domain/common/business";
import { ISODay } from "@domain/common/type";
import { DailySleepData } from "@domain/measure/representation/api";
import { sleepScoreContributors } from "@domain/measure/representation/lib/type";
import { TimeFrame } from "@domain/measure/type";
import { useUserCalibrationRemainingDays } from "@domain/user/hooks/useUser";
import { getInitMode, isInCalibrationMode, TrimOptions, updateMode } from "@ui/business";
import { CircularBottomSheet, CircularBottomSheetHandle } from "@ui/components/bottomSheet/bottomSheet";
import { CircleCalendarButton } from "@ui/components/calendar/circleCalendarButton";
import { InfoListHeader } from "@ui/components/infoList";
import { Row, Stack } from "@ui/components/layout";
import { GaugeDescription } from "@ui/components/measure/gaugeDescription";
import { GraphContainer } from "@ui/components/measure/graphContainer";
import { TimeFrameSwitcher } from "@ui/components/measure/timeFrameSwitcher";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { Spinner } from "@ui/components/spinner";
import { TitleText } from "@ui/components/text";
import { CalendarView } from "@ui/containers/calendarView";
import { ScoreGauge } from "@ui/containers/scoreGauge";
import { ScoreSection } from "@ui/containers/scoreSection";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { observer } from "mobx-react-lite";
import moment from "moment";
import React, { useRef, useState } from "react";
import { Image, LayoutAnimation, View } from "react-native";
import styled from "styled-components/native";
import { BRGraph } from "./breathingRateGraph/BRGraph";
import { DailySleepChart } from "./DailySleepChart";
import { HeartRateGraph } from "./heartRateGraph/heartRateGraph";
import { HRSGraph } from "./HRSGraph";
import { HRVGraph } from "./HRVGraph/HRVGraph";
import { getSleepGaugesConfig } from "./measureDisplayInfos";
import { Sleep7DChart } from "./Sleep7DChart";
import { SleepDurationPieChart } from "./sleepDurationPie";
import { SleepQualityScoreGraph } from "./sleepQualityScoreGraph";
import { Spo2Graph } from "./spo2Graph/Spo2Graph";
import { TemperatureVariationGraph } from "./temperatureVariationGraph/temperatureVariationGraph";
export const CircleSleepScreen = observer(function CircleSleepScreen() {
	const [loading, setLoading] = useState<boolean>(false);
	const [selectedDay, setSelectedDay] = useState<ISODay>(getCurrentLocalISODay());
	const [graphPeriod, setGraphPeriod] = useState(TimeFrame.TODAY);
	const updatedSelectedDay =
		moment(selectedDay).utcOffset() < 0 ? moment(selectedDay).subtract(1, "day").format("YYYY-MM-DD") : selectedDay;
	const { useDailySleepScoreContributors, useDailySleepQualityScore, useDailySleepStages, useHasCompleteCoreSleep } =
		useRepresentations().measure.hooks;
	const sleepScoreContributorsData = useDailySleepScoreContributors(updatedSelectedDay);

	const qualityScore = useDailySleepQualityScore(updatedSelectedDay);
	const [dailySleep, setDailyData] = useState<DailySleepData | undefined>();
	const [focusedGauge, setFocusedGauge] = useState<number | null>(null);
	const [activeItem, setActiveItem] = useState<number>(0);
	const { format } = useI18n();
	const calendarBottomSheet = useRef<CircularBottomSheetHandle>(null);
	const sleepGaugesConfig = getSleepGaugesConfig(format);

	const hasCompleteCoreSleep = useHasCompleteCoreSleep(updatedSelectedDay);
	const nbRemainingDays = useUserCalibrationRemainingDays();
	// XXX: https://circularing.atlassian.net/browse/CIR-93
	const screenMode = getInitMode(nbRemainingDays, hasCompleteCoreSleep);
	const screenModeWithoutDisabled = getInitMode(nbRemainingDays, hasCompleteCoreSleep, { allowDisabled: false });
	useDailySleepStages({ setData: setDailyData, localISODay: updatedSelectedDay, setLoading });

	// XXX: https://circularing.atlassian.net/browse/CIR-790
	const [] = dailySleep?.coreSleepTiming ?? [];
	const dailyTrimOptions: TrimOptions = {
		includes: dailySleep?.coreSleepTiming
			? [[moment(dailySleep.coreSleepTiming[0]).valueOf(), moment(dailySleep.coreSleepTiming[1]).valueOf()]]
			: [],
		excludes: dailySleep?.coreSleepTiming
			? [
					[
						moment(dailySleep.coreSleepTiming[0]).subtract(1, "day").valueOf(),
						moment(dailySleep.coreSleepTiming[0]).valueOf(),
					],
			  ]
			: [],
	};

	return (
		<Container>
			<View>
				<ScoreSection
					style={{ marginTop: 20 }}
					label={format("sleep.quality_score")}
					score={qualityScore ? qualityScore.score : undefined}
					quality={qualityScore ? qualityScore.controlState : undefined}
					color={colors.business.sleepPrimary}
					mode={screenMode}
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
					stages={dailySleep.stages}
					coreSleepTiming={dailySleep.coreSleepTiming}
					napTimings={dailySleep.napTimings}
					duration={dailySleep.totalMinutesSleepDuration ?? -1}
					mode={screenMode}
					isLoading={loading}
				/>
			) : (
				<Spinner />
			)}
			<InfoListHeader>{format("sleep.quality.details")}</InfoListHeader>
			<ElementStack gap={10}>
				{sleepScoreContributorsData ? (
					(sleepScoreContributors
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
									mode={uiConfig.computeMode(screenMode)}
									forceDisplayValue={uiConfig.shouldForceDisplayValue}
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
						.filter(Boolean) as JSX.Element[])
				) : (
					<Spinner size={24} />
				)}
			</ElementStack>
			<InfoListHeader>{format("sleep.details.title")}</InfoListHeader>

			<ElementStack gap={10}>
				{activeItem === 0 && (
					<>
						<TitleText style={{ textAlign: "center", textTransform: "uppercase" }}>
							{format("sleep.details.stages")}
						</TitleText>
						<View style={{ marginBottom: 25, marginTop: 20 }}>
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
									<DailySleepChart data={dailySleep} selectedDay={updatedSelectedDay} mode={screenMode} />
								)}
								{graphPeriod === TimeFrame.LAST_7_DAYS && (
									<Sleep7DChart selectedDay={updatedSelectedDay} mode={screenModeWithoutDisabled} />
								)}
								{/* {graphPeriod === TimeFrame.ALL && (
									<SleepAllChart selectedDay={selectedDay} mode={screenModeWithoutDisabled} />
								)} */}
							</GraphContainer>
						) : (
							<Spinner />
						)}
					</>
				)}
				{activeItem === 1 && (
					<SleepQualityScoreGraph
						selectedDay={updatedSelectedDay}
						// XXX: Sleep quality score should not be displayed in calibration mode.
						// https://circularing.atlassian.net/browse/CIR-904
						mode={updateMode(screenModeWithoutDisabled, isInCalibrationMode(screenMode))}
					/>
				)}
				{activeItem === 2 && (
					<HeartRateGraph
						selectedDay={updatedSelectedDay}
						mode={screenMode}
						screenModeWithoutDisabled={screenModeWithoutDisabled}
						dailyTrimOptions={dailyTrimOptions}
					/>
				)}
				{activeItem === 3 && (
					<HRVGraph
						selectedDay={updatedSelectedDay}
						mode={screenMode}
						screenModeWithoutDisabled={screenModeWithoutDisabled}
						dailyTrimOptions={dailyTrimOptions}
					/>
				)}
				{activeItem === 4 && (
					<BRGraph
						selectedDay={updatedSelectedDay}
						mode={screenMode}
						screenModeWithoutDisabled={screenModeWithoutDisabled}
						dailyTrimOptions={dailyTrimOptions}
					/>
				)}
				{activeItem === 5 && (
					<TemperatureVariationGraph
						selectedDay={updatedSelectedDay}
						mode={updateMode(screenModeWithoutDisabled, isInCalibrationMode(screenMode))}
					/>
				)}

				{activeItem === 6 && (
					<Spo2Graph
						selectedDay={updatedSelectedDay}
						mode={screenMode}
						screenModeWithoutDisabled={screenModeWithoutDisabled}
						dailyTrimOptions={dailyTrimOptions}
					/>
				)}
				{activeItem === 7 && <HRSGraph selectedDay={updatedSelectedDay} mode={screenModeWithoutDisabled} />}

				<ElementStack gap={10} style={{ display: "flex", paddingBottom: 5 }}>
					<Row style={{ justifyContent: "center" }}>
						<ImageContainer onPress={() => setActiveItem(0)}>
							<GraphSwitcherButton
								style={{ marginLeft: 0 }}
								source={
									activeItem === 0
										? require(`@assets/images/sleepCircleBlue.png`)
										: require(`@assets/images/sleepCircleBlueTransparent.png`)
								}
							/>
						</ImageContainer>
						<ImageContainer onPress={() => setActiveItem(1)}>
							<GraphSwitcherButton
								source={
									activeItem === 1
										? require(`@assets/images/sleepQualityScore.png`)
										: require(`@assets/images/sleepQualityScoreTransparent.png`)
								}
							/>
						</ImageContainer>
						<ImageContainer onPress={() => setActiveItem(7)}>
							<GraphSwitcherButton
								source={
									activeItem === 7 ? require(`@assets/images/hrs.png`) : require(`@assets/images/hrsTransparent.png`)
								}
							/>
						</ImageContainer>

						<ImageContainer onPress={() => setActiveItem(2)}>
							<GraphSwitcherButton
								source={
									activeItem === 2
										? require(`@assets/images/heartCircleBlue.png`)
										: require(`@assets/images/heartCircleBlueTransparent.png`)
								}
							/>
						</ImageContainer>
					</Row>
					<Row style={{ justifyContent: "center" }}>
						<ImageContainer onPress={() => setActiveItem(3)}>
							<GraphSwitcherButton
								style={{ marginLeft: 0 }}
								source={
									activeItem === 3
										? require(`@assets/images/HRVBlue.png`)
										: require(`@assets/images/HRVBlueTransparent.png`)
								}
							/>
						</ImageContainer>
						<ImageContainer onPress={() => setActiveItem(4)}>
							<GraphSwitcherButton
								source={
									activeItem === 4
										? require(`@assets/images/brBlue.png`)
										: require(`@assets/images/brBlueTransparent.png`)
								}
							/>
						</ImageContainer>
						<ImageContainer onPress={() => setActiveItem(5)}>
							<GraphSwitcherButton
								source={
									activeItem === 5
										? require(`@assets/images/temperatureVariationBlue.png`)
										: require(`@assets/images/temperatureVariationTransparent.png`)
								}
							/>
						</ImageContainer>

						<ImageContainer onPress={() => setActiveItem(6)}>
							<GraphSwitcherButton
								source={
									activeItem === 6
										? require(`@assets/images/spo2Blue.png`)
										: require(`@assets/images/spo2BlueTransparent.png`)
								}
							/>
						</ImageContainer>
					</Row>
				</ElementStack>
			</ElementStack>

			<CircularBottomSheet ref={calendarBottomSheet} snapPoints={[480]}>
				<View style={{ padding: 20 }}>
					<CalendarView
						autoSelectDayOnMonthChange={false}
						selectedLocalIsoDay={selectedDay}
						onDaySelected={async (day) => {
							await calendarBottomSheet.current?.asyncClose();
							setSelectedDay(day);
							setLoading(true);
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
const ImageContainer = styled.Pressable`
	align-items: center;
`;
const GraphSwitcherButton = styled(Image)`
	margin-left: 7px;
	margin-right: 7px;
	margin-bottom: 4px;
	/* margin-top: 4px; */
	width: 40px;
	height: 40px;
	align-items: center;
	justify-content: center;
`;
