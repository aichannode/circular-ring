import { useDailyData } from "@domain/circleActivity/hooks";
import { alldailyActivityMetrics, allEnergyScoreMetrics } from "@domain/measure/metric";
import { Stack } from "@ui/components/layout";
import { useI18n } from "@ui/i18n";
import React, { useState } from "react";
import { LayoutAnimation, ScrollView } from "react-native";
import styled from "styled-components/native";
import { DailyMetric } from "./dailyMetric";
import { GaugeDescription } from "./gaugeDescription";
import { dailyMetricsDataInfos, scoreDetailsDataInfos } from "./measureDisplayInfos";
import { ScoreGauge } from "./scoreGauge";
import { ScreenSection } from "./screenSection";

const scoreGoodThreshold = 0.8;
const scoreOptimalThreshold = 0.9;
export const CircleActivityScreen: React.FC = () => {
	const dailyData = useDailyData();
	const { format } = useI18n();
	const [focusedGauge, setFocusedGauge] = useState<number | null>(null);

	if (!dailyData) {
		return null;
	}

	return (
		<Container>
			<ScrollView>
				<ScreenSection title={format("activity.score.daily_metrics")} />
				<ElementStack gap={10}>
					{alldailyActivityMetrics.map((metric) => {
						const dataInfos = dailyMetricsDataInfos[metric];
						const value = dailyData.metrics[metric];
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
								goodThreshold={dataInfos.goodGoal && dailyData.metrics[dataInfos.goodGoal]}
								optimalThreshold={dataInfos.optimalGoal && dailyData.metrics[dataInfos.optimalGoal]}
							/>
						);
					})}
				</ElementStack>
				<ScreenSection title={format("activity.score.details")} />
				<ElementStack gap={10}>
					{
						allEnergyScoreMetrics
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
		</Container>
	);
};

const Container = styled.View`
	flex: 1;
`;

const ElementStack = styled(Stack)`
	padding: 25px 20px;
`;
