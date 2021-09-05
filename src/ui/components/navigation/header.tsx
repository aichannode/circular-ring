import React from "react";
import { Text } from "react-native";
import styled from "styled-components/native";

export const Header: React.FC = ({}) => {
	return (
		<Container>
			<Text>Salut salut</Text>
		</Container>
	);
};

const Container = styled.View``;
