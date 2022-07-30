import { DateFormat } from "@domain/units";
import { useUserSettings } from "@domain/user/hooks/useUser";
import { PrimaryButton } from "@ui/components/buttons";
import { ResponsiveCenterView } from "@ui/components/layout";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import React from "react";
import { Text, View } from "react-native";
import styled from "styled-components/native";

interface DateFormatBottomSheetProps {
	dateFormat: DateFormat;
	setDateFormat: React.Dispatch<React.SetStateAction<DateFormat>>;
	onSaved: (dateFormat: DateFormat) => void;
}
export const DateFormatBottomSheet: React.FC<DateFormatBottomSheetProps> = ({ dateFormat, setDateFormat, onSaved }) => {
	const { format } = useI18n();

	const userSettings = useUserSettings();

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
				<ButtonContainer>
					<PrimaryButton onPress={() => onSaved(dateFormat)}>{format("global.save")}</PrimaryButton>
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
