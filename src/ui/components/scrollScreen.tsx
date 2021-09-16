import { colors } from "@ui/styles/colors";
import React from "react";
import { Platform, ScrollViewProps } from "react-native";
import styled from "styled-components/native";

export const ScrollScreen: React.FunctionComponent<ScrollViewProps> = (props) => {
	return (
		<StyledKeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
			<ScrollView
				alwaysBounceVertical={false}
				keyboardShouldPersistTaps={"handled"}
				contentContainerStyle={[contentContainerStyle, props.contentContainerStyle]}
			>
				<Content {...props} />
			</ScrollView>
		</StyledKeyboardAvoidingView>
	);
};

const ScrollView = styled.ScrollView`
	flex: 1;
`;

const StyledKeyboardAvoidingView = styled.KeyboardAvoidingView`
	flex: 1;
`;

const Content = styled.View`
	flex: 1;
`;

const contentContainerStyle = {
	flexGrow: 1,
	paddingVertical: 50,
	backgroundColor: colors.white,
} as const;
