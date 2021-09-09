import { useI18n } from "@ui/i18n";
import React from "react";
import { ScrollView } from "react-native";
import styled from "styled-components/native";
import { DailyMetric } from "./dailyMetric";
import { useDailyData } from "./hooks";
import { ScoreGauge } from "./scoreGauge";
import { ScreenSection } from "./screenSection";

export const CircleActivityScreen: React.FC = () => {
	const dailyData = useDailyData();
	const { format } = useI18n();

	const metricsData = [
		{
			icon: require("@assets/images/shoes.png"),
			label: format("metric.steps"),
			value: 9200,
			goodThreshold: 4500,
			optimalThreshold: 9000,
		},
		{
			icon: require("@assets/images/journey.png"),
			label: format("metric.walking"),
			value: 5.4,
			goodThreshold: 3,
			optimalThreshold: 5,
		},
		{
			icon: require("@assets/images/fire.png"),
			label: format("metric.calories"),
			value: 1010,
			goodThreshold: 1000,
			optimalThreshold: 1500,
		},
		{
			icon: require("@assets/images/sport.png"),
			label: format("metric.cardio"),
			value: 157,
			goodThreshold: 200,
			optimalThreshold: 300,
		},
		{
			icon: require("@assets/images/lungs.png"),
			label: format("metric.vo2_max"),
			value: 35,
		},
		{
			icon: require("@assets/images/heart.png"),
			label: format("metric.hr_max"),
			value: 123,
		},
	];

	const scoreDetailsData = [
		{
			label: format("score.details.recovery"),
			value: 0.45,
			unit: "qualitative",
		},
		{
			label: format("score.details.wake_up"),
			value: 0.96,
			unit: "%",
		},
		{
			label: format("score.details.breathing"),
			value: 0.5,
			unit: "rpm",
		},
		{
			label: format("score.details.hrv"),
			value: 0.3,
			unit: "ms",
		},
		{
			label: format("score.details.resting_heart_rate"),
			value: 0.8,
			unit: "bpm",
		},
		{
			label: format("score.details.temperature"),
			value: 0.5,
			unit: "°C",
		},
		{
			label: format("score.details.sleep_quality"),
			value: 0.22,
			unit: "%",
		},
		{
			label: format("score.details.sleep_balance"),
			value: 0.35,
			unit: "qualitative",
		},
		{
			label: format("score.details.activity_volume"),
			value: 0.8,
			unit: "qualitative",
		},
	] as const;

	if (!dailyData) {
		return null;
	}
	return (
		<Container>
			<ScrollView>
				<MargedSection title={format("activity.score.daily_metrics")} />
				{metricsData.map((data) => (
					<MargedMetrics key={data.label} {...data} />
				))}
				<MargedSection title={format("activity.score.details")} />
				{scoreDetailsData.map((data) => (
					<MargedGauge key={data.label} {...data} />
				))}
			</ScrollView>
		</Container>
	);
};

const Container = styled.View`
	flex: 1;
`;

// TODO Use Stack when merged
const MargedMetrics = styled(DailyMetric)`
	margin-bottom: 10px;
	margin-horizontal: 20px;
`;
const MargedGauge = styled(ScoreGauge)`
	margin-bottom: 10px;
	margin-horizontal: 20px;
`;
const MargedSection = styled(ScreenSection)`
	margin-vertical: 25px;
`;
