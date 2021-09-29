import { useActivityData } from "@domain/measure/hooks";
import { alldailyActivityMetrics, allEnergyScoreMetrics } from "@domain/measure/metric";
import { Stack } from "@ui/components/layout";
import { GaugeDescription } from "@ui/components/measure/gaugeDescription";
import { ScoreGauge } from "@ui/components/measure/scoreGauge";
import { ScoreSection } from "@ui/components/measure/scoreSection";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import React, { useState } from "react";
import { LayoutAnimation, ScrollView } from "react-native";
import styled from "styled-components/native";
import { ScreenSection } from "../../components/screenSection";
import { DailyMetric } from "./dailyMetric";
import { dailyMetricsDataInfos, scoreDetailsDataInfos } from "./measureDisplayInfos";

const scoreGoodThreshold = 0.8;
const scoreOptimalThreshold = 0.9;

export const CircleActivityScreen: React.FC = () => {
	const dailyData = useActivityData();
	const { format } = useI18n();
	const [focusedGauge, setFocusedGauge] = useState<number | null>(null);

	if (!dailyData) {
		return null;
	}

	return (
		<Container>
			<ScrollView>
				<ScreenSection title={format("activity.score.daily_metrics")}>
					<ScoreSection
						style={{ marginBottom: 25 }}
						color={colors.red}
						score={dailyData.metrics["user.daily.energy.score"]}
						label={format("activity.energy_score")}
					/>
				</ScreenSection>
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
		</Container>
	);
};

const Container = styled.View`
	flex: 1;
	background-color: ${colors.lightgray};
`;

const ElementStack = styled(Stack)`
	padding: 25px 20px;
`;
