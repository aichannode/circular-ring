import { Switch } from "@ui/components/switch";
import { colors } from "@ui/styles/colors";
import React from "react";
import { View } from "react-native";
import styled from "styled-components/native";

interface Props<T> {
	message: string;
	switchOptions: T[];
	switchValue: T;
	onSwitchSelect: (option: T) => void;
}

const LeaderboardPopUpContainer = <T,>(props: Props<T>) => (
	<View style={{ overflow: "hidden", paddingBottom: 5 }}>
		<BannerContainer>
			<StyledText>{props.message}</StyledText>
			<Switch
				options={props.switchOptions}
				containerBgColor={colors.lightgray}
				currentOption={props.switchValue}
				onSelectOption={props.onSwitchSelect}
			/>
		</BannerContainer>
	</View>
);
export default LeaderboardPopUpContainer;

const BannerContainer = styled.View`
    padding-horizontal: 20px;
	height: 60px;
	justify-content: center;
	align-items: center;
	background-color: white;
	width: 100%;
	shadow-color: #000;
    shadow-offset: {width: 1, height: 3};
    shadow-opacity: 0.4;
    shadow-radius: 5px;
    elevation: 5px;
	flex-direction: row;
`;

const StyledText = styled.Text`
	color: #657884;
	font-size: 14px;
	width: 75%;
	padding-right: 10px;
`;
