import fire from "@assets/images/fire.png";
import heart from "@assets/images/heart.png";
import journey from "@assets/images/journey.png";
import lungs from "@assets/images/lungs.png";
import shoes from "@assets/images/shoes.png";
import sport from "@assets/images/sport.png";
import { useRepresentations } from "@core/representation";
import { DailyActivityIntensityData } from "@domain/measure/representation/api";
import { activities, activityScoreContributors } from "@domain/measure/representation/lib/type";
import { TimeFrame } from "@domain/measure/type";
import { CircularBottomSheet, CircularBottomSheetHandle } from "@ui/components/bottomSheet/bottomSheet";
import { CalendarView } from "@ui/components/calendar/calendarView";
import { CircleCalendarButton } from "@ui/components/calendar/circleCalendarButton";
import { InfoListHeader } from "@ui/components/infoList";
import { Stack } from "@ui/components/layout";
import { GaugeDescription } from "@ui/components/measure/gaugeDescription";
import { TimeFrameSwitcher } from "@ui/components/measure/timeFrameSwitcher";
import { TitleText } from "@ui/components/text";
import { ScoreGauge } from "@ui/containers/scoreGauge";
import { ScoreSection } from "@ui/containers/scoreSection";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { observer } from "mobx-react-lite";
import moment from "moment";
import React, { useRef, useState } from "react";
import { LayoutAnimation, ScrollView, View } from "react-native";
import styled from "styled-components/native";
import { ActivityDurationPieChart } from "./activityDurationPie";
import { ActivityIntensityGraph } from "./activityIntensityGraph";
import { DailyMetric } from "./dailyMetric";
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

export const CircleActivityScreen: React.FC = observer(() => {
	const { format } = useI18n();
	const [selectedDay, setSelectedDay] = useState<string>(moment().format("YYYY-MM-DD"));
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
		calendar: {
			hooks: { useDailyTags },
		},
	} = useRepresentations();
	const tags = useDailyTags(selectedDay);
	const energyScoreDetails = useDailyEnergyScoreDetails(selectedDay);
	const dailyActivitiesData = useDailyActivities(selectedDay);
	const energyScore = useDailyEnergyScore(selectedDay);
	const [focusedGauge, setFocusedGauge] = useState<number | null>(null);
	const calendarBottomSheet = useRef<CircularBottomSheetHandle>(null);
	const activityContributorGaugesConfig = getActivityGaugesConfig(format);
	const [graphPeriod, setGraphPeriod] = useState(TimeFrame.TODAY);
	useDailyActivityIntensity({ isoDay: selectedDay, setData });
	const graphData: Array<{
		value: number;
		isoTime: string;
	}> = activityIntensity.stages.map((stage) => ({ value: stage.level, isoTime: stage.start }));
	const canDisplay = useCanDisplayData(selectedDay);

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
					stages={activityIntensity.stages}
					sportSessionDates={activityIntensity.sportSessionDates}
					duration={activityIntensity.duration}
				/>
				<InfoListHeader>{format("activity.score.daily_metrics")}</InfoListHeader>
				<ElementStack gap={10}>
					{activities.map((metric) => {
						const dataInfos = dailyActivitiesUIConfig[metric];
						const value = dailyActivitiesData[metric];
						return (
							value !== undefined &&
							typeof value === "number" && (
								<DailyMetric
									key={metric}
									icon={getIcon(dataInfos.icon)}
									label={format(dataInfos.labelKey)}
									value={Math.round(value)}
									lowThreshold={dailyActivitiesData[metric].thresholdLow}
									highThreshold={dailyActivitiesData[metric].thresholdHigh}
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
								return (
									<>
										<ScoreGauge
											value={uiConfig.renderValue({
												...energyScoreDetails[metric],
											})}
											percent={energyScoreDetails[metric].percent}
											label={format(uiConfig.titleKey)}
											quality={energyScoreDetails[metric].controlState}
											onPress={() => {
												LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
												setFocusedGauge((current) => (current === index ? null : index));
											}}
										/>
										{focusedGauge === index && (
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
										)}
									</>
								);
							})
							.flatMap((x) => x)
							.filter(Boolean) as JSX.Element[]
					}
				</ElementStack>
				{!!graphData.length && (
					<ElementStack gap={10}>
						<TitleText style={{ marginBottom: 20, textAlign: "center", textTransform: "uppercase" }}>
							{format("activity.intensity")}
						</TitleText>
						{/** Wait for available data on week/month */}
						<View style={{ display: "none", marginVertical: 10 }}>
							<TimeFrameSwitcher
								setGraphPeriod={setGraphPeriod}
								graphPeriod={graphPeriod}
								color={colors.business.activityPrimary}
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
						<ActivityIntensityGraph tags={tags} samples={graphData} />
					</ElementStack>
				)}
			</ScrollView>
			<CircularBottomSheet ref={calendarBottomSheet} snapPoints={[480]}>
				<View style={{ padding: 20 }}>
					<CalendarView
						autoSelectDayOnMonthChange={false}
						selectedIsoDay={selectedDay}
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
