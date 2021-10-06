import Slider, { SliderProps } from "@react-native-community/slider";
import React from "react";
import styled from "styled-components/native";
import { Row, Stack } from "./layout";
import { PrimaryText, SecondaryText } from "./text";

interface LabeledSliderProps extends Omit<SliderProps, "ref"> {
	label: string;
	value: number;
	minimumValue: number;
	maximumValue: number;
}
export const LabeledSlider: React.FC<LabeledSliderProps> = ({ label, ...props }) => {
	return (
		<Container gap={10}>
			<SecondaryText style={{ alignSelf: "center" }}>{label}</SecondaryText>
			<Row justify="space-between">
				<SecondaryText>{props.minimumValue}</SecondaryText>
				<SecondaryText>{props.maximumValue}</SecondaryText>
			</Row>
			<Slider {...props} />
			<PrimaryText style={{ alignSelf: "center" }}>{props.value}</PrimaryText>
		</Container>
	);
};

const Container = styled(Stack)``;
