import { DrawerActions, useNavigation } from "@react-navigation/native";
import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import React, { useCallback } from "react";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";
import styled from "styled-components/native";

interface DrawerEntryProps {
	route: Routes;
	routeOptions?: {
		uri: string;
	};
}

export const DrawerEntry: React.FC<DrawerEntryProps> = ({ route, routeOptions, children }) => {
	const navigation = useNavigation();
	const { navigate } = useRoutesNavigation();

	const goToRoute = useCallback(() => {
		navigation.dispatch(DrawerActions.toggleDrawer);
		navigate(route, routeOptions);
	}, [route]);

	return (
		<StyledPressable onPress={goToRoute}>
			<EntryText>{children}</EntryText>
		</StyledPressable>
	);
};

const StyledPressable = styled.Pressable`
	justify-content: center;
	height: 62px;
`;

const EntryText = styled.Text`
	${textStyles.bigTitle};
	text-align: left;
	color: ${colors.white};
`;
