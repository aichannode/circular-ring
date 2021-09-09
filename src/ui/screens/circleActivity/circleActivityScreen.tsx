import { useI18n } from "@ui/i18n";
import React, { useState } from "react";
import { ScrollView } from "react-native";
import styled from "styled-components/native";
import { DailyMetric } from "./dailyMetric";
import { GaugeDescription } from "./gaugeDescription";
import { useDailyData } from "./hooks";
import { ScoreGauge } from "./scoreGauge";
import { ScreenSection } from "./screenSection";

export const CircleActivityScreen: React.FC = () => {
	const dailyData = useDailyData();
	const { format } = useI18n();
	const [focusedGauge, setFocusedGauge] = useState<number | null>(null);

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
	] as const;

	const scoreDetailsData = [
		{
			label: format("score.details.recovery.label"),
			description: format("score.details.recovery.description"),
			value: 0,
			rate: 0.5,
			unit: "qualitative",
		},
		{
			label: format("score.details.wake_up.label"),
			description: format("score.details.wake_up.description"),
			value: 96,
			rate: 0.96,
			unit: "%",
		},
		{
			label: format("score.details.breathing.label"),
			description: format("score.details.breathing.description"),
			value: 14.3,
			rate: 0.55,
			unit: "rpm",
		},
		{
			label: format("score.details.hrv.label"),
			description: format("score.details.hrv.description"),
			value: 68,
			rate: 0.7,
			unit: "ms",
		},
		{
			label: format("score.details.resting_heart_rate.label"),
			description: format("score.details.resting_heart_rate.description"),
			value: 62,
			rate: 0.3,
			unit: "bpm",
		},
		{
			label: format("score.details.temperature.label"),
			description: format("score.details.temperature.description"),
			value: 0.5,
			rate: 0.81,
			unit: "°C",
		},
		{
			label: format("score.details.sleep_quality.label"),
			description: format("score.details.sleep_quality.description"),
			value: 0.83,
			rate: 0.83,
			unit: "%",
		},
		{
			label: format("score.details.sleep_balance.label"),
			description: format("score.details.sleep_balance.description"),
			value: 0,
			rate: 0.9,
			unit: "qualitative",
		},
		{
			label: format("score.details.activity_volume.label"),
			description: format("score.details.activity_volume.description"),
			value: 0,
			rate: 0.8,
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
				{scoreDetailsData.map(({ description, label, ...data }, index) => (
					<React.Fragment key={label}>
						<MargedGauge {...data} label={label} onPress={() => setFocusedGauge(index)} />
						{focusedGauge === index && (
							<MargedGaugeDescription label={label} description={description} onClose={() => setFocusedGauge(null)} />
						)}
					</React.Fragment>
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
const MargedGaugeDescription = styled(GaugeDescription)`
	margin-bottom: 10px;
	margin-horizontal: 20px;
`;
