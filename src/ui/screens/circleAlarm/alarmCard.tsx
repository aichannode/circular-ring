import { Divider } from "@ui/components/divider";
import { SecondaryText, TitleText } from "@ui/components/text";
import { colors } from "@ui/styles/colors";
import { whiteCardStyle } from "@ui/styles/containerStyles";
import { textStyles } from "@ui/styles/textStyles";
import React, { useState } from "react";
import { Platform, StyleProp, Switch, Text, ViewStyle } from "react-native";
import styled from "styled-components/native";

interface AlarmCardProps {
	style?: StyleProp<ViewStyle>;
}

export const AlarmCard: React.FC<AlarmCardProps> = ({ style }) => {
	const [isEnabled, setIsEnabled] = useState(false);

	return (
		<Card style={style}>
			<ColorTag />
			<HourContainer>
				<Hour>{"07 : 00"}</Hour>
			</HourContainer>
			<VerticalSeparator />
			<LabelContainer>
				<TitleText>{"Alarm"}</TitleText>
				<SecondaryText>{"Weekdays"}</SecondaryText>
			</LabelContainer>
			<SwitchContainer>
				<SwitchButton
					style={{ transform: Platform.OS === "android" ? [{ scale: 1.5 }] : undefined }}
					ios_backgroundColor={colors.gray}
					trackColor={{ false: colors.gray, true: colors.blue }}
					thumbColor={colors.white}
					onValueChange={() => setIsEnabled((prev) => !prev)}
					value={isEnabled}
				/>
			</SwitchContainer>
		</Card>
	);
};

const Card = styled.View`
	${whiteCardStyle};
	flex-direction: row;
	border-radius: 5px;
	margin-bottom: 15px;
`;

const HourContainer = styled.View`
	flex-grow: 1;
	justify-content: center;
	align-items: center;
`;

const LabelContainer = styled.View`
	flex-grow: 1;
	justify-content: center;
`;

const Hour = styled(Text)`
	${textStyles.bigTitle};
`;

const ColorTag = styled(Divider)`
	border-radius: 5px;
	margin-right: 15px;
	background-color: ${colors.green};
	height: 67px;
	width: 5px;
`;

const VerticalSeparator = styled(Divider)`
	margin-horizontal: 15px;
	background-color: ${colors.gray};
	height: 67px;
	width: 1px;
`;

const SwitchContainer = styled.View`
	flex-grow: 1;
	justify-content: center;
	align-items: center;
`;

const SwitchButton = styled(Switch)`
	margin-right: 10px;
	border-color: ${colors.blue};
`;
