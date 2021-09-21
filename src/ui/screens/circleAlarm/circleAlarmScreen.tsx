import { SecondaryText, TertiaryText, TitleText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";
import { ScreenSection } from "@ui/screens/circleActivity/screenSection";
import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import React from "react";
import { Pressable, ScrollView } from "react-native";
import { Image } from "react-native";
import styled from "styled-components/native";
import { AlarmCard } from "./alarmCard";
import { SleepInformations } from "./sleepInformations";

export const CircleAlarmScreen: React.FC = () => {
	const navigation = useRoutesNavigation();
	const { format } = useI18n();

	return (
		<Container>
			<ScrollView>
				<ScreenSection>
					<SleepInformations style={{ marginBottom: 25, alignSelf: "center" }} />
					<TitleText>{format("alarm.score.programmed")}</TitleText>
				</ScreenSection>
				<AlarmContainer>
					<AlarmCard />
					<AddAlarmButton onPress={() => navigation.navigate(Routes.NewAlarm)}>
						<AddImage source={require("@assets/images/addButton.png")} />
						<SecondaryText>{format("alarm.score.add_button")}</SecondaryText>
					</AddAlarmButton>
				</AlarmContainer>
			</ScrollView>
		</Container>
	);
};

const Container = styled.View`
	flex: 1;
`;

const AlarmContainer = styled.View`
	background-color: ${colors.lightgray};
	padding: 25px 20px;
`;

const AddImage = styled(Image)`
	tint-color: ${colors.textSecondary};
	margin-right: 25px;
`;

const AddAlarmButton = styled(Pressable)`
	background-color: ${colors.gray + "80"};
	flex-direction: row;
	height: 67px;
	justify-content: center;
	align-items: center;
	border-radius: 5px;
`;
