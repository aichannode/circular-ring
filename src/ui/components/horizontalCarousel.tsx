import { HorizontalPicker, HorizontalPickerProps } from "@ui/components/horizontalPicker";
import { colors } from "@ui/styles/colors";
import React, { useCallback } from "react";
import LinearGradient from "react-native-linear-gradient";
import styled from "styled-components/native";

interface HorizontalCarouselProps<T> extends HorizontalPickerProps<T> {
	onValueChange?: (value: T) => void;
	defaultValue?: T;
}

export function HorizontalCarousel<T>({
	defaultValue,
	onValueChange,
	data,
	renderItem,
	itemWidth,
	...props
}: HorizontalCarouselProps<T>) {
	let baseIndex = props.defaultIndex ?? 0;
	if (defaultValue) {
		baseIndex = data.indexOf(defaultValue);
	}

	const onSelectionChange = useCallback(
		(position) => {
			props.onChange?.(position);
			onValueChange?.(data[position]);
		},
		[props.onChange, onValueChange]
	);

	return (
		<Container>
			<HorizontalPicker
				data={data}
				renderItem={renderItem}
				itemWidth={itemWidth}
				defaultIndex={baseIndex}
				onChange={onSelectionChange}
			/>
			<UnderlineValue />
			<LeftFader
				colors={[colors.white, "#ffffff40"]}
				start={{ x: 0, y: 0.5 }}
				end={{ x: 1, y: 0.5 }}
				locations={[0, 1]}
				pointerEvents={"none"}
			/>
			<RightFader
				colors={["#ffffff40", colors.white]}
				start={{ x: 0, y: 0.5 }}
				end={{ x: 1, y: 0.5 }}
				locations={[0, 1]}
				pointerEvents={"none"}
			/>
		</Container>
	);
}

const Container = styled.View``;

const UnderlineValue = styled.View`
	width: 40px;
	height: 1px;
	margin-top: 4px;
	align-self: center;
	background-color: ${colors.textPrimary};
`;

const LeftFader = styled(LinearGradient)`
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	width: 40%;
`;

const RightFader = styled(LinearGradient)`
	position: absolute;
	top: 0;
	bottom: 0;
	right: 0;
	width: 40%;
`;
