import { Melody } from "@domain/ring/ringAlarm";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import DateTimePicker from "@react-native-community/datetimepicker";
import { CircularBottomScrollSheet, CircularBottomSheet } from "@ui/components/bottomSheet";
import { SimpleTextButton } from "@ui/components/buttons";
import { Hour } from "@ui/components/hour";
import { SecondaryText, TitleText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { VibrationBottomSheet } from "@ui/screens/circleAlarm/vibrationBottomSheet";
import { colors } from "@ui/styles/colors";
import React, { useRef, useState } from "react";
import { Image, Platform, Pressable } from "react-native";
import styled from "styled-components/native";

export const NewAlarmScreen: React.FC = () => {
	const { format } = useI18n();
	const [pickerVisible, setPickerVisible] = useState(false);
	const [alarmTime, setAlarmTime] = useState(new Date());
	const [vibrationPower, setVibrationPower] = useState(50);
	const [melody, setMelody] = useState<Melody>(Melody.ALERT);
	const [label, setLabel] = useState("Alarm");
	const [snooze, setSnooze] = useState(0);
	const [smart, setSmart] = useState(0);

	const vibrationBottomSheet = useRef<BottomSheetModal>(null);

	const submit = (newValue: Date) => {
		setPickerVisible(false);
		setAlarmTime(newValue || alarmTime);
	};

	return (
		<Container>
			{Platform.OS === "android" ? (
				<>
					<HourContainer>
						<Hour
							value={alarmTime}
							style={{
								fontSize: 30,
							}}
							onPress={() => setPickerVisible(true)}
						/>
						<EditTimeButton onPress={() => setPickerVisible(true)}>{format("alarm.new.time.edit")}</EditTimeButton>
					</HourContainer>
					{pickerVisible && (
						<DateTimePicker
							value={alarmTime}
							mode={"time"}
							is24Hour={true}
							// display="spinner"
							onChange={(event, selectedTime) => {
								event.type !== "dismissed" && selectedTime ? submit(selectedTime) : setPickerVisible(false);
							}}
						/>
					)}
				</>
			) : (
				<DateTimePicker
					value={alarmTime}
					mode={"time"}
					is24Hour={true}
					display="spinner"
					onChange={(event, selectedTime) => setAlarmTime(selectedTime || alarmTime)}
				/>
			)}

			<Title>{format("alarm.new.other.title")}</Title>

			<OtherButtonContainer onPress={() => vibrationBottomSheet.current?.present()}>
				<SecondaryTitle>{format("alarm.new.edit_vibration.title")}</SecondaryTitle>
				<PreviewContainer>
					<Tips>{format("alarm.new.edit_vibration.type." + melody)}</Tips>
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
			{/* <OtherButtonContainer>
				<SecondaryTitle>{format("alarm.new.smart_snooze.title")}</SecondaryTitle>
				<PreviewContainer>
					<Tips>{format("alarm.new.snooze.off")}</Tips>
					<Arrow source={require("@assets/images/topArrowGrey.png")} />
				</PreviewContainer>
			</OtherButtonContainer> */}
			<OtherButtonContainer>
				<SecondaryTitle>{format("alarm.new.smart_alarm.title")}</SecondaryTitle>
				<PreviewContainer>
					<Tips>{format("alarm.new.snooze.off")}</Tips>
					<Arrow source={require("@assets/images/topArrowGrey.png")} />
				</PreviewContainer>
			</OtherButtonContainer>

			<CircularBottomScrollSheet snapPoints={[800]} ref={vibrationBottomSheet}>
				<VibrationBottomSheet
					vibrationPower={vibrationPower}
					melody={melody}
					onClose={(vibrationPower, melody) => {
						setVibrationPower(vibrationPower);
						setMelody(melody);
						vibrationBottomSheet.current?.close();
					}}
				/>
			</CircularBottomScrollSheet>
		</Container>
	);
};

const Container = styled.View`
	flex: 1;
`;

const HourContainer = styled.View`
	margin-top: 100px;
	margin-bottom: 85px;
	justify-content: center;
	align-items: center;
`;

const EditTimeButton = styled(SimpleTextButton)`
	margin-top: 15px;
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
