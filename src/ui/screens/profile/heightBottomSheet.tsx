import { useServices } from "@core/services";
import { cmToFt, defaultHeight, ftToCm, HeightUnit, heightValuesCm, heightValuesFt } from "@domain/units";
import { useUser, useUserSettings } from "@domain/user/hooks/useUser";
import { PrimaryButton } from "@ui/components/buttons";
import { HorizontalCarousel } from "@ui/components/horizontalCarousel";
import { ResponsiveCenterView } from "@ui/components/layout";
import { Spinner } from "@ui/components/spinner";
import { useI18n } from "@ui/i18n";
import { textStyles } from "@ui/styles/textStyles";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components/native";

interface HeightBottomSheetProps {
	onSaved: () => void;
}

export const HeightBottomSheet = ({ onSaved }: HeightBottomSheetProps) => {
	const user = useUser();
	if (!user) {
		return <></>;
	}
	const { format } = useI18n();
	const userSettings = useUserSettings();
	const { userService } = useServices();
	const userHeightUnit = userSettings?.heightFormat || HeightUnit.cm;

	const [height, setHeight] = useState(defaultHeight.get(userHeightUnit) ?? 170);
	const [errorMessage, setErrorMessage] = useState("");
	const [isLoading, setLoading] = useState(false);

	useEffect(() => {
		const currentHeight = userHeightUnit === HeightUnit.cm ? user.height : Math.round(cmToFt(user.height));
		setHeight(currentHeight);
	}, []);

	const saveHeight = useCallback(async () => {
		setLoading(true);
		setErrorMessage("");
		const newHeight = userHeightUnit === HeightUnit.cm ? height : Math.round(ftToCm(height));
		try {
			await userService.updateUserInfo({ height: newHeight });
			setLoading(false);
			onSaved();
		} catch (error) {
			setLoading(false);
			setErrorMessage(format("global.default_error"));
		}
	}, [height]);

	return (
		<Container>
			<TopContainer>
				<Title>{format("profile_info.bottom_sheet.height")}</Title>
				<ErrorMessage>{errorMessage}</ErrorMessage>
			</TopContainer>
			<HorizontalCarousel
				data={userHeightUnit === HeightUnit.cm ? heightValuesCm : heightValuesFt}
				item={height}
				onItemChange={setHeight}
				itemWidth={50}
				renderItem={(item) => <PickerValue>{`${item}`}</PickerValue>}
			/>
			<BottomContainer>
				{isLoading ? (
					<Spinner size={24} />
				) : (
					<PrimaryButton onPress={saveHeight}>{format("global.save")}</PrimaryButton>
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
