import fire from "@assets/images/fire.png";
import heart from "@assets/images/heart.png";
import journey from "@assets/images/journey.png";
import lungs from "@assets/images/lungs.png";
import shoes from "@assets/images/shoes.png";
import sport from "@assets/images/sport.png";
import { useRepresentations } from "@core/representation";
import { services } from "@core/services";
import { getCurrentLocalISODay } from "@domain/common/business";
import { ISODay } from "@domain/common/type";
import { MetricType } from "@domain/measure/metric";
import { ActivityDetail, DailyActivityIntensityData, DataControlState } from "@domain/measure/representation/api";
import { getActivityControlState } from "@domain/measure/representation/business";
import { Activities, activities, activityScoreContributors } from "@domain/measure/representation/lib/type";
import { Goals } from "@domain/user/goals.model";
import { useUserCalibrationRemainingDays } from "@domain/user/hooks/useUser";
import { getInitMode, isInCalibrationMode, TrimOptions, updateMode } from "@ui/business";
import { CircularBottomSheet, CircularBottomSheetHandle } from "@ui/components/bottomSheet/bottomSheet";
import { CircleCalendarButton } from "@ui/components/calendar/circleCalendarButton";
import { InfoListHeader } from "@ui/components/infoList";
import { Row, Stack } from "@ui/components/layout";
import { GaugeDescription } from "@ui/components/measure/gaugeDescription";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { Spinner } from "@ui/components/spinner";
import { CalendarView } from "@ui/containers/calendarView";
import { ScoreGauge } from "@ui/containers/scoreGauge";
import { ScoreSection } from "@ui/containers/scoreSection";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { observer } from "mobx-react-lite";
import moment from "moment";
import React, { useRef, useState } from "react";
import { Image, LayoutAnimation, Platform, View } from "react-native";
import styled from "styled-components/native";
import { Spo2Graph } from "../circleSleep/spo2Graph/Spo2Graph";
import { ActivityDurationPieChart } from "./activityDurationPie";
import { ActivityIntensityGraph } from "./activityIntensityGraph";
import { CaloriesBurnedGraph } from "./caloriesBurnedGraph";
import { CardioPointsGraph } from "./cardioPointsGraph";
import { DailyMetric } from "./dailyMetric";
import { EnergyScoreGraph } from "./energyScoreGraph";
import { HRGraph } from "./HRGraph/HRGraph";
import { dailyActivitiesUIConfig, getActivityGaugesConfig } from "./measureDisplayInfos";
import { RestingHeartRateGraphs } from "./restingHeartRateGraphs";
import { StepsGraph } from "./StepsGraph";
function getIcon(path: string) {
	switch (path) {
		case "@assets/images/shoes.png":
			return shoes;
		case "@assets/images/journey.png":
			return journey;
		case "@assets/images/fire.png":
			return fire;
		case "@assets/images/sport.png":
			return sport;
		case "@assets/images/lungs.png":
			return lungs;
		case "@assets/images/heart.png":
			return heart;
	}
}

const dailyMetricControlStateParent: Record<string, MetricType> = {
	[MetricType.UserDailyWalkingEquivalency]: MetricType.UserDailySteps,
	[MetricType.UserDailyCaloriesBurned]: MetricType.UserDailySteps,
};

