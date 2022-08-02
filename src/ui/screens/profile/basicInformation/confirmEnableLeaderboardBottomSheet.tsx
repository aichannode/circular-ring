import { useServices } from "@core/services";
import { PrimaryButton, TertiaryButton } from "@ui/components/buttons";
import { ResponsiveCenterView, Row } from "@ui/components/layout";
import { Spinner } from "@ui/components/spinner";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import React, { useCallback, useState } from "react";
import styled from "styled-components/native";

interface ConfirmEnableLeaderboardBottomSheetProps {
	enableLeaderboard: boolean;
	onClose: () => void;
}

export const ConfirmEnableLeaderboardBottomSheet = ({
	enableLeaderboard,
	onClose,
}: ConfirmEnableLeaderboardBottomSheetProps) => {
	const { format } = useI18n();
	const { userService } = useServices();

	const [errorMessage, setErrorMessage] = useState("");
	const [isLoading, setLoading] = useState(false);

	const saveEnabledLeaderboard = useCallback(async () => {
		setLoading(true);
		setErrorMessage("");
		try {
			await userService.updateUserInfo({ enableLeaderboard });
			setLoading(false);
			onClose();
		} catch (error) {
			setLoading(false);
			setErrorMessage(format("global.default_error"));
		}
	}, []);

	return (
		<Container>
			<TopContainer>
				<Title>{format("profile_info.bottom_sheet.sex.title")}</Title>
				<Description>{format("profile_info.bottom_sheet.enableLeaderboard.description")}</Description>
			</TopContainer>
			<ErrorMessage>{errorMessage}</ErrorMessage>
			<BottomContainer>
				{isLoading ? (
					<Spinner size={24} />
				) : (
					<Row gap={35}>
						<TertiaryButton containerBackgroundColor={colors.white} onPress={saveEnabledLeaderboard}>
							{format("global.no_shift")}
						</TertiaryButton>
						<PrimaryButton onPress={saveEnabledLeaderboard}>{format("global.yes_shift")}</PrimaryButton>
					</Row>
				)}
			</BottomContainer>
		</Container>
	);
};

const Container = styled(ResponsiveCenterView)`
	flex: 1;
	justify-content: space-between;
	align-items: center;
`;

const TopContainer = styled.View`
	margin-top: 40px;
`;

const Title = styled.Text`
	${textStyles.mediumTitle};
	margin-bottom: 65px;
	text-align: center;
`;

const Description = styled.Text`
	font-size: 16px;
	color: ${colors.textPrimary};
	text-align: center;
`;

const ErrorMessage = styled.Text`
	${textStyles.errorMessage};
	margin-top: 20px;
	text-align: center;
	align-self: center;
`;

const BottomContainer = styled.View`
	margin-top: 20px;
	margin-bottom: 30px;
	height: 38px;
	justify-content: center;
	flex-direction: row;
`;
