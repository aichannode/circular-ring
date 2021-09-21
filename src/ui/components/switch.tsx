import { colors } from "@ui/styles/colors";
import React from "react";
import LinearGradient from "react-native-linear-gradient";
import styled from "styled-components/native";

interface SwitchProps<T> {
	options: T[];
	currentOption: T;
	onSelectOption: (option: T) => void;
	containerBgColor: string;
}

export function Switch<T>({ options, currentOption, onSelectOption, containerBgColor }: SwitchProps<T>) {
	const leftSelected = currentOption === options[0];
	const rightSelected = currentOption === options[1];

	return (
		<Container start={{ x: 0, y: 1 }} end={{ x: 1, y: 0.5 }} colors={["#f44a59", "#f97444", "#f44a59"]}>
			<LeftOption onPress={() => onSelectOption(options[0])}>
				<UnselectedLeftBackground visible={!leftSelected} bgColor={containerBgColor}>
					<OptionText selected={leftSelected}>{options[0]}</OptionText>
				</UnselectedLeftBackground>
			</LeftOption>
			<RightOption onPress={() => onSelectOption(options[1])}>
				<UnselectedRightBackground visible={!rightSelected} bgColor={containerBgColor}>
					<OptionText selected={rightSelected}>{options[1]}</OptionText>
				</UnselectedRightBackground>
			</RightOption>
		</Container>
	);
}

const Container = styled(LinearGradient)`
	width: 88px;
	height: 26px;
	flex-direction: row;
	border-radius: 13px;
	align-items: stretch;
`;

const OptionBase = styled.Pressable``;

const LeftOption = styled(OptionBase)`
	flex: 1;
	padding: 1px;
`;

const UnselectedLeftBackground = styled.View<{ visible: boolean; bgColor: string }>`
	flex: 1;
	align-items: center;
	justify-content: center;
	border-bottom-left-radius: 12px;
	border-top-left-radius: 12px;
	background-color: ${({ visible, bgColor }) => (visible ? bgColor : "transparent")};
`;

const RightOption = styled(OptionBase)`
	flex: 1;
	padding: 1px;
`;

const UnselectedRightBackground = styled.View<{ visible: boolean; bgColor: string }>`
	flex: 1;
	align-items: center;
	justify-content: center;
	border-bottom-right-radius: 12px;
	border-top-right-radius: 12px;
	background-color: ${({ visible, bgColor }) => (visible ? bgColor : "transparent")};
`;

const OptionText = styled.Text<{ selected: boolean }>`
	font-size: 12px;
	color: ${({ selected }) => (selected ? colors.lightgray : colors.primary)};
	margin-bottom: 2px;
`;
