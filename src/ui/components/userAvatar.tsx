import { useServices } from "@core/services";
import { useUser } from "@domain/user/hooks/useUser";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import moment from "moment";
import React from "react";
import { Alert, TouchableOpacity } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import LinearGradient from "react-native-linear-gradient";
import styled from "styled-components/native";

function capitalizeFirstLetter(string: string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

export const UserAvatar = () => {
	const { userService } = useServices();
	const user = useUser();
	const { format } = useI18n();

	const selectImage = async () => {
		const image = await launchImageLibrary({ mediaType: "photo", maxHeight: 512, maxWidth: 512 });
		if (image.didCancel) return;
		if (image.assets !== undefined) {
			const { uri, fileName, type, fileSize } = image?.assets[0];

			if ((fileSize ?? 0) >= 10 * 1024 * 1024) {
				Alert.alert(format("general.error.title"), format("profile.profile_pic_too_large"));
				return;
			}

			try {
				if (uri !== undefined && fileName !== undefined && type !== undefined)
					await userService.uploadProfilPicture(uri, fileName, type);
			} catch (err) {
				Alert.alert(format("general.error.title"), format("profile.profile_pic_error"));
			}
		}
	};

	const userCreationDate = user?.createdAt || new Date();

	const displayedDate = capitalizeFirstLetter(moment(new Date(userCreationDate)).format("MMM YYYY"));

	return !user ? null : (
		<UserInfo>
			<TouchableOpacity onPress={() => selectImage()}>
				<PenBorder>
					<PenBackground>
						<PenImage resizeMode="contain" source={require("@assets/images/pen.png")}></PenImage>
					</PenBackground>
				</PenBorder>
				<AvatarBorder colors={colors.gradient.orange.slice(0)} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }}>
					<AvatarBackground>
						{user.profilePictureUrl ? (
							<Avatar
								resizeMode="cover"
								source={{
									uri: user.profilePictureUrl,
								}}
							/>
						) : (
							<DefaultAvatar resizeMode="contain" source={require("@assets/images/man.png")} />
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

const Avatar = styled.Image`
	width: 119px;
	height: 119px;
`;

const DefaultAvatar = styled.Image`
	width: 100%;
	height: 100%;
`;

const AvatarBorder = styled(LinearGradient)`
	overflow: hidden;
	width: 119px;
	height: 119px;
	padding: 4px;
	border-radius: 60px;
	align-items: stretch;
	justify-content: center;
`;
const PenImage = styled.Image``;

const PenBorder = styled.View`
	position: absolute;
	right: 0;
	z-index: 20;
	background-color: white;
	overflow: hidden;
	width: 27px;
	height: 27px;
	padding: 4px;
	border-radius: 14px;
	align-items: stretch;
	justify-content: center;
	border: 2px solid ${colors.gradient.orange[0]};
`;

const PenBackground = styled.View`
	overflow: hidden;
	flex: 1;
	background-color: ${colors.lightgray};
	justify-content: flex-end;
	align-items: center;
	margin-bottom: 0;
`;

const AvatarBackground = styled.View`
	overflow: hidden;
	flex: 1;
	border-radius: 56px;
	background-color: ${colors.lightgray};
	justify-content: center;
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
