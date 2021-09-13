import React from "react";
import { ScrollViewProps } from "react-native";
import styled from "styled-components/native";

export const ScrollScreen: React.FunctionComponent<ScrollViewProps> = (props) => {
	return (
		<ScrollView
			alwaysBounceVertical={false}
			keyboardShouldPersistTaps={"handled"}
			contentContainerStyle={[contentContainerStyle, props.contentContainerStyle]}
		>
			<Content {...props}></Content>
		</ScrollView>
	);
};

const ScrollView = styled.ScrollView`
	flex: 1;
`;

const Content = styled.View`
	flex: 1;
	justify-content: center;
`;

const contentContainerStyle = {
	flexGrow: 1,
	paddingLeft: 66,
	paddingRight: 66,
};
