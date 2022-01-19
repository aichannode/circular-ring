import React from "react";
import styled from "styled-components/native";
import { colors } from "@ui/styles/colors";

export const FourDot = ({ step }: { step: number }) => {
	const dots = [];

	for (let i = 0; i < 4; i++) {
		if (i < step + 1) dots.push(<DotFilled key={i}></DotFilled>);
		else dots.push(<Dot key={i}></Dot>);
	}

	return <DotContainer>{dots}</DotContainer>;
};

const DotContainer = styled.View`
	height: 53px;
	margin: 20px;
	display: flex;
	flex-direction: row;
`;

const Dot = styled.View`
	height: 10px;
	width: 10px;
	border-radius: 5px;
	background-color: ${colors.gray};
	margin: 21px 2.5px;
`;

const DotFilled = styled.View`
	height: 10px;
	width: 10px;
	border-radius: 5px;
	background-color: ${colors.primary};
	margin: 21px 2.5px;
`;
