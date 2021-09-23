import { useAlarms } from "@domain/circleAlarm/alarmHooks";
import { useI18n } from "@ui/i18n";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";
import { ScreenSection } from "@ui/screens/circleActivity/screenSection";
import { colors } from "@ui/styles/colors";
import React from "react";
import { Image, Pressable, ScrollView } from "react-native";
import styled from "styled-components/native";
import { AlarmCard } from "./alarmCard";

export const CircleAlarmScreen: React.FC = () => {
	const navigation = useRoutesNavigation();
	const alarms = useAlarms();
	const { format } = useI18n();
	console.log(alarms);

	return (
		<Container>
			<ScrollView>
				<ScreenSection title={format("alarm.score.programmed")} />
				<AlarmContainer>
					{alarms?.map((value) => (
						<AlarmCard key={value.id} data={value} />
					))}
					<AddAlarmButton onPress={() => navigation.navigate(Routes.NewAlarm)}>
						<AddImage source={require("@assets/images/addButton.png")} />
						<AddAlarmText>{format("alarm.score.add_button")}</AddAlarmText>
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
	tint-color: ${colors.darkGray};
	margin-right: 25px;
`;

const AddAlarmText = styled.Text`
	font-size: 16px;
	color: ${colors.darkGray};
`;

const AddAlarmButton = styled(Pressable)`
	background-color: ${colors.gray + "80"};
	flex-direction: row;
	height: 67px;
	justify-content: center;
	align-items: center;
	border-radius: 5px;
`;
