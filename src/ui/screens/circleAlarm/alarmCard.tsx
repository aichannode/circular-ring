import { useServices } from "@core/services";
import { RingAlarm } from "@domain/ring/ringAlarm";
import { Divider } from "@ui/components/divider";
import { Grow } from "@ui/components/layout";
import { TitleText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { whiteCardStyle } from "@ui/styles/containerStyles";
import { alarmTagColors } from "@ui/utils/alarmTagColorsUtils";
import React, { useState } from "react";
import { Platform, StyleProp, Switch, ViewStyle } from "react-native";
import styled from "styled-components/native";

interface AlarmCardProps {
	data: RingAlarm;
	style?: StyleProp<ViewStyle>;
}

export const AlarmCard: React.FC<AlarmCardProps> = ({ data, style }) => {
	const { circleAlarmService } = useServices();
	const { formatDay } = useI18n();
	const { id, isActivated } = data;
	const [isEnabled, setIsEnabled] = useState(isActivated);

	const updateAlarm = async (prevState: boolean) => {
		setIsEnabled((prev) => !prev);
		await circleAlarmService.updateAlarm({ ...data, isActivated: !prevState, isExisting: true });
	};

	return (
		<Card style={style}>
			<ColorTag
				style={{
					backgroundColor: alarmTagColors[id],
				}}
			/>
			<HourContainer>
				<Time style={style}>
					{`${data.time.hour.toString().padStart(2, "0")} : ${data.time.minute.toString().padStart(2, "0")}`}
				</Time>
			</HourContainer>
			<VerticalSeparator />
			<LabelContainer>
				<TitleText>{data.label.length > 10 ? data.label.substring(0, 10) + "..." : data.label}</TitleText>
				<DayTips>{formatDay(data.weekdays)}</DayTips>
			</LabelContainer>
			<Grow />
			<SwitchButton
				style={{ transform: Platform.OS === "android" ? [{ scale: 1.5 }] : undefined }}
				ios_backgroundColor={colors.gray}
				trackColor={{ false: colors.gray, true: colors.blue }}
				thumbColor={colors.white}
				onValueChange={() => updateAlarm(isEnabled)}
				value={isEnabled}
			/>
		</Card>
	);
};

const Card = styled.View`
	${whiteCardStyle};
	padding: 0;
	flex-direction: row;
	border-radius: 5px;
	margin-bottom: 15px;
	align-items: center;
`;

const HourContainer = styled.View`
	margin-horizontal: 15px;
	justify-content: center;
	align-items: center;
`;

const Time = styled.Text`
	font-size: 18px;
	font-weight: 700;
	color: ${colors.textPrimary};
`;

const LabelContainer = styled.View`
	flex-grow: 1;
	justify-content: center;
`;

const ColorTag = styled(Divider)`
	border-radius: 5px;
	margin-right: 15px;
	height: 67px;
	width: 5px;
`;

const VerticalSeparator = styled(Divider)`
	margin-horizontal: 15px;
	background-color: ${colors.gray};
	height: 67px;
	width: 1px;
`;

const SwitchButton = styled(Switch)`
	margin-right: 10px;
	border-color: ${colors.blue};
`;

const DayTips = styled.Text`
	font-size: 14px;
	color: ${colors.textPrimary};
`;
