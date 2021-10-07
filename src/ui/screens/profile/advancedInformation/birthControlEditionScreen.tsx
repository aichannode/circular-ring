import { useServices } from "@core/services";
import { BirthControl } from "@domain/user/advancedInfo";
import { useUserAdvancedInfo } from "@domain/user/hooks/useUser";
import { useNavigation } from "@react-navigation/native";
import { PrimaryButton } from "@ui/components/buttons";
import { InfoListHeader, InfoListItem } from "@ui/components/infoList";
import { Grow } from "@ui/components/layout";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { Spinner } from "@ui/components/spinner";
import { useI18n } from "@ui/i18n";
import { advanceInfoI18nKey, birthControlKeys } from "@ui/screens/profile/advancedInformation/profileAdvancedInfoI18n";
import { textStyles } from "@ui/styles/textStyles";
import React, { useCallback, useState } from "react";
import styled from "styled-components/native";

export const BirthControlEditionScreen = () => {
	const navigation = useNavigation();
	const { format } = useI18n();
	const { userService } = useServices();
	const advancedInfo = useUserAdvancedInfo();

	const [birthControlType, setBirthControlType] = useState(advancedInfo?.female.birthControl ?? BirthControl.NONE);
	const [isLoading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

	const save = useCallback(async () => {
		if (!advancedInfo || birthControlType === advancedInfo?.female.birthControl) {
			navigation.goBack();
			return;
		}
		setLoading(true);
		setErrorMessage(undefined);
		try {
			await userService.updateUserAdvancedInfo({ female: { ...advancedInfo.female, birthControl: birthControlType } });
			setLoading(false);
			navigation.goBack();
		} catch (error) {
			setLoading(false);
			setErrorMessage(format("global.default_error"));
		}
	}, [birthControlType]);

	return !advancedInfo || !advancedInfo.female ? null : (
		<ScrollScreen contentContainerStyle={{ paddingTop: 0 }}>
			<InfoListHeader>{format("profile_advanced_info.birth_control.selection_invitation")}</InfoListHeader>
			{[
				BirthControl.NONE,
				BirthControl.PILLS,
				BirthControl.CONDOMS,
				BirthControl.VAGINAL_RING,
				BirthControl.PATCH,
				BirthControl.IUD,
				BirthControl.IMPLANT,
				BirthControl.FERTILITY_AWARENESS,
				BirthControl.OTHER,
			].map((type) => (
				<ListItem
					key={type.toString()}
					separated={type === BirthControl.PILLS || type === BirthControl.OTHER}
					name={format(advanceInfoI18nKey(birthControlKeys, type))}
					checkable
					checked={birthControlType === type}
					action={() => setBirthControlType(type)}
				/>
			))}
			<Grow />
			<BottomContainer>
				{errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}
				<ButtonContainer>
					{isLoading ? <Spinner size={24} /> : <PrimaryButton onPress={save}>{format("global.save")}</PrimaryButton>}
				</ButtonContainer>
			</BottomContainer>
		</ScrollScreen>
	);
};

const ListItem = styled(InfoListItem)<{ separated: boolean }>`
	margin-top: ${({ separated }) => (separated ? 20 : 0)}px;
`;

const BottomContainer = styled.View`
	margin-top: 30px;
	margin-bottom: 30px;
	align-items: center;
`;

const ButtonContainer = styled.View`
	height: 38px;
`;

const ErrorMessage = styled.Text`
	${textStyles.errorMessage};
	margin-bottom: 16px;
	text-align: center;
`;
