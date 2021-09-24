import { useServices } from "@core/services";
import { round2Digits } from "@core/utils";
import {
	cmToFt,
	defaultHeight,
	ftToCm,
	HeightUnit,
	heightValuesCm,
	heightValuesFt,
	UNDEFINED_HEIGHT,
} from "@domain/units";
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
	const { format } = useI18n();
	const { userService } = useServices();
	const user = useUser();
	const userSettings = useUserSettings();
	const userHeightUnit = userSettings?.heightFormat || HeightUnit.cm;

	const [height, setHeight] = useState(defaultHeight.get(userHeightUnit) ?? UNDEFINED_HEIGHT);
	const [errorMessage, setErrorMessage] = useState("");
	const [isLoading, setLoading] = useState(false);

	useEffect(() => {
		const currentHeight =
			userHeightUnit === HeightUnit.cm
				? Math.round(user?.height ?? UNDEFINED_HEIGHT)
				: round2Digits(cmToFt(user?.height ?? UNDEFINED_HEIGHT));
		setHeight(currentHeight);
	}, []);

	const saveHeight = useCallback(async () => {
		setLoading(true);
		setErrorMessage("");
		const newHeight = userHeightUnit === HeightUnit.cm ? height : ftToCm(height);
		try {
			await userService.updateUserInfo({ height: newHeight });
			setLoading(false);
			onSaved();
		} catch (error) {
			setLoading(false);
			setErrorMessage(format("global.default_error"));
		}
	}, [height, userHeightUnit]);

	return !user ? null : (
		<Container>
			<TopContainer>
				<Title>{format("profile_info.bottom_sheet.height")}</Title>
				<ErrorMessage>{errorMessage}</ErrorMessage>
			</TopContainer>
			<HorizontalCarousel
				data={userHeightUnit === HeightUnit.cm ? heightValuesCm : heightValuesFt}
				renderItem={(item) => (
					<PickerValue itemWidth={userHeightUnit === HeightUnit.cm ? 50 : 60}>
						{item.toFixed(userHeightUnit === HeightUnit.cm ? 0 : 2)}
					</PickerValue>
				)}
				itemWidth={userHeightUnit === HeightUnit.cm ? 50 : 60}
				onItemChange={setHeight}
				item={height}
				animatedScrollToDefaultIndex={false}
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

const PickerValue = styled.Text<{ itemWidth: number }>`
	width: ${({ itemWidth }) => itemWidth}px;
	text-align: center;
	font-size: 22px;
`;

const BottomContainer = styled.View`
	margin-top: 20px;
	margin-bottom: 30px;
	height: 38px;
	justify-content: center;
`;
