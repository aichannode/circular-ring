import { Grow } from "@ui/components/layout";
import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import React from "react";
import { Pressable, ViewStyle } from "react-native";
import styled from "styled-components/native";

interface InfoListItemProps {
	name: string;
	value?: string;
	emphasize?: boolean;
	action?: () => void;
	hasDisclosure?: boolean;
	style?: ViewStyle;
}

export const InfoListItem: React.FC<InfoListItemProps> = ({
	name,
	value,
	emphasize = false,
	action,
	hasDisclosure = false,
	style,
}) => {
	return (
		<Pressable onPress={() => action?.()}>
			<Container style={style}>
				<Name emphasize={emphasize}>{name}</Name>
				<Grow />
				{value && <Value>{value}</Value>}
				{hasDisclosure && <Disclosure source={require("@assets/images/disclosure.png")} />}
			</Container>
		</Pressable>
	);
};

const Container = styled.View`
	width: 100%;
	height: 50px;
	padding: 0 20px;
	flex-direction: row;
	align-items: center;
	margin-bottom: 1px;
	background-color: ${colors.lightgray};
`;

const Name = styled.Text<{ emphasize: boolean }>`
	${textStyles.primary};
	font-size: 14px;
	color: ${({ emphasize }) => (emphasize ? colors.red : colors.textPrimary)};
`;

const Value = styled.Text`
	font-size: 14px;
	font-weight: 500;
	color: ${colors.textPlaceholder};
`;

const Disclosure = styled.Image`
	margin-left: 13px;
`;
