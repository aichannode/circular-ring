import styled, { css } from "styled-components/native";

export type FlexAlign = "flex-start" | "flex-end" | "center" | "stretch" | "baseline";
export type FlexJustify = "flex-start" | "flex-end" | "center" | "space-around" | "space-between" | "space-evenly";
interface LayoutProps {
	align?: FlexAlign;
	justify?: FlexJustify;
	reverse?: "reverse";
	wrap?: "wrap";
}

export const stack = (align: FlexAlign = "stretch", justify: FlexJustify = "flex-start", reverse?: "reverse") => css`
	flex-direction: ${reverse ? "column-reverse" : "column"};
	justify-content: ${justify};
	align-items: ${align};
`;

export const row = (
	align: FlexAlign = "stretch",
	justify: FlexJustify = "flex-start",
	reverse?: "reverse",
	wrap?: "wrap"
) => css`
	flex-direction: ${reverse ? "row-reverse" : "row"};
	justify-content: ${justify};
	align-items: ${align};
	flex-wrap: ${wrap ? "wrap" : "nowrap"};
`;

export const Stack = styled.View<LayoutProps>`
	${({ align, justify, reverse }) => stack(align, justify, reverse)};
`;

export const Row = styled.View<LayoutProps>`
	${({ align, justify, reverse, wrap }) => row(align, justify, reverse, wrap)};
`;

export const Grow = styled.View`
	flex: 1;
`;
