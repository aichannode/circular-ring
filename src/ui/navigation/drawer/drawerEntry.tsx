import { DrawerActions, useNavigation } from "@react-navigation/native";
import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import React, { useCallback } from "react";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";
import { Pressable } from "react-native";
import styled from "styled-components/native";

interface DrawerEntryProps {
	route: Routes;
}

export const DrawerEntry: React.FC<DrawerEntryProps> = ({ route, children }) => {
	const navigation = useNavigation();
	const { navigate } = useRoutesNavigation();

	const goToRoute = useCallback(() => {
		navigation.dispatch(DrawerActions.toggleDrawer);
		navigate(route);
	}, [route]);

	return (
		<Pressable onPress={goToRoute}>
			<EntryText>{children}</EntryText>
		</Pressable>
	);
};

const EntryText = styled.Text`
	${textStyles.bigTitle};
	height: 62px;
	width: 100%;
	text-align-vertical: center;
	text-align: left;
	color: ${colors.white};
`;
