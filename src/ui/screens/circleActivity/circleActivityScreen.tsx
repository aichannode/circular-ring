import { useI18n } from "@ui/i18n";
import React from "react";
import styled from "styled-components/native";
import { useDailyData } from "./hooks";
import { ScoreGauge } from "./scoreGauge";
import { ScreenSection } from "./screenSection";

export const CircleActivityScreen: React.FC = () => {
	const dailyData = useDailyData();
	const { format } = useI18n();

	if (!dailyData) {
		return null;
	}
	return (
		<Container>
			<ScreenSection title={format("activity.score.details")} />
			<MargedGauge label={format("score.details.recovery")} value={0.45} unit="qualitative" />
			<MargedGauge label={format("score.details.wake_up")} value={0.82} unit="%" />
			<MargedGauge label={format("score.details.breathing")} value={0.98} unit="rpm" />
		</Container>
	);
};

const Container = styled.View`
	flex: 1;
`;

// TODO Use Stack when merged
const MargedGauge = styled(ScoreGauge)`
	margin-bottom: 10px;
	margin-horizontal: 20px;
`;
