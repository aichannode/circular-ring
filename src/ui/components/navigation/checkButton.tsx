import { useRoutesNavigation } from "@ui/navigation/routes";
import { colors } from "@ui/styles/colors";
import React from "react";
import { Image } from "react-native";
import styled from "styled-components/native";

interface CheckAlarmButtonProps {
	onPress: () => void;
}

export const CheckAlarmButton: React.FC<CheckAlarmButtonProps> = ({ onPress }) => {
	const navigation = useRoutesNavigation();

	return (
		<Container
			onPress={() => {
				onPress();
				navigation.goBack();
			}}
		>
			<CheckLogo source={require("@assets/images/checkSmall.png")} />
		</Container>
	);
};

const Container = styled.Pressable`
	align-items: center;
`;

const CheckLogo = styled(Image)`
	height: 21px;
	width: 21px;
	tinit-color: ${colors.darkGray};
`;
