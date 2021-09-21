import { SecondaryText, TitleText } from "@ui/components/text";
import React, { useState } from "react";
import styled from "styled-components/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Image, Platform, Pressable } from "react-native";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";

export const NewAlarmScreen: React.FC = () => {
	const [time, setTime] = useState(new Date());

	const { format } = useI18n();

	return (
		<Container>
			{Platform.OS === "android" ? (
				<DateTimePicker
					value={time}
					mode={"time"}
					is24Hour={true}
					display="spinner"
					onChange={(event, selectedTime) => setTime(selectedTime || time)}
				/>
			) : (
				<DateTimePicker
					value={time}
					mode={"time"}
					is24Hour={true}
					display="spinner"
					onChange={(event, selectedTime) => setTime(selectedTime || time)}
				/>
			)}

			<Title>{format("alarm.new.other.title")}</Title>

			<OtherButtonContainer>
				<SecondaryTitle>{format("alarm.new.edit_vibration.title")}</SecondaryTitle>
				<PreviewContainer>
					<Tips>{format("alarm.new.edit_vibration.alert")}</Tips>
					<Arrow source={require("@assets/images/topArrowGrey.png")} />
				</PreviewContainer>
			</OtherButtonContainer>
			<OtherButtonContainer>
				<SecondaryTitle>{format("alarm.new.repeat.title")}</SecondaryTitle>
				<PreviewContainer>
					<Tips>{format("alarm.new.repeat.friday")}</Tips>
					<Arrow source={require("@assets/images/topArrowGrey.png")} />
				</PreviewContainer>
			</OtherButtonContainer>
			<OtherButtonContainer>
				<SecondaryTitle>{format("alarm.new.label.title")}</SecondaryTitle>
				<PreviewContainer>
					<Tips>{"Alarm"}</Tips>
					<Arrow source={require("@assets/images/topArrowGrey.png")} />
				</PreviewContainer>
			</OtherButtonContainer>

			<OtherButtonContainer style={{ marginTop: 19 }}>
				<SecondaryTitle>{format("alarm.new.snooze.title")}</SecondaryTitle>
				<PreviewContainer>
					<Tips>{format("alarm.new.snooze.off")}</Tips>
					<Arrow source={require("@assets/images/topArrowGrey.png")} />
				</PreviewContainer>
			</OtherButtonContainer>
			<OtherButtonContainer>
				<SecondaryTitle>{format("alarm.new.smart_snooze.title")}</SecondaryTitle>
				<PreviewContainer>
					<Tips>{format("alarm.new.snooze.off")}</Tips>
					<Arrow source={require("@assets/images/topArrowGrey.png")} />
				</PreviewContainer>
			</OtherButtonContainer>
			<OtherButtonContainer>
				<SecondaryTitle>{format("alarm.new.smart_alarm.title")}</SecondaryTitle>
				<PreviewContainer>
					<Tips>{format("alarm.new.snooze.off")}</Tips>
					<Arrow source={require("@assets/images/topArrowGrey.png")} />
				</PreviewContainer>
			</OtherButtonContainer>
		</Container>
	);
};

const Container = styled.View`
	flex: 1;
`;

const Title = styled(TitleText)`
	margin: 20px;
`;

const SecondaryTitle = styled(SecondaryText)`
	flex-grow: 1;
	margin-left: 20px;
`;
const OtherButtonContainer = styled(Pressable)`
	flex-direction: row;
	align-items: center;
	height: 50px;
	justify-content: space-between;
	margin-bottom: 1px;
	background-color: ${colors.lightgray};
`;

const Tips = styled(SecondaryText)`
	margin-horizontal: 14px;
`;

const Arrow = styled(Image)`
	margin-right: 20px;
`;

const PreviewContainer = styled.View`
	flex-grow: 1;
	align-items: center;
	justify-content: flex-end;
	flex-direction: row;
`;
