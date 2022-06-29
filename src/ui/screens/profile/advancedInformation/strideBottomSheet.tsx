import { useServices } from "@core/services";
import { round2Digits } from "@core/utils";
import { cmToFt, ftToCm, HeightUnit, strideValuesCm, strideValuesFt } from "@domain/units";
import { useUser, useUserSettings } from "@domain/user/hooks/useUser";
import { PrimaryButton } from "@ui/components/buttons";
import { HorizontalCarousel } from "@ui/components/horizontalCarousel";
import { ResponsiveCenterView } from "@ui/components/layout";
import { Spinner } from "@ui/components/spinner";
import { SecondaryText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import React, { useCallback, useState } from "react";
import styled from "styled-components/native";

interface StrideBottomSheetProps {
	onSaved: () => void;
}

export const StrideBottomSheet = ({ onSaved }: StrideBottomSheetProps) => {
	const { format } = useI18n();
	const { userService } = useServices();
	const user = useUser();
	const userSettings = useUserSettings();
	const userStrideUnit = userSettings?.heightFormat || HeightUnit.cm;

	const [stride, setStride] = useState(user?.stride ?? 0); // stride always in cm
	const [errorMessage, setErrorMessage] = useState("");
	const [isLoading, setLoading] = useState(false);

	const saveStride = useCallback(async () => {
		setLoading(true);
		setErrorMessage("");
		try {
			await userService.updateUserAdvancedInfo({ stride }); // Waiting API
			setLoading(false);
			onSaved();
		} catch (error) {
			setLoading(false);
			setErrorMessage(format("global.default_error"));
		}
	}, [stride, userStrideUnit]);

	return !user ? null : (
		<Container>
			<TopContainer>
				<Title>{format("profile_advanced_info.stride.bottom_sheet.title")}</Title>
				<ErrorMessage>{errorMessage}</ErrorMessage>
			</TopContainer>
			<HorizontalCarousel
				data={userStrideUnit === HeightUnit.cm ? strideValuesCm : strideValuesFt}
				renderItem={(item) => (
					<PickerValue itemWidth={userStrideUnit === HeightUnit.cm ? 50 : 60}>
						{item.toFixed(userStrideUnit === HeightUnit.cm ? 0 : 2)}
					</PickerValue>
				)}
				itemWidth={userStrideUnit === HeightUnit.cm ? 50 : 60}
				onItemChange={(value) => setStride(userStrideUnit === HeightUnit.cm ? value : round2Digits(ftToCm(value)))}
				item={userStrideUnit === HeightUnit.cm ? Math.round(stride) : round2Digits(cmToFt(stride))}
				animatedScrollToDefaultIndex={false}
			/>
			<SecondaryText
				style={{ color: colors.primary, textAlign: "center" }}
				onPress={() => {
					// TODO API WAIT
					setStride(80);
				}}
			>
				{format("profile_advanced_info.stride.reset")}
			</SecondaryText>
			<BottomContainer>
				{isLoading ? (
					<Spinner size={24} />
				) : (
					<PrimaryButton onPress={saveStride}>{format("global.save")}</PrimaryButton>
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
	text-align: center;
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
