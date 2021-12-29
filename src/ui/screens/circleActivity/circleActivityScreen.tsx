import { useDailyActivityDetails, useDailyActivityDuration, useDailyActivityIntensity, useDailyEnergyScore } from "@domain/measure/representation/hooks";
import { dailyActivityDetailsMetrics, dailyEnergyScoreMetrics } from "@domain/measure/representation/type";
import { CircularBottomSheet, CircularBottomSheetHandle } from "@ui/components/bottomSheet/bottomSheet";
import { CalendarView } from "@ui/components/calendar/calendarView";
import { CircleCalendarButton } from "@ui/components/calendar/circleCalendarButton";
import { InfoListHeader } from "@ui/components/infoList";
import { Stack } from "@ui/components/layout";
import { GaugeDescription } from "@ui/components/measure/gaugeDescription";
import { ScoreGauge } from "@ui/components/measure/scoreGauge";
import { ScoreSection } from "@ui/components/measure/scoreSection";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import moment from "moment";
import React, { useRef, useState } from "react";
import { LayoutAnimation, ScrollView, View } from "react-native";
import styled from "styled-components/native";
import { ActivityDurationPieChart } from "./activityDurationPie";
import { DailyMetric } from "./dailyMetric";
import { dailyMetricsDataInfos, scoreDetailsDataInfos } from "./measureDisplayInfos";

const scoreGoodThreshold = 0.8;
const scoreOptimalThreshold = 0.9;

export const CircleActivityScreen: React.FC = () => {
	const { format } = useI18n();
	const [selectedDay, setSelectedDay] = useState<string>(moment().format("YYYY-MM-DD"));
	const activityIntensity = useDailyActivityIntensity()
	const activityDetails = useDailyActivityDetails()
	const activityDuration = useDailyActivityDuration(selectedDay);
	const energyScore = useDailyEnergyScore(selectedDay);
	const [focusedGauge, setFocusedGauge] = useState<number | null>(null);
	const calendarBottomSheet = useRef<CircularBottomSheetHandle>(null);
	
	return (
		<Container>
			<ScrollView>
				<View>
					<ScoreSection
						style={{ marginTop: 20 }}
						color={colors.red}
						score={energyScore}
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
				<InfoListHeader>{format("sleep.duration.title")}</InfoListHeader>
				<ActivityDurationPieChart stages={activityIntensity} duration={activityDuration ?? 0} />
				<InfoListHeader>{format("activity.score.daily_metrics")}</InfoListHeader>
				<ElementStack gap={10}>
					{dailyActivityDetailsMetrics.map((metric) => {
						const dataInfos = dailyMetricsDataInfos[metric];
						const value = activityDetails[metric];
						return (
							<DailyMetric
								key={metric}
								icon={dataInfos.icon}
								label={format(dataInfos.labelKey)}
								value={value !== undefined ? Math.round(value) : undefined}
								goodThreshold={dataInfos.goodGoal && activityDetails[dataInfos.goodGoal]}
								optimalThreshold={dataInfos.optimalGoal && activityDetails[dataInfos.optimalGoal]}
							/>
						);
					})}
				</ElementStack>
				<InfoListHeader>{format("activity.score.details")}</InfoListHeader>
				<ElementStack gap={10}>
					{
						dailyEnergyScoreMetrics
							.map((metric, index) => {
								const dataInfos = scoreDetailsDataInfos[metric];
								const value = activityDetails[metric];
								const gaugeValue = dataInfos.gauge ? activityDetails[dataInfos.gauge] : value;
								return [
									<ScoreGauge
										key={metric}
										value={value !== undefined ? Math.round(value) : undefined}
										rate={gaugeValue !== undefined ? gaugeValue / 100 : undefined}
										unit={dataInfos.unit}
										goodThreshold={scoreGoodThreshold}
										optimalThreshold={scoreOptimalThreshold}
										label={format(dataInfos.titleKey)}
										onPress={() => {
											LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
											setFocusedGauge((current) => (current === index ? null : index));
										}}
									/>,
									focusedGauge === index && (
										<GaugeDescription
											key={metric + "description"}
											colorType="Activity"
											label={format(dataInfos.titleKey)}
											description={format(dataInfos.descriptionKey)}
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
};

const Container = styled.View`
	flex: 1;
	background-color: ${colors.white};
`;

const ElementStack = styled(Stack)`
	padding: 25px 20px;
	background-color: ${colors.lightgray};
`;
