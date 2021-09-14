import React, { ReactElement, useMemo } from "react";
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from "react-native";
import styled, { css } from "styled-components/native";
type ChildrenType = (ReactElement<ViewProps> | null | undefined | false)[];

export type FlexAlign = "flex-start" | "flex-end" | "center" | "stretch" | "baseline";
export type FlexJustify = "flex-start" | "flex-end" | "center" | "space-around" | "space-between" | "space-evenly";
interface LayoutProps {
	align?: FlexAlign;
	justify?: FlexJustify;
	reverse?: "reverse";
	wrap?: "wrap";
	style?: StyleProp<ViewStyle>;
	gap?: number;
	children: ChildrenType | JSX.Element;
}

export const stack = (align: FlexAlign = "stretch", justify: FlexJustify = "flex-start", reverse?: "reverse") => css`
	flex-direction: ${reverse ? "column-reverse" : "column"};
	justify-content: ${justify};
	align-items: ${align};
`;
export const StackContent = styled.View<Omit<LayoutProps, "gap" | "children">>`
	${({ align, justify, reverse }) => stack(align, justify, reverse)};
`;
export const Stack = React.forwardRef<View, LayoutProps>(({ gap, children, ...props }, ref) => {
	const childrenArray = useMemo(() => React.Children.toArray(children), [children]) as ChildrenType;
	return (
		<StackContent {...props} ref={ref}>
			{childrenArray.slice(0, -1).map((child) => {
				if (!child) {
					return null;
				}
				const absolute = StyleSheet.flatten(child.props.style)?.position === "absolute";
				const childStyle = absolute ? child.props.style : [{ marginBottom: gap }, child.props.style];
				return React.cloneElement(child, { style: childStyle });
			})}
			{childrenArray.slice(-1)}
		</StackContent>
	);
});

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
export const RowContent = styled.View<Omit<LayoutProps, "gap" | "children">>`
	${({ align, justify, reverse, wrap }) => row(align, justify, reverse, wrap)};
`;
export const Row = React.forwardRef<View, LayoutProps>(({ gap, children, ...props }, ref) => {
	const childrenArray = useMemo(() => React.Children.toArray(children), [children]) as ChildrenType;
	return (
		<RowContent {...props} ref={ref}>
			{childrenArray.slice(0, -1).map((child) => {
				if (!child) {
					return null;
				}
				const absolute = StyleSheet.flatten(child.props.style)?.position === "absolute";
				const childStyle = absolute ? child.props.style : [{ marginRight: gap }, child.props.style];
				return React.cloneElement(child, { style: childStyle });
			})}
			{childrenArray.slice(-1)}
		</RowContent>
	);
});

export const Grow = styled.View`
	flex: 1;
`;

export const responsiveCenter = (maxWidth = 250, horizontalPadding = 20, align: FlexAlign = "center") => css`
	width: 100%;
	max-width: ${maxWidth}px;
	padding-horizontal: ${horizontalPadding}px;
	align-items: ${align};
	align-self: center;
`;

export const ResponsiveCenterView = styled.View<{ maxWidth?: number; horizontalPadding?: number; align?: FlexAlign }>`
	${({ maxWidth, horizontalPadding, align }) => responsiveCenter(maxWidth, horizontalPadding, align)};
`;
