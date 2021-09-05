import { NavigationProp } from "@react-navigation/native";
import React from "react";
import styled from "styled-components/native";

interface HomeScreenProps {
	navigation: NavigationProp<{ [k: string]: unknown }>;
}
export const HomeScreen: React.FC<HomeScreenProps> = ({}) => {
	return <Container />;
};

const Container = styled.View``;
