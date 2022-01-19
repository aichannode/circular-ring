import React, { ReactElement } from "react";
import styled from "styled-components/native";

export const Mask = ({ children, masked, top }: { children: ReactElement; masked: boolean; top?: number }) => {
	return (
		<Container>
			{masked && <MaskView top={top}></MaskView>}
			{children}
			<StopUserClick top={top}></StopUserClick>
		</Container>
	);
};

const Container = styled.View``;

const MaskView = styled.View<{ top: number | undefined }>`
	/* border: 1px solid red; */
	z-index: 1;
	position: absolute;
	top: ${({ top }) => (top ? top : 0)};
	bottom: 0;
	right: 0;
	left: 0;
	background-color: rgba(0, 0, 0, 0.65);
`;

const StopUserClick = styled.View<{ top: number | undefined }>`
	/* border: 1px solid red; */
	z-index: 2;
	position: absolute;
	top: ${({ top }) => (top ? top : 0)};
	bottom: 0;
	right: 0;
	left: 0;
	background-color: transparent;
`;
