import styled from "styled-components/native";

interface LayoutProps {
	align?: "center" | "stretch" | "flext-start" | "flex-end";
	justify?: "center" | "stretch" | "flext-start" | "flex-end";
}
export const Stack = styled.View<LayoutProps>`
	align-items: ${({ align = "stretch" }) => align};
	justify-content: ${({ justify = "flex-start" }) => justify};
`;

export const Row = styled(Stack)`
	flex-direction: row;
`;

export const Grow = styled.View`
	flex: 1;
`;
