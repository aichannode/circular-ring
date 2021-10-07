import { useActivityData } from "@domain/measure/hooks";
import { alldailyActivityMetrics, allEnergyScoreMetrics } from "@domain/measure/metric";
import { CircularBottomSheet, CircularBottomSheetHandle } from "@ui/components/bottomSheet/bottomSheet";
import { Calendar } from "@ui/components/calendar/calendar";
import { CircleCalendarButton } from "@ui/components/calendar/circleCalendarButton";
import { InfoListHeader } from "@ui/components/infoList";
import { Stack } from "@ui/components/layout";
import { GaugeDescription } from "@ui/components/measure/gaugeDescription";
import { ScoreGauge } from "@ui/components/measure/scoreGauge";
import { ScoreSection } from "@ui/components/measure/scoreSection";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import dayjs from "dayjs";
import React, { useRef, useState } from "react";
import { LayoutAnimation, ScrollView, View } from "react-native";
import styled from "styled-components/native";
import { DailyMetric } from "./dailyMetric";
import { dailyMetricsDataInfos, scoreDetailsDataInfos } from "./measureDisplayInfos";

const scoreGoodThreshold = 0.8;
const scoreOptimalThreshold = 0.9;

export const CircleActivityScreen: React.FC = () => {
	const { format } = useI18n();
	const [focusedGauge, setFocusedGauge] = useState<number | null>(null);

	const [selectedDay, setSelectedDay] = useState<string>(dayjs().format("YYYY-MM-DD"));
	const calendarBottomSheet = useRef<CircularBottomSheetHandle>(null);
	const { result: dailyData } = useActivityData(selectedDay);

	if (!dailyData) {
		return null;
	}

	return (
		<Container>
			<ScrollView>
				<View>
					<ScoreSection
						style={{ marginTop: 20 }}
						color={colors.red}
						score={dailyData.data.metrics["user.daily.energy.score"]}
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
				<InfoListHeader>{format("activity.score.daily_metrics")}</InfoListHeader>
				<ElementStack gap={10}>
					{alldailyActivityMetrics.map((metric) => {
						const dataInfos = dailyMetricsDataInfos[metric];
						const value = dailyData.data.metrics[metric];
						if (!value) {
							console.warn("Missing value for metric", metric);
							return null;
						}
						return (
							<DailyMetric
								key={metric}
								icon={dataInfos.icon}
								label={format(dataInfos.labelKey)}
								value={Math.round(value)}
								goodThreshold={dataInfos.goodGoal && dailyData.data.metrics[dataInfos.goodGoal]}
								optimalThreshold={dataInfos.optimalGoal && dailyData.data.metrics[dataInfos.optimalGoal]}
							/>
						);
					})}
				</ElementStack>
				<InfoListHeader>{format("activity.score.details")}</InfoListHeader>
				<ElementStack gap={10}>
					{
						allEnergyScoreMetrics
							.map((metric, index) => {
								const dataInfos = scoreDetailsDataInfos[metric];
								const value = dailyData.data.metrics[metric];
								const gaugeValue = dataInfos.gauge ? dailyData.data.metrics[dataInfos.gauge] : value;
								if (!value) {
									console.warn("Missing value for metric", metric);
									return null;
								}
								if (!gaugeValue) {
									console.warn("Missing gauge for metric", metric, dataInfos.gauge);
									return null;
								}
								return [
									<ScoreGauge
										key={metric}
										value={Math.round(value)}
										rate={gaugeValue / 100}
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
			<CircularBottomSheet ref={calendarBottomSheet} snapPoints={[400]}>
				<View style={{ padding: 20 }}>
					<Calendar
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
