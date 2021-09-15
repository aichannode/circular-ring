import { colors } from "@ui/styles/colors";
import React from "react";
import { Platform, ScrollViewProps } from "react-native";
import styled from "styled-components/native";

export const ScrollScreen: React.FunctionComponent<ScrollViewProps> = (props) => {
	return (
		<ScrollView
			alwaysBounceVertical={false}
			keyboardShouldPersistTaps={"handled"}
			contentContainerStyle={[contentContainerStyle, props.contentContainerStyle]}
		>
			<Content {...props} behavior={Platform.OS === "ios" ? "padding" : undefined}></Content>
		</ScrollView>
	);
};

const ScrollView = styled.ScrollView`
	flex: 1;
`;

const Content = styled.KeyboardAvoidingView`
	flex: 1;
	justify-content: center;
`;

const contentContainerStyle = {
	flexGrow: 1,
	paddingVertical: 50,
	backgroundColor: colors.white,
} as const;
