import React from "react";
import { ImageSourcePropType } from "react-native";
import styled from "styled-components/native";

interface LogoImageHeaderProps {
	source: ImageSourcePropType;
}

export const LogoImageHeader = (props: LogoImageHeaderProps) => {
	const { source } = props;

	return (
		<Container>
			<BackgroundImage source={source}></BackgroundImage>
			<Overlay>
				<CircularLogo source={require("@assets/images/circularWhiteNoBeMore.png")} />
			</Overlay>
		</Container>
	);
};

const Container = styled.View``;

const BackgroundImage = styled.Image`
	width: 100%;
	resize-mode: cover;
`;

const Overlay = styled.View`
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: #00000078;
	align-items: center;
	justify-content: center;
`;

const CircularLogo = styled.Image`
	width: 80%;
	resize-mode: center;
`;
