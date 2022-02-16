import React from "react";
import { Slider } from "@miblanchard/react-native-slider";
import styled from "styled-components/native";
import { colors } from "@ui/styles/colors";
import { useI18n } from "@ui/i18n";

interface SliderProps {
	title: string;
	start: number;
	stop: number;
	value: number | number[];
	defaultValue: number;
	setValue: (arg0: number | number[]) => void;
}

export const SliderBetweenTwoValues: React.FC<SliderProps> = ({
	title,
	start,
	stop,
	value,
	setValue,
	defaultValue,
}) => {
	const { format } = useI18n();
	return (
		<Container>
			<Title>{title}</Title>
			<FlexView>
				<PinBar>
					<PinRound />
					<MinMax>{start}</MinMax>
				</PinBar>
				<Slider
					step={1}
					containerStyle={{ flex: 1 }}
					minimumTrackTintColor={colors.redOrange}
					maximumTrackTintColor={colors.lightgray}
					maximumValue={stop}
					minimumValue={start}
					thumbStyle={{
						borderWidth: 1,
						borderColor: colors.lightgray,
						shadowColor: "#000",
						shadowOffset: {
							width: 0,
							height: 2,
						},
						shadowOpacity: 0.25,
						shadowRadius: 3.84,

						elevation: 5,
					}}
					thumbTintColor={colors.white}
					value={value}
					onValueChange={setValue}
				></Slider>
				<PinBar>
					<PinRound />
					<MinMax>{stop}</MinMax>
				</PinBar>
			</FlexView>
			<CurrentValue>{value}</CurrentValue>
			<ResetTouchable onPress={() => setValue(defaultValue)}>
				<Reset>{format("highHr.resetToDefault")}</Reset>
			</ResetTouchable>
		</Container>
	);
};

const MinMax = styled.Text`
	text-align: center;
	flex: 1;
	width: 100px;
	position: absolute;
	top: -25px;
	left: -50px;
`;

const FlexView = styled.View`
	width: 100%;
	flex: 1;
	display: flex;
	flex-direction: row;
`;

const PinBar = styled.View`
	height: 20px;
	width: 1px;
	border: 0.5px solid black;
	margin-top: 10px;
`;

const PinRound = styled.View`
	position: absolute;
	height: 4px;
	width: 4px;
	background-color: black;
	border-radius: 2px;
	top: -3px;
	left: -2px;
`;

const Container = styled.View`
	margin-horizontal: 10%;
	margin-vertical: 5%;
`;

const Title = styled.Text`
	width: 100%;
	text-align: center;
	margin-bottom: 30px;
	font-size: 14px;
`;

const ResetTouchable = styled.TouchableOpacity``;

const Reset = styled.Text`
	width: 100%;
	text-align: center;
	margin-bottom: 30px;
	font-size: 14px;
	color: ${colors.redOrange};
	font-weight: 500;
	margin-top: 40px;
`;

const CurrentValue = styled.Text`
	font-size: 23px;
	width: 100%;
	text-align: center;
`;
