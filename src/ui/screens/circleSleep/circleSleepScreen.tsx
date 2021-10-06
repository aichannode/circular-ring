import { useSleepQualityDailyData } from "@domain/measure/hooks";
import { DailyPhase } from "@domain/measure/metric";
import { InfoListHeader } from "@ui/components/infoList";
import { Stack } from "@ui/components/layout";
import { DailyPhasesPie } from "@ui/components/measure/dailyPhasesPie";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import dayjs from "dayjs";
import React, { useState } from "react";
import { View } from "react-native";
import styled from "styled-components/native";

const scoreGoodThreshold = 0.8;
const scoreOptimalThreshold = 0.9;

export const CircleSleepScreen: React.FC = () => {
	const dailyData = useSleepQualityDailyData();
	// const sleepDurationData = useSleepDurationData();
	const [focusedGauge, setFocusedGauge] = useState<number | null>(null);
	const { format } = useI18n();

	// if (!dailyData) {
	// 	return null;
	// }

	return (
		<Container>
			{/* <ScoreSection
				style={{ marginTop: 20 }}
				label={format("sleep.quality_score")}
				score={dailyData.metrics["user.daily.sleep.score"]}
				color={colors.darkBlue}
			/> */}
			<InfoListHeader>{format("sleep.duration.title")}</InfoListHeader>
			<View>
				<DailyPhasesPie
					phases={[
						{
							phase: DailyPhase.LYING,
							start: dayjs().subtract(1, "day").hour(22).toDate(),
							end: dayjs().subtract(1, "day").hour(23).toDate(),
						},
						{
							phase: DailyPhase.SLEEP,
							start: dayjs().subtract(1, "day").hour(23).toDate(),
							end: dayjs().hour(1).toDate(),
						},
						{
							phase: DailyPhase.DISTURBANCE,
							start: dayjs().hour(1).toDate(),
							end: dayjs().hour(2).toDate(),
						},
						{
							phase: DailyPhase.SLEEP,
							start: dayjs().hour(2).toDate(),
							end: dayjs().hour(6).minute(0).toDate(),
						},
						{
							phase: DailyPhase.AWAKE,
							start: dayjs().hour(6).minute(0).toDate(),
							end: dayjs().hour(14).toDate(),
						},
						{
							phase: DailyPhase.NAP,
							start: dayjs().hour(14).toDate(),
							end: dayjs().hour(15).toDate(),
						},
						{
							phase: DailyPhase.AWAKE,
							start: dayjs().hour(15).toDate(),
							end: new Date(),
						},
					]}
					// phases={[
					// 	{
					// 		phase: DailyPhase.LYING,
					// 		start: dayjs().subtract(1, "day").hour(23).minute(0).toDate(),
					// 		end: dayjs().startOf("day").toDate(),
					// 	},
					// 	{
					// 		phase: DailyPhase.SLEEP,
					// 		start: dayjs().startOf("day").toDate(),
					// 		end: dayjs().hour(6).minute(0).toDate(),
					// 	},
					// 	{
					// 		phase: DailyPhase.AWAKE,
					// 		start: dayjs().hour(6).minute(0).toDate(),
					// 		end: dayjs().hour(18).minute(0).toDate(),
					// 	},
					// ]}
				/>
			</View>
			<InfoListHeader>{format("sleep.quality.details")}</InfoListHeader>
			{/* <ElementStack gap={10}>
				{
					allSleepQualityMetrics
						.map((metric, index) => {
							const dataInfos = scoreDetailsDataInfos[metric];
							const value = dailyData.metrics[metric];
							const gaugeValue = dataInfos.gauge ? dailyData.metrics[dataInfos.gauge] : value;
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
			</ElementStack> */}
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
