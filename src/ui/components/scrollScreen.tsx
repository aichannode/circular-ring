import React from "react";
import { ScrollViewProps } from "react-native";
import styled from "styled-components/native";

export const ScrollScreen: React.FunctionComponent<ScrollViewProps> = (props) => {
	return (
		<ScrollView
			alwaysBounceVertical={false}
			keyboardShouldPersistTaps={"handled"}
			{...props}
			contentContainerStyle={[contentContainerStyle, props.contentContainerStyle]}
		/>
	);
};

const ScrollView = styled.ScrollView`
	flex: 1;
`;

const contentContainerStyle = {
	flexGrow: 1,
	alignItems: "center",
	justifyContent: "center",
	paddingLeft: 66,
	paddingRight: 66,
};
