import { useServices } from "@core/services";
import { Channel } from "@domain/device/channels";
import { PrimaryButton } from "@ui/components/buttons";
import { ResponsiveCenterView } from "@ui/components/layout";
import { Spinner } from "@ui/components/spinner";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import React, { useCallback, useState } from "react";
import { Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { WordingKey } from "src/wordings";
import styled from "styled-components/native";

export function DataModeBottomSheet({ onClose }: { onClose: () => void }) {
	const { format } = useI18n();
	const options: WordingKey[] = ["ring.data_mode.eco", "ring.data_mode.performance"];
	const { bleDeviceService, appStateService } = useServices();

	const [selectedOption, setSelectedOption] = useState<string>(
		appStateService.performanceMode.get() ? options[1] : options[0]
	);
	const [isLoading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

	const save = useCallback(async () => {
		setLoading(true);
		try {
			await bleDeviceService.write(`${Channel.MODE}${options[0] === selectedOption ? "0" : "1"}`);
			await appStateService.performanceMode.set(options[0] === selectedOption ? false : true);
			setLoading(false);
		} catch (error) {
			setLoading(false);
			setErrorMessage(format("global.default_error"));
		}
		onClose();
	}, [selectedOption]);

	return (
		<Container horizontalPadding={0}>
			<TopContainer>
				<Title>{format("ring.data_mode")}</Title>
				<Description>
					{format("ring.data_mode.desc.part1")}
					{selectedOption === options[0] ? <BoldText>4</BoldText> : <BoldText>2</BoldText>}
					{format("ring.data_mode.desc.part2")}
				</Description>
			</TopContainer>
			<StyledScrollView>
				<Selector onPress={() => setSelectedOption(options[0])}>
					<Text>{format(options[0])}</Text>
					<Check selected={selectedOption === options[0]}>
						<CheckIcon source={require("@assets/images/checkSmall.png")} tintColor={colors.white} />
					</Check>
				</Selector>
				<Selector onPress={() => setSelectedOption(options[1])}>
					<Text>{format(options[1])}</Text>
					<Check selected={selectedOption === options[1]}>
						<CheckIcon source={require("@assets/images/checkSmall.png")} tintColor={colors.white} />
					</Check>
				</Selector>
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

const BoldText = styled.Text`
	color: ${colors.orangeRed};
	font-weight: bold;
	font-size: 16px;
`;

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
