import { useServices } from "@core/services";
import { PrimaryButton, TertiaryButton } from "@ui/components/buttons";
import { Grow, ResponsiveCenterView, Row } from "@ui/components/layout";
import { Spinner } from "@ui/components/spinner";
import { MediumTitleText, PrimaryText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import React, { useCallback, useState } from "react";
import { View, Image } from "react-native";
import styled from "styled-components/native";

interface UpdateFailedBottomSheetProps {
	onClose: () => void;
}

export const UpdateFailedBottomSheet: React.FC<UpdateFailedBottomSheetProps> = ({ onClose }) => {
	const { format } = useI18n();
	const { ringManagementService } = useServices();

	const [isLoading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const performFactoryReset = useCallback(async () => {
		setErrorMessage("");
		setLoading(true);
		try {
			await ringManagementService.factoryResetCurrentRing();
			setLoading(false);
		} catch (error) {
			setLoading(false);
			setErrorMessage(format("global.default_error"));
		}
	}, []);

	return (
		<Container horizontalPadding={0}>
			<View style={{ marginTop: 40 }}>
				<Image source={require("@assets/images/ringShadow.png")} />
				<Cover>
					<Image source={require("@assets/images/ringBig.png")} />
				</Cover>
			</View>
			<Title>{format("updateFirmware.updateFailed")}</Title>
			<Description>{format("updateFirmware.updateFailed.description")}</Description>
			<ErrorMessage>{errorMessage}</ErrorMessage>
			<Grow />
			<ButtonContainer gap={35} style={{ height: 38 }}>
				{isLoading ? (
					<Spinner size={24} />
				) : (
					[
						<TertiaryButton key={"cancel"} containerBackgroundColor={colors.white} onPress={onClose}>
							{format("global.back")}
						</TertiaryButton>,
						<PrimaryButton key={"ok"} onPress={performFactoryReset}>
							{format("retry")}
						</PrimaryButton>,
					]
				)}
			</ButtonContainer>
		</Container>
	);
};

const Cover = styled.View`
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const Container = styled(ResponsiveCenterView)`
	flex: 1;
	justify-content: space-between;
	align-items: center;
`;

const Title = styled(MediumTitleText)`
	font-size: 16px;
	text-align: center;
	margin-top: 30px;
`;

const Description = styled(PrimaryText)`
	margin-top: 32px;
	font-size: 14px;
	text-align: center;
`;

const ErrorMessage = styled.Text`
	${textStyles.errorMessage};
	margin-top: 20px;
	text-align: center;
	align-self: center;
`;

const ButtonContainer = styled(Row)`
	margin: 30px 0;
`;
