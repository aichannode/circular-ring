import { isDefined } from "@domain/common/business";
import { ActivityControlState, ScoreQuality } from "@domain/measure/representation/api";
import { createActiveMode, isInActiveMode, isInCalibrationMode, updateMode } from "@ui/business";
import { Grow } from "@ui/components/layout";
import { SecondaryText } from "@ui/components/text";
import { colors, ScoreQualityColors } from "@ui/styles/colors";
import { roundedWhiteCardStyle } from "@ui/styles/containerStyles";
import { Mode } from "@ui/type";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import styled from "styled-components/native";

interface DailyMetricProps {
	icon: number;
	label: string;
	value?: string;
	score?: number;
	/** Optional control state, some metrics does not use a control state (Vo2Max, MaxHR) */
	controlState?: ActivityControlState;
	style?: StyleProp<ViewStyle>;
	mode?: Mode;
}

export const DailyMetric: React.FC<DailyMetricProps> = ({
	icon,
	label,
	value,
	controlState,
	style,
	mode = createActiveMode(),
}) => {
	const updatedMode = updateMode(mode, !isDefined(value));

	return (
		<Container style={style}>
			<MetricIcon source={icon} />
			<SecondaryText>{label}</SecondaryText>
			<Grow />
			{(isInActiveMode(updatedMode) || isInCalibrationMode(updatedMode)) && controlState && (
				<QualityIndicator quality={controlState} />
			)}
			<Metric>{isInActiveMode(updatedMode) || isInCalibrationMode(updatedMode) ? value : "-"}</Metric>
		</Container>
	);
};

const Container = styled.View`
	${roundedWhiteCardStyle};
	flex-direction: row;
	align-items: center;
	padding: 20px 25px;
`;

const MetricIcon = styled.Image`
	margin-right: 20px;
`;

const QualityIndicator = styled.View<{ quality: ScoreQuality | ActivityControlState }>`
	width: 10px;
	height: 10px;
	border-radius: 5px;
	background-color: ${({ quality }) => ScoreQualityColors[quality]};
	margin-right: 6px;
`;

const Metric = styled.Text`
	color: ${colors.textPrimary};
	font-size: 25px;
	font-weight: bold;
`;
