import { colors } from "@ui/styles/colors";
import React from "react";
import styled from "styled-components/native";
import LinearGradient from "react-native-linear-gradient";
import { useI18n } from "@ui/i18n";
import { WordingKey } from "src/wordings";

export const Explanation = ({
	top,
	step,
	revert,
	image,
}: {
	top: number;
	step: number;
	revert: boolean;
	image?: number;
}) => {
	const { format } = useI18n();

	const title: WordingKey[] = [
		"tutorial.step1.title",
		"tutorial.step2.title",
		"tutorial.step3.title",
		"tutorial.step4.title",
	];
	const explanation: WordingKey[] = [
		"tutorial.step1.explanation",
		"tutorial.step2.explanation",
		"tutorial.step3.explanation",
		"tutorial.step4.explanation",
	];

	return (
		<Container
			style={{ top }}
			colors={["rgb(244, 74, 89)", "rgb(252, 85, 26)"]}
			start={{ x: 1, y: 0 }}
			end={{ x: 1, y: 1 }}
		>
			{!revert ? <TopTriangle></TopTriangle> : <BottomTriangle></BottomTriangle>}
			{step === 3 && <Logo source={require("@assets/images/logoWhite.png")}></Logo>}
			<Title>{format(title[step])}</Title>
			<Description>{format(explanation[step])}</Description>
		</Container>
	);
};

const Logo = styled.Image`
	align-self: center;
	margin-bottom: 10px;
`;

const Container = styled(LinearGradient)`
	position: absolute;
	z-index: 1000;
	background-color: ${colors.orange};
	width: 80%;
	margin-left: 10%;
	padding: 6%;
	border-radius: 10px;
`;

const Title = styled.Text`
	color: ${colors.white};
	text-align: center;
	font-size: 20px;
	margin-bottom: 15px;
`;

const Description = styled.Text`
	color: ${colors.white};
	text-align: center;
	font-size: 14px;
`;

const TopTriangle = styled.View`
	width: 0;
	height: 0;
	background-color: transparent;
	border-top-width: 0;
	border-right-width: 10;
	border-bottom-width: 14;
	border-left-width: 10;
	border-top-color: transparent;
	border-right-color: transparent;
	border-bottom-color: rgb(244, 74, 89);
	border-left-color: transparent;
	position: absolute;
	top: -14px;
	right: 52%;
`;

const BottomTriangle = styled.View`
	width: 0;
	height: 0;
	background-color: transparent;
	border-right-width: 10;
	border-left-width: 10;
	border-top-width: 14;
	border-bottom-width: 14;
	border-top-color: rgb(252, 85, 26);
	border-right-color: transparent;
	border-bottom-color: transparent;
	border-left-color: transparent;
	position: absolute;
	bottom: -28px;
	right: 52%;
`;
