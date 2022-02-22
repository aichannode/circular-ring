import { useServices } from "@core/services";
import { NamedUserRing } from "@domain/ring/ring";
import { PrimaryButton, TertiaryButton } from "@ui/components/buttons";
import { Grow, ResponsiveCenterView, Row } from "@ui/components/layout";
import { Spinner } from "@ui/components/spinner";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import React, { useCallback, useState } from "react";
import styled from "styled-components/native";
import { Image } from "react-native";

interface DeleteRingBottomSheetProps {
	ring: NamedUserRing;
	onClose: () => void;
}

export const DeleteRingBottomSheet: React.FC<DeleteRingBottomSheetProps> = ({ ring, onClose }) => {
	const { format } = useI18n();
	const { ringManagementService, bleDeviceService } = useServices();

	const [isSuccess, setSuccess] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string>("");
	const [isLoading, setLoading] = useState(false);

	const deleteRing = useCallback(async () => {
		setErrorMessage("");
		setLoading(true);
		try {
			await ringManagementService.deleteRing(ring);
			bleDeviceService.setFavoriteDeviceName("noring");
			setLoading(false);
			setSuccess(true);
		} catch (error) {
			setLoading(false);
			setErrorMessage(format("global.default_error"));
		}
	}, []);

	return (
		<Container>
			<ResponsiveCenterView style={{ flex: 1, justifyContent: "space-around" }}>
				{isSuccess ? (
					<>
						<Title>{format("manage_rings.delete.success.title")}</Title>
						<Image source={require("@assets/images/checkBig.png")} style={{ marginTop: 70 }} />
						<Grow />
						<ButtonContainer gap={35}>
							<PrimaryButton key={"done"} onPress={onClose}>
								{format("global.done")}
							</PrimaryButton>
						</ButtonContainer>
					</>
				) : (
					<>
						<Title>{format("manage_rings.delete.validation.title")}</Title>
						<SubTitle>{format("manage_rings.delete.validation.subtitle")}</SubTitle>
						<Description>{format("manage_rings.delete.validation.description")}</Description>
						<ErrorMessage>{errorMessage}</ErrorMessage>
						<Grow />
						<ButtonContainer gap={35} style={{ height: 38 }}>
							{isLoading ? (
								<Spinner size={24} />
							) : (
								[
									<TertiaryButton key={"cancel"} containerBackgroundColor={colors.white} onPress={onClose}>
										{format("global.cancel")}
									</TertiaryButton>,
									<PrimaryButton key={"dissociate"} onPress={deleteRing}>
										{format("manage_rings.delete.validation.dissociate")}
									</PrimaryButton>,
								]
							)}
						</ButtonContainer>
					</>
				)}
			</ResponsiveCenterView>
		</Container>
	);
};

const Container = styled.View`
	overflow: hidden;
	flex: 1;
	border-radius: 10px;
`;

const Title = styled.Text`
	margin-top: 60px;
	font-size: 20px;
	font-weight: bold;
	color: ${colors.textPrimary};
	text-align: center;
`;

const SubTitle = styled.Text`
	font-size: 16px;
	font-weight: 500;
	color: ${colors.textPrimary};
	text-align: center;
	margin-top: 30px;
	margin-bottom: 20px;
`;

const Description = styled.Text`
	${textStyles.primary};
	font-size: 14px;
	text-align: center;
`;

const ButtonContainer = styled(Row)`
	margin: 30px 0;
`;

const ErrorMessage = styled.Text`
	${textStyles.errorMessage};
	margin-top: 20px;
	text-align: center;
	align-self: center;
`;
