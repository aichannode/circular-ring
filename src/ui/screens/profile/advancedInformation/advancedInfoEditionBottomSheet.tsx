import {
	DietarySupplements,
	FertilityState,
	PhysicalDisability,
	PillPackFormat,
	SleepDisorder,
	SleepingPills,
	WorkTime,
} from "@domain/user/advancedInfo";
import { PrimaryButton } from "@ui/components/buttons";
import { ResponsiveCenterView } from "@ui/components/layout";
import { Spinner } from "@ui/components/spinner";
import { useI18n } from "@ui/i18n";
import { advanceInfoI18nKey } from "@ui/screens/profile/advancedInformation/profileAdvancedInfoI18n";
import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import React, { useCallback, useState } from "react";
import { Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import styled from "styled-components/native";
import { LocaleType, WordingKey } from "../../../../wordings";

export type EditionInfoType =
	| WorkTime
	| PhysicalDisability
	| SleepDisorder
	| SleepingPills
	| DietarySupplements
	| FertilityState
	| PillPackFormat
	| LocaleType;

export interface AdvancedInfoEditionConfig<T extends EditionInfoType> {
	title: string;
	description?: string;
	options: T[];
	translationSet: Map<T, WordingKey>;
	saveProcess: (option: T) => void;
}

interface AdvancedInfoEditionBottomSheetProps<T extends EditionInfoType> {
	config: AdvancedInfoEditionConfig<T>;
	currentOption: T;
	onClose: () => void;
}

export function AdvancedInfoEditionBottomSheet<T extends EditionInfoType>({
	config,
	currentOption,
	onClose,
}: AdvancedInfoEditionBottomSheetProps<T>) {
	const { format } = useI18n();

	const [selectedOption, setSelectedOption] = useState<T>(currentOption);
	const [isLoading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

	const save = useCallback(async () => {
		if (selectedOption === currentOption) {
			onClose();
			return;
		}
		setLoading(true);
		setErrorMessage(undefined);
		try {
			await config.saveProcess(selectedOption);
			setLoading(false);
			onClose();
		} catch (error) {
			setLoading(false);
			setErrorMessage(format("global.default_error"));
		}
	}, [selectedOption]);

	return (
		<Container horizontalPadding={0}>
			<TopContainer>
				<Title>{config.title}</Title>
				{config.description && <Description>{config.description}</Description>}
			</TopContainer>
			<StyledScrollView>
				{config.options.map((option) => {
					const selected = selectedOption === option;
					return (
						<Selector key={option.toString()} onPress={() => setSelectedOption(option)}>
							<Text>{format(advanceInfoI18nKey(config.translationSet, option))}</Text>
							<Check selected={selected}>
								{selected && <CheckIcon source={require("@assets/images/checkSmall.png")} tintColor={colors.white} />}
							</Check>
						</Selector>
					);
				})}
			</StyledScrollView>
			<BottomContainer>
				{errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}
				<ButtonContainer>
					{isLoading ? <Spinner size={24} /> : <PrimaryButton onPress={save}>{format("global.save")}</PrimaryButton>}
				</ButtonContainer>
			</BottomContainer>
		</Container>
	);
}

const Container = styled(ResponsiveCenterView)`
	flex: 1;
	justify-content: space-between;
	align-items: center;
`;

const TopContainer = styled.View`
	margin-top: 30px;
`;

const Title = styled.Text`
	${textStyles.mediumTitle};
	text-align: center;
`;

const Description = styled.Text`
	font-size: 14px;
	color: ${colors.textPrimary};
	text-align: center;
	margin-top: 30px;
	margin-bottom: 16px;
`;

const StyledScrollView = styled(ScrollView)`
	width: 100%;
	flex-grow: 0;
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
