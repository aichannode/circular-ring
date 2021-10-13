import { useNavigation } from "@react-navigation/native";
import { SecondaryButton } from "@ui/components/buttons";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { useI18n } from "@ui/i18n";
import { Routes, useAppRoute } from "@ui/navigation/routes";
import React from "react";
import WebView from "react-native-webview";
import styled from "styled-components/native";

export const WebViewScreen = () => {
	const navigation = useNavigation();
	const { format } = useI18n();
	const route = useAppRoute<Routes.WebView>();
	const { uri, label } = route.params;

	React.useLayoutEffect(() => {
		label !== undefined &&
			navigation.setOptions({
				title: label,
			});
	}, [navigation, label]);

	return (
		<ScrollScreen contentContainerStyle={{ paddingVertical: 0 }}>
			<StyledWebView source={{ uri }} />
			<ButtonContainer>
				<SecondaryButton onPress={navigation.goBack}>{format("global.back")}</SecondaryButton>
			</ButtonContainer>
		</ScrollScreen>
	);
};

const StyledWebView = styled(WebView)`
	flex: 1;
`;

const ButtonContainer = styled.View`
	margin-top: 20px;
	margin-bottom: 30px;
	align-items: center;
`;
