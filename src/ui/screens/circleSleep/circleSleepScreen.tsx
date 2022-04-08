import { useRepresentations } from "@core/representation";
import { getCurrentLocalISODay, isDefined } from "@domain/common/business";
import { ISODay } from "@domain/common/type";
import { DailySleepData } from "@domain/measure/representation/api";
import { sleepScoreContributors } from "@domain/measure/representation/lib/type";
import { TimeFrame } from "@domain/measure/type";
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
import React, { useRef, useState } from "react";
import { Image, LayoutAnimation, View } from "react-native";
import styled from "styled-components/native";
import { DailySleepChart } from "./DailySleepChart";
import { getSleepGaugesConfig } from "./measureDisplayInfos";
import { Sleep7DChart } from "./Sleep7DChart";
import { SleepAllChart } from "./SleepAllChart";
import { SleepDurationPieChart } from "./sleepDurationPie";
import { Spo2Graph } from "./spo2Graph";

export const CircleSleepScreen = observer(function CircleSleepScreen() {
	const [selectedDay, setSelectedDay] = useState<ISODay>(getCurrentLocalISODay());
	const [graphPeriod, setGraphPeriod] = useState(TimeFrame.TODAY);
	const { useDailySleepScoreContributors, useDailySleepQualityScore, useDailySleepStages, hasEnoughData } =
		useRepresentations().measure.hooks;
	const enoughData = hasEnoughData(selectedDay);
	const sleepScoreContributorsData = useDailySleepScoreContributors(selectedDay);
	const qualityScore = useDailySleepQualityScore(selectedDay);
	const [dailySleep, setDailyData] = useState<DailySleepData | undefined>();
	const [focusedGauge, setFocusedGauge] = useState<number | null>(null);
	const [activeItem, setActiveItem] = useState<number>(0);
	const { format } = useI18n();
	const calendarBottomSheet = useRef<CircularBottomSheetHandle>(null);
	const sleepGaugesConfig = getSleepGaugesConfig(format);

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
					stages={dailySleep.stages}
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
									{
										label: "graph.time_frame.all",
										duration: TimeFrame.ALL,
									},
								]}
							/>
						</View>
						{dailySleep ? (
							<GraphContainer>
								{graphPeriod === TimeFrame.TODAY && (
									<DailySleepChart data={dailySleep} selectedDay={selectedDay} hasNotEnoughData={!enoughData} />
								)}
								{graphPeriod === TimeFrame.LAST_7_DAYS && (
									<Sleep7DChart selectedDay={selectedDay} hasNotEnoughData={!enoughData} />
								)}
								{graphPeriod === TimeFrame.ALL && (
									<SleepAllChart selectedDay={selectedDay} hasNotEnoughData={!enoughData} />
								)}
							</GraphContainer>
						) : (
							<Spinner />
						)}
					</>
				)}
				{activeItem === 1 && <></>}
				{activeItem === 3 && <Spo2Graph selectedDay={selectedDay} hasNotEnoughData={!enoughData} />}
				<ElementStack gap={10} style={{ display: "flex", paddingBottom: 5 }}>
					<Row style={{ justifyContent: "center" }}>
						<ImageContainer onPress={() => setActiveItem(0)}>
							<GraphSwitcherButton
								source={
									activeItem === 0
										? require(`@assets/images/sleepCircleBlue.png`)
										: require(`@assets/images/sleepCircleBlueTransparent.png`)
								}
							/>
						</ImageContainer>
						<ImageContainer onPress={() => setActiveItem(1)}>
							<GraphSwitcherButton
								style={{ marginLeft: 0 }}
								source={
									activeItem === 1
										? require(`@assets/images/heartCircleBlue.png`)
										: require(`@assets/images/heartCircleBlueTransparent.png`)
								}
							/>
						</ImageContainer>
						<ImageContainer onPress={() => setActiveItem(3)}>
							<GraphSwitcherButton
								style={{ marginLeft: 0 }}
								source={
									activeItem === 3
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
