import { useServices } from "@core/services";
import { kgToLbs, lbsToKg, UNDEFINED_WEIGHT, WeightUnit, weightValuesKg, weightValuesLbs } from "@domain/units";
import { useUser, useUserSettings } from "@domain/user/hooks/useUser";
import { PrimaryButton } from "@ui/components/buttons";
import { HorizontalCarousel } from "@ui/components/horizontalCarousel";
import { ResponsiveCenterView } from "@ui/components/layout";
import { Spinner } from "@ui/components/spinner";
import { useI18n } from "@ui/i18n";
import { textStyles } from "@ui/styles/textStyles";
import React, { useCallback, useState } from "react";
import styled from "styled-components/native";

interface WeightBottomSheetProps {
	onSaved: () => void;
}

export const WeightBottomSheet = ({ onSaved }: WeightBottomSheetProps) => {
	const { format } = useI18n();
	const { userService } = useServices();
	const user = useUser();
	const userSettings = useUserSettings();
	const userWeightUnit = userSettings?.weightFormat || WeightUnit.kg;

	const [weight, setWeight] = useState(user?.weight ?? UNDEFINED_WEIGHT); // weight always in kg
	const [errorMessage, setErrorMessage] = useState("");
	const [isLoading, setLoading] = useState(false);

	const saveWeight = useCallback(async () => {
		setLoading(true);
		setErrorMessage("");
		try {
			await userService.updateUserInfo({ weight });
			setLoading(false);
			onSaved();
		} catch (error) {
			setLoading(false);
			setErrorMessage(format("global.default_error"));
		}
	}, [weight]);

	return !user ? null : (
		<Container>
			<TopContainer>
				<Title>{format("profile_info.bottom_sheet.weight")}</Title>
				<ErrorMessage>{errorMessage}</ErrorMessage>
			</TopContainer>
			<HorizontalCarousel
				data={userWeightUnit === WeightUnit.kg ? weightValuesKg : weightValuesLbs}
				item={userWeightUnit === WeightUnit.kg ? Math.round(weight) : Math.round(kgToLbs(weight))}
				onItemChange={(value) => setWeight(userWeightUnit === WeightUnit.kg ? value : lbsToKg(value))}
				itemWidth={50}
				renderItem={(item) => <PickerValue>{`${item}`}</PickerValue>}
			/>
			<BottomContainer>
				{isLoading ? (
					<Spinner size={24} />
				) : (
					<PrimaryButton onPress={saveWeight}>{format("global.save")}</PrimaryButton>
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

const PickerValue = styled.Text`
	width: 50px;
	text-align: center;
	font-size: 22px;
`;

const BottomContainer = styled.View`
	margin-top: 20px;
	margin-bottom: 30px;
	height: 38px;
	justify-content: center;
`;
