import { useSleepQualityDailyData } from "@domain/measure/hooks";
import { allSleepQualityMetrics } from "@domain/measure/metric";
import { InfoListHeader } from "@ui/components/infoList";
import { Stack } from "@ui/components/layout";
import { GaugeDescription } from "@ui/components/measure/gaugeDescription";
import { ScoreGauge } from "@ui/components/measure/scoreGauge";
import { ScoreSection } from "@ui/components/measure/scoreSection";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import React, { useState } from "react";
import { LayoutAnimation } from "react-native";
import styled from "styled-components/native";
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
			<ScoreSection
				style={{ marginTop: 20 }}
				label={format("sleep.quality_score")}
				score={dailyData.metrics["user.daily.sleep.score"]}
				color={colors.darkBlue}
			/>
			<InfoListHeader>{format("sleep.quality.details")}</InfoListHeader>
			<ElementStack gap={10}>
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
			</ElementStack>
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
