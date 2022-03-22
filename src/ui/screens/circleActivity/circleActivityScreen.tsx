import fire from "@assets/images/fire.png";
import heart from "@assets/images/heart.png";
import journey from "@assets/images/journey.png";
import lungs from "@assets/images/lungs.png";
import shoes from "@assets/images/shoes.png";
import sport from "@assets/images/sport.png";
import { useRepresentations } from "@core/representation";
import { getCurrentLocalISODay } from "@domain/common/business";
import { ISODay } from "@domain/common/type";
import { DailyActivityIntensityData } from "@domain/measure/representation/api";
import { activities, activityScoreContributors } from "@domain/measure/representation/lib/type";
import { CircularBottomSheet, CircularBottomSheetHandle } from "@ui/components/bottomSheet/bottomSheet";
import { CircleCalendarButton } from "@ui/components/calendar/circleCalendarButton";
import { InfoListHeader } from "@ui/components/infoList";
import { Row, Stack } from "@ui/components/layout";
import { GaugeDescription } from "@ui/components/measure/gaugeDescription";
import { CalendarView } from "@ui/containers/calendarView";
import { ScoreGauge } from "@ui/containers/scoreGauge";
import { ScoreSection } from "@ui/containers/scoreSection";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { observer } from "mobx-react-lite";
import React, { useRef, useState } from "react";
import { Image, LayoutAnimation, ScrollView, View } from "react-native";
import styled from "styled-components/native";
import { ActivityDurationPieChart } from "./activityDurationPie";
import { ActivityIntensityGraph } from "./activityIntensityGraph";
import { DailyMetric } from "./dailyMetric";
import { HeartRateGraph } from "./heartRateGraph";
import { dailyActivitiesUIConfig, getActivityGaugesConfig } from "./measureDisplayInfos";

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

export const CircleActivityScreen = observer(function CircleActivityScreen() {
	const { format } = useI18n();
	const [selectedDay, setSelectedDay] = useState<ISODay>(getCurrentLocalISODay());
	const [activityIntensity, setData] = useState<DailyActivityIntensityData>({
		stages: [],
		duration: 0,
		sportSessionDates: [],
	});
	const {
		measure: {
			hooks: {
				useDailyEnergyScoreContributors: useDailyEnergyScoreDetails,
				useDailyActivities,
				useDailyEnergyScore,
				useDailyActivityIntensity,
				useCanDisplayData,
			},
		},
	} = useRepresentations();
	const energyScoreDetails = useDailyEnergyScoreDetails(selectedDay);
	const dailyActivitiesData = useDailyActivities(selectedDay);
	const energyScore = useDailyEnergyScore(selectedDay);
	const [focusedGauge, setFocusedGauge] = useState<number | null>(null);
	const calendarBottomSheet = useRef<CircularBottomSheetHandle>(null);
	const activityContributorGaugesConfig = getActivityGaugesConfig(format);
	useDailyActivityIntensity({ localISODay: selectedDay, setData });

	const canDisplay = useCanDisplayData(selectedDay);

	const [activeItem, setActiveItem] = useState<number>(0);

	return (
		<Container>
			<ScrollView>
				<View>
					<ScoreSection
						isDisabled={!canDisplay}
						style={{ marginTop: 20 }}
						color={colors.orangeRed}
						score={energyScore.score}
						quality={energyScore.controlState}
						label={format("activity.energy_score")}
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
					sportSessionDates={activityIntensity.sportSessionDates}
					duration={activityIntensity.duration}
				/>
				<InfoListHeader>{format("activity.score.daily_metrics")}</InfoListHeader>
				<ElementStack gap={10}>
					{activities.map((metric) => {
						const dataInfos = dailyActivitiesUIConfig[metric];
						const data = dailyActivitiesData[metric];

						return (
							typeof data.value === "number" && (
								<DailyMetric
									key={metric}
									icon={getIcon(dataInfos.icon)}
									label={format(dataInfos.labelKey)}
									value={data.value.toFixed(dataInfos.decimalNb)}
									score={data.score}
									controlState={data.controlState}
								/>
							)
						);
					})}
				</ElementStack>
				<InfoListHeader>{format("activity.score.details")}</InfoListHeader>
				<ElementStack gap={10}>
					{
						activityScoreContributors
							.map((metric, index) => {
								const uiConfig = activityContributorGaugesConfig[metric];
								const percent = energyScoreDetails[metric].percent;
								return (
									percent !== undefined &&
									!isNaN(percent) && [
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
									]
								);
							})
							.flatMap((x) => x)
							.filter(Boolean) as JSX.Element[]
					}
				</ElementStack>

				<ElementStack gap={10} style={{ display: "flex" }}>
					{activeItem === 0 && <ActivityIntensityGraph selectedDay={selectedDay} />}

					{activeItem === 1 && <HeartRateGraph selectedDay={selectedDay} />}
				</ElementStack>

				<ElementStack gap={10} style={{ display: "flex", paddingBottom: 5 }}>
					<Row>
						<ImageContainer onPress={() => setActiveItem(0)}>
							<GraphSwitcherButton
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
										? require(`@assets/images/heartCircle.png`)
										: require(`@assets/images/heartCircleTransparent.png`)
								}
							/>
						</ImageContainer>
					</Row>
				</ElementStack>
			</ScrollView>
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

const Container = styled.View`
	flex: 1;
	background-color: ${colors.white};
`;

const ElementStack = styled(Stack)`
	padding: 25px 20px;
	background-color: ${colors.lightgray};
`;

const GraphSwitcherButton = styled(Image)`
	margin-left: 20px;
	width: 40px;
	height: 40px;
	align-items: center;
	justify-content: center;
`;
const ImageContainer = styled.Pressable`
	align-items: center;
`;
