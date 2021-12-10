import { useUser } from "@domain/user/hooks/useUser";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import dayjs from "dayjs";
import React from "react";
import LinearGradient from "react-native-linear-gradient";
import styled from "styled-components/native";
import { launchImageLibrary } from "react-native-image-picker";
import { TouchableOpacity } from "react-native";
import { useServices } from "@core/services";

export const UserAvatar = () => {
	const { userService } = useServices();
	const user = useUser();
	const { format } = useI18n();
	console.log("USER", user);

	const userCreationDate = user?.createdAt || new Date();
	const date = dayjs(userCreationDate);
	const displayedDate = date.format("MMM. YYYY");

	const selectImage = async () => {
		const image = await launchImageLibrary({ mediaType: "photo" });
		if (image.didCancel) return;
		console.log("USER Image", image);
		const { uri, fileName, type } = image.assets[0];

		userService.uploadProfilPicture(uri, fileName, type);
	};

	return !user ? null : (
		<UserInfo>
			<TouchableOpacity onPress={() => selectImage(userService)}>
				<AvatarBorder
					colors={[colors.orangeGradientStart, colors.orangeGradientEnd]}
					start={{ x: 0.5, y: 0 }}
					end={{ x: 0.5, y: 1 }}
				>
					<AvatarBackground>
						{user.profilePictureUrl ? (
							<DefaultAvatar resizeMode="cover" source={{ uri: user.profilePictureUrl }} />
						) : (
							// <DefaultAvatar source={require("@assets/images/man.png")} />
							<DefaultAvatar source={require("@assets/images/man.png")} />
						)}
					</AvatarBackground>
				</AvatarBorder>
			</TouchableOpacity>
			<UserName>
				{user.firstName} <BoldUserName>{user.lastName}</BoldUserName>
			</UserName>
			<UserCreation>{format("profile.user_creation", { date: displayedDate })}</UserCreation>
		</UserInfo>
	);
};

const UserInfo = styled.View`
	align-items: center;
`;

const DefaultAvatar = styled.Image``;

const AvatarBorder = styled(LinearGradient)`
	width: 119px;
	height: 119px;
	padding: 4px;
	border-radius: 60px;
	align-items: stretch;
	justify-content: center;
	margin-bottom: 12px;
`;

const AvatarBackground = styled.View`
	border: 1px solid black;
	flex: 1;
	border-radius: 56px;
	background-color: ${colors.lightgray};
	justify-content: flex-end;
	align-items: center;
	margin-bottom: 0;
`;

const UserName = styled.Text`
	${textStyles.primary};
	font-size: 16px;
	margin-bottom: 2px;
`;

const BoldUserName = styled.Text`
	font-weight: bold;
`;

const UserCreation = styled.Text`
	${textStyles.tertiary};
	margin-bottom: 25px;
`;
