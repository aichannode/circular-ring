import { DailyPhase, DailyPhaseInfo } from "@domain/measure/metric";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import dayjs from "dayjs";
import React from "react";
import { View } from "react-native";
import Svg, { Rect } from "react-native-svg";
import { WordingKey } from "src/wordings";
import styled, { css } from "styled-components/native";
import { VictoryPie } from "victory-native";

interface DailyPhasesPieProps {
	phases: DailyPhaseInfo[];
}
export const DailyPhasesPie: React.FC<DailyPhasesPieProps> = ({ phases }) => {
	const phaseColors = phases.map((p) =>
		p.phase === DailyPhase.NAP || p.phase === DailyPhase.SLEEP ? colors.darkBlue : colors.lightBlue
	);
	const data = phases.map(({ start, end }) => ({
		y: dayjs(end).diff(start),
	}));
	const { format } = useI18n();

	return (
		<View style={{ backgroundColor: colors.lightgray, alignItems: "center", padding: 50 }}>
			<View>
				<VictoryPie
					colorScale={phaseColors}
					data={data}
					startAngle={angle(phases[0].start)}
					endAngle={360 + angle(new Date())}
					width={200}
					height={200}
					padding={0}
					labels={[]}
					innerRadius={90}
				/>
				{phases.map((phaseInfo, i, allPhases) => {
					const labels = renderedLabels(phaseInfo.phase, i, allPhases[i - 1]?.phase);
					return labels.map((label, index) =>
						label ? (
							<React.Fragment key={`${i}-${index}`}>
								<LabelPolarView
									polarOrigin={{
										x: 100,
										y: 100,
									}}
									width={100}
									height={20}
									r={135}
									angleDeg={angle(index > 0 ? phaseInfo.end : phaseInfo.start) - 90}
								>
									<View>
										<Label style={{ fontWeight: "500" }}>{format(label)}</Label>
										<Label>{dayjs(index > 0 ? phaseInfo.end : phaseInfo.start).format("HH:mm")}</Label>
									</View>
								</LabelPolarView>
								<PolarSvg
									width={20}
									height={3}
									polarOrigin={{
										x: 100,
										y: 100,
									}}
									r={100}
									angleDeg={angle(index > 0 ? phaseInfo.end : phaseInfo.start) - 90}
									rotate
								>
									<Rect width={20} height={3} fill={colors.textPrimary} rx={2} ry={2} />
								</PolarSvg>
							</React.Fragment>
						) : null
					);
				})}
			</View>
		</View>
	);
};

function renderedLabels(
	phase: DailyPhase,
	index: number,
	previousPhase?: DailyPhase
): [WordingKey | null, WordingKey | null] {
	// Check with server
	if (phase === DailyPhase.LYING && index === 0) {
		return ["sleep.duration.label.start_lying", null];
	}
	if (phase === DailyPhase.SLEEP && previousPhase === DailyPhase.LYING) {
		return ["sleep.duration.label.start_sleep", null];
	}
	if (phase === DailyPhase.AWAKE && previousPhase === DailyPhase.SLEEP) {
		return ["sleep.duration.label.wake_up", null];
	}
	if (phase === DailyPhase.NAP) {
		return ["sleep.duration.label.nap_start", "sleep.duration.label.nap_end"];
	}
	return [null, null];
	// if (phaseInfo.phase === )
}

// function angle(t: number) {
// 	return (t / 24) * 360;
// }
function angle(t: Date) {
	return ((t.getHours() + t.getMinutes() / 60) / 24) * 360;
	// return (t / 24) * 360;
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
