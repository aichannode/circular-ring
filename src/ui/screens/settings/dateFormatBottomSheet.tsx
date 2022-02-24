import { useServices } from "@core/services";
import { DateFormat } from "@domain/units";
import { useUserSettings } from "@domain/user/hooks/useUser";
import { PrimaryButton } from "@ui/components/buttons";
import { ResponsiveCenterView } from "@ui/components/layout";
import { Spinner } from "@ui/components/spinner";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import React, { useCallback, useState } from "react";
import { Text, View } from "react-native";
import styled from "styled-components/native";

interface DateFormatBottomSheetProps {
	onSaved: () => void;
}
export const DateFormatBottomSheet: React.FC<DateFormatBottomSheetProps> = ({ onSaved }) => {
	const { format } = useI18n();

	const { userService } = useServices();
	const userSettings = useUserSettings();
	const [errorMessage, setErrorMessage] = useState("");
	const [isLoading, setLoading] = useState(false);
	const [dateFormat, setDateFormat] = useState(userSettings?.dateFormat ?? DateFormat.USCS);

	const saveDateFormat = useCallback(async () => {
		if (!userSettings) {
			return;
		}
		setLoading(true);
		setErrorMessage("");
		try {
			if (dateFormat !== userSettings.dateFormat) {
				await userService.updateUserSettings({ dateFormat });
			}
			setLoading(false);
			onSaved();
		} catch (error) {
			setLoading(false);
			setErrorMessage(format("global.default_error"));
		}
	}, [dateFormat]);

	return !userSettings ? null : (
		<Container maxWidth={320}>
			<Description>{format("settings.date_format.label")}</Description>
			<View style={{ alignSelf: "stretch" }}>
				{[DateFormat.USCS, DateFormat.SI].map((option) => {
					const selected = dateFormat === option;
					return (
						<Selector key={option.toString()} onPress={() => setDateFormat(option)}>
							<Text>{option}</Text>
							<Check selected={selected}>
								{selected && <CheckIcon source={require("@assets/images/checkSmall.png")} tintColor={colors.white} />}
							</Check>
						</Selector>
					);
				})}
			</View>
			<BottomContainer>
				{errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}
				<ButtonContainer>
					{isLoading ? (
						<Spinner size={24} />
					) : (
						<PrimaryButton style={{ width: 90 }} onPress={saveDateFormat}>
							{format("global.save")}
						</PrimaryButton>
					)}
				</ButtonContainer>
			</BottomContainer>
		</Container>
	);
};

const Container = styled(ResponsiveCenterView)`
	flex: 1;
	justify-content: space-between;
	padding-vertical: 60px;
`;

const Description = styled.Text`
	font-size: 14px;
	color: ${colors.textPrimary};
	text-align: center;
	margin-top: 30px;
	margin-bottom: 16px;
`;

const Selector = styled.Pressable`
	height: 50px;
	flex-direction: row;
	padding: 0 24px;
	justify-content: space-between;
	align-items: center;
	border-bottom-width: 1px;
	border-bottom-color: ${colors.lightgray};
`;

const Check = styled.View<{ selected: boolean }>`
	width: 24px;
	height: 24px;
	justify-content: center;
	align-items: center;
	background-color: ${({ selected }) => (selected ? colors.primary : "transparent")};
	border-radius: 12px;
`;

const CheckIcon = styled.Image<{ tintColor: string }>`
	height: 14px;
	flex-shrink: 1;
	tint-color: ${(props) => props.tintColor};
	resize-mode: contain;
`;

const BottomContainer = styled.View`
	margin-top: 30px;
	margin-bottom: 30px;
`;

const ButtonContainer = styled.View`
	height: 38px;
`;

const ErrorMessage = styled.Text`
	${textStyles.errorMessage};
	margin-bottom: 16px;
	text-align: center;
`;
