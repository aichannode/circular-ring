import { useServices } from "@core/services";
import { useUser, useUserAdvancedInfo } from "@domain/user/hooks/useUser";
import { PrimaryButton } from "@ui/components/buttons";
import { LabeledSlider } from "@ui/components/labeledSlider";
import { ResponsiveCenterView } from "@ui/components/layout";
import { Spinner } from "@ui/components/spinner";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import React, { useCallback, useState } from "react";
import styled from "styled-components/native";

interface CycleLengthBottomSheetProps {
	onSaved: () => void;
}

export const CycleLengthBottomSheet = ({ onSaved }: CycleLengthBottomSheetProps) => {
	const { format } = useI18n();
	const { userService } = useServices();
	const user = useUser();
	const advancedInfo = useUserAdvancedInfo();
	const [cycleLength, setCycleLength] = useState(advancedInfo?.female?.cycleLength ?? 20);
	const [errorMessage, setErrorMessage] = useState("");
	const [isLoading, setLoading] = useState(false);

	const saveCycleLength = useCallback(async () => {
		setLoading(true);
		setErrorMessage("");
		try {
			if (!advancedInfo) {
				return;
			}
			await userService.updateUserAdvancedInfo({ female: { ...advancedInfo.female, cycleLength } });
			setLoading(false);
			onSaved();
		} catch (error) {
			setLoading(false);
			setErrorMessage(format("global.default_error"));
		}
	}, [cycleLength, advancedInfo]);

	return !user ? null : (
		<Container>
			<TopContainer>
				<Title>{format("profile_advanced_info.cycle_length.bottom_sheet.title")}</Title>
				<ErrorMessage>{errorMessage}</ErrorMessage>
			</TopContainer>
			<LabeledSlider
				label="Days"
				style={{ width: 260, height: 6, alignSelf: "center" }}
				value={cycleLength}
				onValueChange={(value) => setCycleLength(Math.floor(value))}
				minimumValue={20}
				maximumValue={41}
				minimumTrackTintColor={colors.primary}
				thumbTintColor={colors.primary}
				maximumTrackTintColor={colors.gray}
			/>
			<BottomContainer>
				{isLoading ? (
					<Spinner size={24} />
				) : (
					<PrimaryButton onPress={saveCycleLength}>{format("global.save")}</PrimaryButton>
				)}
			</BottomContainer>
		</Container>
	);
};

const Container = styled(ResponsiveCenterView)`
	flex: 1;
	justify-content: space-between;
`;

const TopContainer = styled.View``;

const Title = styled.Text`
	${textStyles.mediumTitle};
	margin-top: 30px;
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
`;
