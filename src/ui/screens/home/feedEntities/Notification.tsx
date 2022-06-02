import { FeedEntityStyle, FeedNotification, IconType, FeedEntityAction } from "@domain/feed/type";
import { CloseButton } from "@ui/components/closeButton";
import { row, Stack } from "@ui/components/layout";
import { OrangeDiagonalGradient } from "@ui/components/shapes/gradients";
import { SecondaryText } from "@ui/components/text";
import { Navigate, Routes, useRoutesNavigation } from "@ui/navigation/routes";
import { colors } from "@ui/styles/colors";
import React from "react";
import { Image, Pressable, StyleProp, View, ViewStyle } from "react-native";
import styled from "styled-components/native";
import { Paragraph } from "../components/Paragraph";
import { ParagraphComponentConfigurationDto } from "@domain/feed/type";
import { useI18n } from "@ui/i18n";
import { useServices } from "@core/services";
import { openURL } from "@ui/utils/urlUtils";
import { WordingKey } from "src/wordings";

interface Props {
	notification: FeedNotification;
	style?: StyleProp<ViewStyle>;
}

interface ActionHandler {
	notif: FeedNotification;
	navigate: Navigate;
	format: (
		arg0: WordingKey,
		values?: Record<string, string | number | boolean | Date | null | undefined> | undefined
	) => string;
}

function getActionHandler({ notif, navigate, format }: ActionHandler) {
	return () => {
		const action = notif.actions[0];
		if (action) {
			switch (action.type) {
				case FeedEntityAction.OPEN_WEB:
					openURL(action.data);
					break;
				case FeedEntityAction.APP_PAGE:
					navigate(Routes.Activity); // TODO Handle routing with backend when we got specs
					break;
				default:
					throw Error(format("notification.errorUnhandled"));
			}
		}
	};
}

export const Notification: React.FC<Props> = ({ notification, style }) => {
	const { navigate } = useRoutesNavigation();
	const { feedService } = useServices();
	const useContrastColor = notification.style === FeedEntityStyle.ORANGE_GRADIENT;
	const { format } = useI18n();

	return (
		<Pressable onPress={getActionHandler({ notif: notification, navigate: navigate, format: format })} style={style}>
			<Container>
				<View style={{ marginRight: 27 }}>
					{notification.icon.type === IconType.URL ? <Image source={{ uri: notification.icon.type }} /> : null}
				</View>
				<Stack gap={10} style={{ flex: 1 }}>
					<SecondaryText style={{ color: colors.white, fontWeight: "500" }}>{format(notification.title)}</SecondaryText>
					<Paragraph
						useContrastColor={useContrastColor}
						{...(notification.components[0] as ParagraphComponentConfigurationDto).configuration}
					/>
				</Stack>
				<CloseButton
					padding={16}
					onClose={() => {
						feedService.closeNotification(notification.id);
					}}
				/>
			</Container>
		</Pressable>
	);
};

const Container = styled(OrangeDiagonalGradient)`
	margin-top: 15px;
	padding: 20px 40px 20px 20px;
	${row("center")};
	background-color: black;
	border-radius: 2px;
`;
