import { DrawerActions, useNavigation } from "@react-navigation/native";
import { IfAdmin } from "@ui/containers/IfAdmin";
import { useI18n } from "@ui/i18n";
import { DrawerEntry } from "@ui/navigation/drawer/drawerEntry";
import { Routes } from "@ui/navigation/routes";
import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import React from "react";
import { Pressable, ScrollView } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import styled from "styled-components/native";

export const DrawerContent = () => {
	const navigation = useNavigation();
	const { format } = useI18n();

	return (
		<Container colors={colors.gradient.orange.slice(0)}>
			<Pressable onPress={() => navigation.dispatch(DrawerActions.toggleDrawer)}>
				<CloseContainer>
					<CloseText>{format("drawer.close")}</CloseText>
					<CloseImage source={require("@assets/images/close.png")} />
				</CloseContainer>
			</Pressable>
			<ScrollView>
				<Separator />
				<DrawerEntry route={Routes.WebView} routeOptions={{ uri: format("url.store") }}>
					{format("drawer.store")}
				</DrawerEntry>
				<Separator />
				<DrawerEntry route={Routes.QuickAccess}>{format("drawer.quickaccess")}</DrawerEntry>
				<Separator />
				<DrawerEntry route={Routes.Profile}>{format("drawer.profile")}</DrawerEntry>
				<Separator />
				<DrawerEntry route={Routes.WebView} routeOptions={{ uri: format("url.learn") }}>
					{format("drawer.learn")}
				</DrawerEntry>
				<Separator />
				<DrawerEntry route={Routes.Leaderboard}>{format("drawer.leaderboard")}</DrawerEntry>
				<Separator />
				<DrawerEntry route={Routes.Calendar}>{format("drawer.calendar")}</DrawerEntry>
				<Separator />
				<DrawerEntry route={Routes.Settings}>{format("drawer.settings")}</DrawerEntry>
				<Separator />
				<IfAdmin>
					<DrawerEntry route={Routes.Storybook}>{format("drawer.storybook")}</DrawerEntry>
					<Separator />
				</IfAdmin>
			</ScrollView>
		</Container>
	);
};

const Container = styled(LinearGradient)`
	flex: 1;
	padding: 51px 48px;
`;

const CloseContainer = styled.View`
	flex-direction: row;
	align-items: center;
	margin-bottom: 110px;
	justify-content: flex-end;
`;

const CloseText = styled.Text`
	${textStyles.mediumTitle};
	color: ${colors.white};
	margin-right: 10px;
`;

const CloseImage = styled.Image``;

const Separator = styled.View`
	height: 0;
	background-color: ${colors.white};
	border-radius: 0.5px;
	border: 0.5px ${colors.white} solid;
`;