export const CircleActivityScreen = observer(function CircleActivityScreen() {
	const {
		measure: {
			hooks: {
				useDailyEnergyScoreContributors: useDailyEnergyScoreDetails,
				useDailyActivities,
				useDailyEnergyScore,
				useDailyActivityIntensity,
				useHasCompleteCoreSleep,
				useCoreSleep,
			},
		},
	} = useRepresentations();
	const { format } = useI18n();
	const [selectedDay, setSelectedDay] = useState<ISODay>(getCurrentLocalISODay());
	const [dailyActivitiesData, setDailyActivity] = useState<Record<Activities, ActivityDetail> | undefined>(undefined);
	const [isLoading, setLoading] = useState<boolean>(true);
	const [activityIntensity, setData] = useState<DailyActivityIntensityData>({
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
	const energyScoreDetails = useDailyEnergyScoreDetails(selectedDay);
	const dailyData = useDailyActivities(selectedDay);
	if (dailyData && !dailyActivitiesData) {
		// FIXME This is a stupid fix due to a bad usage of the SAM design pattern.
		services.userService.getGoals().then(({ goals }) => {
			Object.entries(dailyData).forEach(([key, value]) => {
				const parentKey = dailyMetricControlStateParent[key] ?? key;
				if (parentKey !== key || !!goals[`${parentKey}.goal.min` as Goals]) {
					(value as any).controlState = getActivityControlState({
						value: parentKey === key ? value.value ?? 0 : (dailyData as any)[parentKey as MetricType].value,
						thresholdLow: goals[`${parentKey}.goal.min` as Goals],
						thresholdHigh: goals[`${parentKey}.goal.max` as Goals],
					});
				}
			});
			setDailyActivity(dailyData);
		});
	}

	const energyScore = useDailyEnergyScore(selectedDay);
	const [focusedGauge, setFocusedGauge] = useState<number | null>(null);
	const calendarBottomSheet = useRef<CircularBottomSheetHandle>(null);
	const activityContributorGaugesConfig = getActivityGaugesConfig(format);
	useDailyActivityIntensity({ localISODay: selectedDay, setData, setLoading });

	const coreSleepTiming = useCoreSleep(selectedDay);

	const hasCompleteCoreSleep = useHasCompleteCoreSleep(selectedDay);
	const nbRemainingDays = useUserCalibrationRemainingDays();
	// XXX: https://circularing.atlassian.net/browse/CIR-93
	const screenMode = getInitMode(nbRemainingDays, hasCompleteCoreSleep);
	// XXX: https://circularing.atlassian.net/browse/CIR-830?focusedCommentId=11137
	const screenModeWithoutDisabled = getInitMode(nbRemainingDays, hasCompleteCoreSleep, { allowDisabled: false });

	const [activeItem, setActiveItem] = useState<number>(0);

	// XXX: https://circularing.atlassian.net/browse/CIR-874
	const dailyTrimOptions: TrimOptions = {
		includes: [
			[moment(selectedDay).startOf("day").valueOf(), moment(selectedDay).startOf("day").add(1, "day").valueOf()],
		],
		excludes: coreSleepTiming ? [[moment(coreSleepTiming[0]).valueOf(), moment(coreSleepTiming[1]).valueOf()]] : [],
	};

	const graphs = [
		<ActivityIntensityGraph
			key={0}
			selectedDay={selectedDay}
			mode={screenModeWithoutDisabled}
			dailyTrimOptions={dailyTrimOptions}
			dataActivityIntensity={activityIntensity}
		/>,
		<StepsGraph key={1} selectedDay={selectedDay} mode={screenModeWithoutDisabled} />,
		<CaloriesBurnedGraph key={2} selectedDay={selectedDay} mode={screenModeWithoutDisabled} />,
		<CardioPointsGraph key={3} selectedDay={selectedDay} mode={screenModeWithoutDisabled} />,
		<EnergyScoreGraph
			key={4}
			selectedDay={selectedDay}
			// XXX: Energy score should not be displayed in calibration mode.
			// https://circularing.atlassian.net/browse/CIR-904
			mode={updateMode(screenModeWithoutDisabled, isInCalibrationMode(screenModeWithoutDisabled))}
		/>,
		<HRGraph key={5} selectedDay={selectedDay} mode={screenModeWithoutDisabled} dailyTrimOptions={dailyTrimOptions} />,
		<RestingHeartRateGraphs key={6} selectedDay={selectedDay} mode={screenModeWithoutDisabled} />,
		<Spo2Graph
			key={7}
			selectedDay={selectedDay}
			mode={screenMode}
			screenModeWithoutDisabled={screenModeWithoutDisabled}
			dailyTrimOptions={dailyTrimOptions}
		/>,
	];

	return (
		<Container>
			<View>
				<ScoreSection
					style={{ marginTop: 20 }}
					color={colors.orangeRed}
					score={energyScore?.score}
					quality={energyScore?.controlState}
					label={format("activity.energy_score")}
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
			<InfoListHeader>{format("activity.duration.title")}</InfoListHeader>

			<ActivityDurationPieChart
				isToday={selectedDay === getCurrentLocalISODay()}
				stages={activityIntensity.stages}
				controlState={activityIntensity.controlState}
				sportSessionDates={activityIntensity.sportSessionDates}
				duration={activityIntensity.duration.total}
				mode={screenModeWithoutDisabled}
				isLoading={isLoading}
			/>
			<InfoListHeader>{format("activity.score.daily_metrics")}</InfoListHeader>
			<ElementStack gap={10}>
				{dailyActivitiesData ? (
					activities.map((metric) => {
						const dataInfos = dailyActivitiesUIConfig[metric];
						const transform = dataInfos.renderValue;
						const data = dailyActivitiesData[metric];

						return (
							<DailyMetric
								key={metric}
								icon={getIcon(dataInfos.icon)}
								label={format(dataInfos.labelKey)}
								value={(transform ? transform(data?.value) : data?.value)?.toFixed(dataInfos.decimalNb)}
								score={data?.score}
								controlState={data?.controlState}
								mode={screenModeWithoutDisabled}
							/>
						);
					})
				) : (
					<Spinner size={24} />
				)}
			</ElementStack>
			<InfoListHeader>{format("activity.score.details")}</InfoListHeader>
			<ElementStack gap={10}>
				{energyScoreDetails ? (
					(activityScoreContributors
						.map((metric, index) => {
							const uiConfig = activityContributorGaugesConfig[metric];
							const percent = energyScoreDetails?.[metric].percent;
							if (Platform.OS === "ios" && uiConfig.titleKey === "score.details.spo2.label") return null;
							return [
								<ScoreGauge
									key={metric}
									value={uiConfig.renderValue({
										...energyScoreDetails[metric],
									})}
									percent={percent}
									label={format(uiConfig.titleKey)}
									quality={energyScoreDetails[metric].controlState}
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
										colorType="Activity"
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
			<InfoListHeader>{format("activity.details.title")}</InfoListHeader>
			<ElementStack gap={10} style={{ display: "flex" }}>
				{graphs[activeItem]}

				<ElementStack gap={10} style={{ display: "flex", paddingBottom: 5 }}>
					<Row style={{ justifyContent: "center" }}>
						<ImageContainer onPress={() => setActiveItem(0)}>
							<GraphSwitcherButton
								style={{ marginLeft: 0 }}
								source={
									activeItem === 0
										? require(`@assets/images/circleActivity.png`)
										: require(`@assets/images/circleActivityTransparent.png`)
								}
							/>
						</ImageContainer>

						<ImageContainer onPress={() => setActiveItem(1)}>
							<GraphSwitcherButton
								source={
									activeItem === 1
										? require(`@assets/images/numberOfSteps.png`)
										: require(`@assets/images/numberOfStepsTransparent.png`)
								}
							/>
						</ImageContainer>
						<ImageContainer onPress={() => setActiveItem(2)}>
							<GraphSwitcherButton
								source={
									activeItem === 2
										? require(`@assets/images/caloriesBurned.png`)
										: require(`@assets/images/caloriesBurnedTransparent.png`)
								}
							/>
						</ImageContainer>

						<ImageContainer onPress={() => setActiveItem(3)}>
							<GraphSwitcherButton
								source={
									activeItem === 3
										? require(`@assets/images/cardioPoints.png`)
										: require(`@assets/images/cardioPointsTransparent.png`)
								}
							/>
						</ImageContainer>
					</Row>
					<Row style={{ justifyContent: "center" }}>
						<ImageContainer onPress={() => setActiveItem(4)}>
							<GraphSwitcherButton
								source={
									activeItem === 4
										? require(`@assets/images/energyScore.png`)
										: require(`@assets/images/energyScoreTransparent.png`)
								}
							/>
						</ImageContainer>
						<ImageContainer onPress={() => setActiveItem(5)}>
							<GraphSwitcherButton
								source={
									activeItem === 5
										? require(`@assets/images/heartCircle.png`)
										: require(`@assets/images/heartCircleTransparent.png`)
								}
							/>
						</ImageContainer>
						<ImageContainer onPress={() => setActiveItem(6)}>
							<GraphSwitcherButton
								source={
									activeItem === 6
										? require(`@assets/images/restingHeartRate.png`)
										: require(`@assets/images/restingHeartRateTransparent.png`)
								}
							/>
						</ImageContainer>
						{Platform.OS === "android" && (
							<ImageContainer onPress={() => setActiveItem(7)}>
								<GraphSwitcherButton
									source={
										activeItem === 7
											? require(`@assets/images/spo2.png`)
											: require(`@assets/images/spo2Transparent.png`)
									}
								/>
							</ImageContainer>
						)}
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
							setLoading(true);
							setSelectedDay(day);
							setDailyActivity(undefined);
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

const GraphSwitcherButton = styled(Image)`
	margin-left: 7px;
	margin-right: 7px;
	margin-bottom: 4px;
	width: 40px;
	height: 40px;
	align-items: center;
	justify-content: center;
`;
const ImageContainer = styled.Pressable`
	align-items: center;
`;
