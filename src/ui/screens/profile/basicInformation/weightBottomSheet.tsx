import { useServices } from "@core/services";
import { defaultWeight, kgToLbs, lbsToKg, WeightUnit, weightValuesKg, weightValuesLbs } from "@domain/units";
import { useUser, useUserSettings } from "@domain/user/hooks/useUser";
import { PrimaryButton } from "@ui/components/buttons";
import { HorizontalCarousel } from "@ui/components/horizontalCarousel";
import { ResponsiveCenterView } from "@ui/components/layout";
import { Spinner } from "@ui/components/spinner";
import { useI18n } from "@ui/i18n";
import { textStyles } from "@ui/styles/textStyles";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components/native";

interface WeightBottomSheetProps {
	onSaved: () => void;
}

export const WeightBottomSheet = ({ onSaved }: WeightBottomSheetProps) => {
	const user = useUser();
	if (!user) {
		return <></>;
	}
	const { format } = useI18n();
	const userSettings = useUserSettings();
	const { userService } = useServices();
	const userWeightUnit = userSettings?.weightFormat || WeightUnit.kg;

	const [weight, setWeight] = useState(defaultWeight.get(userWeightUnit) ?? 80);
	const [errorMessage, setErrorMessage] = useState("");
	const [isLoading, setLoading] = useState(false);

	useEffect(() => {
		const currentWeight = userWeightUnit === WeightUnit.kg ? user.weight : kgToLbs(user.weight);
		setWeight(currentWeight);
	}, []);

	const saveWeight = useCallback(async () => {
		setLoading(true);
		setErrorMessage("");
		const newWeight = userWeightUnit === WeightUnit.kg ? weight : Math.round(lbsToKg(weight));
		try {
			await userService.updateUserInfo({ weight: newWeight });
			setLoading(false);
			onSaved();
		} catch (error) {
			setLoading(false);
			setErrorMessage(format("global.default_error"));
		}
	}, [weight]);

	return (
		<Container>
			<TopContainer>
				<Title>{format("profile_info.bottom_sheet.weight")}</Title>
				<ErrorMessage>{errorMessage}</ErrorMessage>
			</TopContainer>
			<HorizontalCarousel
				data={userWeightUnit === WeightUnit.kg ? weightValuesKg : weightValuesLbs}
				item={weight}
				onItemChange={setWeight}
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
