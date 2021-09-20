import { colors } from "@ui/styles/colors";
import React from "react";
import styled from "styled-components/native";

interface ToggleProps {
	options: string[];
	currentOption: string;
	onSelectOption: (option: string, index: number) => void;
}

export const Toggle: React.FC<ToggleProps> = ({ options, currentOption, onSelectOption }) => {
	const leftSelected = currentOption === options[0];
	const rightSelected = currentOption === options[1];

	return (
		<Container>
			<LeftOption selected={leftSelected} onPress={() => onSelectOption(options[0], 0)}>
				<OptionText selected={leftSelected}>{options[0]}</OptionText>
			</LeftOption>
			<RightOption selected={rightSelected} onPress={() => onSelectOption(options[1], 1)}>
				<OptionText selected={rightSelected}>{options[1]}</OptionText>
			</RightOption>
		</Container>
	);
};

const Container = styled.View`
	flex-direction: row;
`;

const OptionBase = styled.Pressable`
	flex: 1;
	align-items: center;
	justify-content: center;
	height: 26px;
	border-width: 1px;
`;

const LeftOption = styled(OptionBase)<{ selected: boolean }>`
	border-bottom-left-radius: 13px;
	border-top-left-radius: 13px;
`;

const RightOption = styled(OptionBase)<{ selected: boolean }>`
	border-bottom-right-radius: 13px;
	border-top-right-radius: 13px;
`;

const OptionText = styled.Text<{ selected: boolean }>`
	font-size: 12px;
	color: ${({ selected }) => (selected ? colors.lightgray : colors.primary)};
`;
