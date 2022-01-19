import moment, { Moment } from "moment";
import React from "react";
import { StageInfos } from "@domain/measure/representation/lib/type";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { View } from "react-native";
import Svg, { Rect } from "react-native-svg";
import { WordingKey } from "src/wordings";
import styled, { css } from "styled-components/native";

type Props = {
	stages: Array<StageInfos<any>>;
	/** Chart diameter */
	chartSize: number;
	/** Logic to get the labels according the current phase */
	getLabels(phase: number, index: number, previousPhase?: number): [WordingKey | null | "", WordingKey | null];
};

const RIGHT_ANGLE = 90;

export const DailyPieChartLabelMappedToPhases: React.FC<Props> = ({ stages, chartSize, getLabels }) => {
	// Used for the transform origin of the labels
	const polarOrigin = {
		x: chartSize / 2,
		y: chartSize / 2,
	};

	const { format } = useI18n();

	return (
		<>
			{stages.map((phaseInfo, i, allPhases) => {
				const currentPhaseType = phaseInfo.stage;
				const previousPhaseType = allPhases[i - 1]?.stage;
				return getLabels(currentPhaseType, i, previousPhaseType).map((label, index) =>
					label !== null ? (
						<React.Fragment key={`${i}-${index}`}>
							<LabelPolarView
								polarOrigin={polarOrigin}
								width={100}
								height={20}
								r={135}
								angleDeg={angle(moment(index > 0 ? phaseInfo.end : phaseInfo.start)) - RIGHT_ANGLE}
							>
								<View>
									<Label style={{ fontWeight: "500" }}>{label && format(label)}</Label>
									<Label>{moment(index > 0 ? phaseInfo.end : phaseInfo.start).format("HH:mm")}</Label>
								</View>
							</LabelPolarView>
							<PolarSvg
								width={20}
								height={3}
								polarOrigin={polarOrigin}
								r={100}
								angleDeg={angle(moment(index > 0 ? phaseInfo.end : phaseInfo.start)) - RIGHT_ANGLE}
								rotate
							>
								<Rect width={20} height={3} fill={colors.textPrimary} rx={2} ry={2} />
							</PolarSvg>
						</React.Fragment>
					) : null
				);
			})}
		</>
	);
};

function angle(t: Moment) {
	return ((t.hours() + t.minutes() / 60) / 24) * 360;
}

function toRad(angle: number) {
	return (angle / 360) * 2 * Math.PI;
}

interface PolarProps {
	width: number;
	height: number;
	r: number;
	angleDeg: number;
	polarOrigin: { x: number; y: number };
	rotate?: boolean;
}
const polarStylePosition = css<PolarProps>`
	position: absolute;
	${({ width, height, r, angleDeg, polarOrigin, rotate }) => css`
		width: ${width}px;
		height: ${height}px;
		left: ${polarOrigin.x - width / 2 + r * Math.cos(toRad(angleDeg))}px;
		top: ${polarOrigin.y - height / 2 + r * Math.sin(toRad(angleDeg))}px;
		${rotate && `transform: rotate(${angleDeg}deg)`};
	`}
`;

const LabelPolarView = styled.View<PolarProps>`
	${polarStylePosition}
	align-items: center;
	justify-content: center;
`;

const Label = styled.Text`
	font-size: 10px;
	color: ${colors.textPrimary};
`;

const PolarSvg = styled(Svg)<PolarProps>`
	${polarStylePosition};
`;
