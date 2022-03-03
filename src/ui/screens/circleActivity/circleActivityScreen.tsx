import fire from "@assets/images/fire.png";
import heart from "@assets/images/heart.png";
import journey from "@assets/images/journey.png";
import lungs from "@assets/images/lungs.png";
import shoes from "@assets/images/shoes.png";
import sport from "@assets/images/sport.png";
import { useRepresentations } from "@core/representation";
import { useDailyTags } from "@domain/calendar/hooks/useTags";
import { DailyActivityIntensityData } from "@domain/measure/representation/api";
import { dailyActivitiesMetrics, dailyEnergyScoreMetrics } from "@domain/measure/representation/lib/type";
import { TimeFrame } from "@domain/measure/type";
import { CircularBottomSheet, CircularBottomSheetHandle } from "@ui/components/bottomSheet/bottomSheet";
import { CalendarView } from "@ui/components/calendar/calendarView";
import { CircleCalendarButton } from "@ui/components/calendar/circleCalendarButton";
import { InfoListHeader } from "@ui/components/infoList";
import { Stack } from "@ui/components/layout";
import { GaugeDescription } from "@ui/components/measure/gaugeDescription";
import { ScoreGauge } from "@ui/components/measure/scoreGauge";
import { TimeFrameSwitcher } from "@ui/components/measure/timeFrameSwitcher";
import { TitleText } from "@ui/components/text";
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
import { dailyMetricsDetails, getActivityQualityDetails } from "./measureDisplayInfos";

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
	} = useRepresentations();
	const tags = useDailyTags(selectedDay);
	const energyScoreDetails = useDailyEnergyScoreDetails(selectedDay);
	const dailyMetrics = useDailyActivities(selectedDay);
	const energyScore = useDailyEnergyScore(selectedDay);
	const [focusedGauge, setFocusedGauge] = useState<number | null>(null);
	const calendarBottomSheet = useRef<CircularBottomSheetHandle>(null);
	const activityQualityDetails = getActivityQualityDetails(format);
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
					{dailyActivitiesMetrics.map((metric) => {
						const dataInfos = dailyMetricsDetails[metric];
						const value = dailyMetrics[metric];
						return (
							value !== undefined &&
							typeof value === "number" && (
								<DailyMetric
									key={metric}
									icon={getIcon(dataInfos.icon)}
									label={format(dataInfos.labelKey)}
									value={Math.round(value)}
									lowThreshold={
										dataInfos.metricsName.thresholdLow &&
										(energyScoreDetails as any)[dataInfos.metricsName.thresholdLow]
									}
									highThreshold={
										dataInfos.metricsName.thresholdHigh &&
										(energyScoreDetails as any)[dataInfos.metricsName.thresholdHigh]
									}
								/>
							)
						);
					})}
				</ElementStack>
				<InfoListHeader>{format("activity.score.details")}</InfoListHeader>
				<ElementStack gap={10}>
					{
						dailyEnergyScoreMetrics
							.map((metric, index) => {
								const dataInfos = activityQualityDetails[metric];

								const values: {
									value: number;
									thresholdLow: number;
									thresholdHigh: number;
									gaugeFilling: number;
								} = {
									value: (energyScoreDetails as any)[dataInfos.metricsName.value],
									thresholdLow: (energyScoreDetails as any)[dataInfos.metricsName.thresholdLow],
									thresholdHigh: (energyScoreDetails as any)[dataInfos.metricsName.thresholdHigh],
									gaugeFilling: (energyScoreDetails as any)[dataInfos.metricsName.gaugeFilling],
								};
								return [
									<ScoreGauge
										key={metric}
										value={dataInfos.renderValue(values)}
										gaugeFilling={values.gaugeFilling}
										color={dataInfos.getGaugeColor(values)}
										label={format(dataInfos.titleKey)}
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

const Container = styled.View`
	flex: 1;
	background-color: ${colors.white};
`;

const ElementStack = styled(Stack)`
	padding: 25px 20px;
	background-color: ${colors.lightgray};
`;
