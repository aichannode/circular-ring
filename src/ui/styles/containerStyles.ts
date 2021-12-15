import { css } from "styled-components/native";

export const whiteCardStyle = css`
	padding: 24px 26px 32px;
	background-color: #ffffff;
	border-radius: 2px;
	shadow-color: #000000;
	shadow-offset: 0 10px;
	shadow-opacity: 0.1;
	shadow-radius: 18px;
	elevation: 10;
`;

export const roundedWhiteCardStyle = css`
	background-color: #ffffff;
	border-radius: 10px;
	shadow-color: #000000;
	shadow-offset: 0 10px;
	shadow-opacity: 0.1;
	shadow-radius: 18px;
	elevation: 10;
`;

export const shadow = (offset = "0 10px", radius = 13, opacity = 0.3) => css`
	shadow-color: #000000;
	shadow-offset: ${offset};
	shadow-radius: ${radius}px;
	shadow-opacity: ${opacity};
	elevation: 10;
`;
