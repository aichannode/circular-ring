import { useSleepDurationData, useSleepQualityDailyData } from "@domain/measure/hooks";
import { allSleepQualityMetrics } from "@domain/measure/metric";
import { CircularBottomSheet, CircularBottomSheetHandle } from "@ui/components/bottomSheet/bottomSheet";
import { Calendar } from "@ui/components/calendar/calendar";
import { CircleCalendarButton } from "@ui/components/calendar/circleCalendarButton";
import { InfoListHeader } from "@ui/components/infoList";
import { Stack } from "@ui/components/layout";
import { DailyPhasesPie } from "@ui/components/measure/dailyPhasesPie";
import { GaugeDescription } from "@ui/components/measure/gaugeDescription";
import { ScoreGauge } from "@ui/components/measure/scoreGauge";
import { ScoreSection } from "@ui/components/measure/scoreSection";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import dayjs from "dayjs";
import React, { useRef, useState } from "react";
import { LayoutAnimation, View } from "react-native";
import styled from "styled-components/native";
import { scoreDetailsDataInfos } from "./measureDisplayInfos";

const scoreGoodThreshold = 0.8;
const scoreOptimalThreshold = 0.9;

export const CircleSleepScreen: React.FC = () => {
	const sleepDurationData = useSleepDurationData();
	const [focusedGauge, setFocusedGauge] = useState<number | null>(null);
	const { format } = useI18n();

	const [selectedDay, setSelectedDay] = useState<string>(dayjs().format("YYYY-MM-DD"));
	const calendarBottomSheet = useRef<CircularBottomSheetHandle>(null);

	const { result: dailyData } = useSleepQualityDailyData(selectedDay);

	// if (!dailyData) {
	// 	return null;
	// }

	return (
		<Container>
			<InfoListHeader>{format("sleep.duration.title")}</InfoListHeader>
			<View>
				<DailyPhasesPie sleepDurationData={sleepDurationData} />
			</View>
			<View>
				<ScoreSection
					style={{ marginTop: 20 }}
					label={format("sleep.quality_score")}
					score={dailyData?.data.metrics["user.daily.sleep.score"]}
					color={colors.darkBlue}
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
			<InfoListHeader>{format("sleep.quality.details")}</InfoListHeader>
			<ElementStack gap={10}>
				{
					allSleepQualityMetrics
						.map((metric, index) => {
							const dataInfos = scoreDetailsDataInfos[metric];
							const value = dailyData?.data.metrics[metric];
							const gaugeValue = dataInfos.gauge ? dailyData?.data.metrics[dataInfos.gauge] : value;
							return [
								<ScoreGauge
									key={metric}
									value={value !== undefined ? Math.round(value) : undefined}
									rate={gaugeValue !== undefined ? gaugeValue / 100 : undefined}
									unit={dataInfos.unit}
									goodThreshold={scoreGoodThreshold}
									optimalThreshold={scoreOptimalThreshold}
									label={format(dataInfos.titleKey)}
									displayGaugeValue={dataInfos.displayGaugeValue}
									gaugeInverted={dataInfos.inverted}
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
			<CircularBottomSheet ref={calendarBottomSheet} snapPoints={[400]}>
				<View style={{ padding: 20 }}>
					<Calendar
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

const Container = styled(ScrollScreen)`
	background-color: ${colors.white};
`;
const ElementStack = styled(Stack)`
	padding: 25px 20px;
	background-color: ${colors.lightgray};
`;
