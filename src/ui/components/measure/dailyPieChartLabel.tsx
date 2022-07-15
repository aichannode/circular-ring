import { useIs24h } from "@domain/user/hooks/useUser";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import moment, { Moment } from "moment";
import React from "react";
import { View } from "react-native";
import Svg, { Rect } from "react-native-svg";
import { WordingKey } from "src/wordings";
import styled, { css } from "styled-components/native";

type Props = {
	linedUpText?: boolean;
	labels: Array<{
		date: string | number;
		text?: WordingKey;
	}>;
	/** Chart diameter */
	chartSize: number;
};

const RIGHT_ANGLE = 90;

export const DailyPieChartLabel: React.FC<Props> = ({ chartSize, labels, linedUpText }) => {
	// Used for the transform origin of the labels
	const polarOrigin = {
		x: chartSize / 2,
		y: chartSize / 2,
	};

	const { format, formatHour } = useI18n();
	const is24h = useIs24h();
	const getAngleDeg = (text: string, date: number | string) => {
		let angleDeg = angle(moment(date)) - RIGHT_ANGLE;
		if (text == "activity.duration.label.sport_end") {
			angleDeg += 5;
		} else {
			angleDeg -= 10;
		}
		return angleDeg;
	};
	return (
		<>
			{labels.map(({ text, date }, index, array) => {
				const currentAngle = angle(moment(date));
				const nextAngle = (index + 1 < array.length && angle(moment(array[index + 1].date))) || 0;
				return (
					!!text && (
						<React.Fragment key={`${date}`}>
							<LabelPolarView
								polarOrigin={polarOrigin}
								width={110}
								height={20}
								r={150}
								angleDeg={
									getDifference(currentAngle, nextAngle) < 6 ? getAngleDeg(text, date) - 6 : getAngleDeg(text, date)
								}
							>
								<View>
									{linedUpText ? (
										<Label>
											<Label style={{ fontWeight: "500" }}>{text && format(text)}</Label>{" "}
											{formatHour(new Date(date), is24h)}
										</Label>
									) : (
										<>
											<Label style={{ fontWeight: "500" }}>{text && format(text)}</Label>
											<Label>{formatHour(new Date(date), is24h)}</Label>
										</>
									)}
								</View>
							</LabelPolarView>
							<PolarSvg
								width={20}
								height={3}
								polarOrigin={polarOrigin}
								r={100}
								angleDeg={angle(moment(date)) - RIGHT_ANGLE}
								rotate
							>
								<Rect width={20} height={3} fill={colors.textPrimary} rx={2} ry={2} />
							</PolarSvg>
						</React.Fragment>
					)
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

function getDifference(a: number, b: number) {
	return Math.abs(a - b);
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
