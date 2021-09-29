import { useSleepQualityDailyData } from "@domain/circleSleep/hooks";
import { allSleepQualityMetrics } from "@domain/measure/metric";
import { Stack } from "@ui/components/layout";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { useI18n } from "@ui/i18n";
import React, { useState } from "react";
import { LayoutAnimation } from "react-native";
import styled from "styled-components/native";
import { GaugeDescription } from "../circleActivity/gaugeDescription";
import { ScoreGauge } from "../circleActivity/scoreGauge";
import { ScreenSection } from "../circleActivity/screenSection";
import { scoreDetailsDataInfos } from "./measureDisplayInfos";

const scoreGoodThreshold = 0.8;
const scoreOptimalThreshold = 0.9;
export const CircleSleepScreen: React.FC = () => {
	const dailyData = useSleepQualityDailyData();
	const [focusedGauge, setFocusedGauge] = useState<number | null>(null);
	const { format } = useI18n();

	if (!dailyData) {
		return null;
	}

	return (
		<Container>
			<ScreenSection title={format("sleep.quality.details")} />
			<Stack>
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
			</Stack>
		</Container>
	);
};

const Container = styled(ScrollScreen)`
	padding-vertical: 50px;
`;
