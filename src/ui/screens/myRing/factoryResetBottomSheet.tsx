import { useServices } from "@core/services";
import { PrimaryButton, Tertiarybutton } from "@ui/components/buttons";
import { Grow, ResponsiveCenterView, Row } from "@ui/components/layout";
import { Spinner } from "@ui/components/spinner";
import { MediumTitleText, PrimaryText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import React, { useCallback, useState } from "react";
import styled from "styled-components/native";

interface FactoryResetBottomSheetProps {
	onClose: () => void;
}

export const FactoryResetBottomSheet: React.FC<FactoryResetBottomSheetProps> = ({ onClose }) => {
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
			<Title>{format("ring.factory_reset_confirm.title")}</Title>
			<Description>{format("ring.factory_reset_confirm.title")}</Description>
			<ErrorMessage>{errorMessage}</ErrorMessage>
			<Grow />
			<ButtonContainer gap={35} style={{ height: 38 }}>
				{isLoading ? (
					<Spinner size={24} />
				) : (
					[
						<Tertiarybutton key={"cancel"} containerBackgroundColor={colors.white} onPress={onClose}>
							{format("global.cancel")}
						</Tertiarybutton>,
						<PrimaryButton key={"ok"} onPress={performFactoryReset}>
							{format("ok")}
						</PrimaryButton>,
					]
				)}
			</ButtonContainer>
		</Container>
	);
};

const Container = styled(ResponsiveCenterView)`
	flex: 1;
	justify-content: space-between;
	align-items: center;
`;

const Title = styled(MediumTitleText)`
	margin-top: 120px;
	font-size: 16px;
	text-align: center;
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
