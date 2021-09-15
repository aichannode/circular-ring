import { Grow } from "@ui/components/layout";
import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import React from "react";
import { Pressable } from "react-native";
import styled from "styled-components/native";

interface InfoListItemProps {
	name: string;
	value?: string;
	emphasize?: boolean;
	action?: () => void;
	hasDisclosure?: boolean;
}

export const InfoListItem = (props: InfoListItemProps) => {
	const { name, value = undefined, emphasize = false, action = undefined, hasDisclosure = false } = props;
	return (
		<Pressable onPress={() => action?.()}>
			<Container>
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
