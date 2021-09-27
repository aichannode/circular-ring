import { useServices } from "@core/services";
import { Melody, Weekdays } from "@domain/ring/ringAlarm";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { CircularBottomScrollSheet, CircularBottomSheet } from "@ui/components/bottomSheet";
import { SimpleTextButton } from "@ui/components/buttons";
import { Hour } from "@ui/components/hour";
import { CheckAlarmButton } from "@ui/components/navigation/checkButton";
import { SecondaryText, TitleText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { IntervalBottomSheet } from "@ui/screens/circleAlarm/intervalBottomSheet";
import { LabelBottomSheet } from "@ui/screens/circleAlarm/labelBottomSheet";
import { RepeatBottomSheet } from "@ui/screens/circleAlarm/repeatBottomSheet";
import { VibrationBottomSheet } from "@ui/screens/circleAlarm/vibrationBottomSheet";
import { colors } from "@ui/styles/colors";
import React, { useLayoutEffect, useRef, useState } from "react";
import { Image, Platform, Pressable } from "react-native";
import styled from "styled-components/native";

export const NewAlarmScreen: React.FC = () => {
	const { format } = useI18n();
	const navigation = useNavigation();
	const { circleAlarmService } = useServices();
	const [pickerVisible, setPickerVisible] = useState(false);
	const [alarmTime, setAlarmTime] = useState(new Date());
	const [vibrationPower, setVibrationPower] = useState(50);
	const [melody, setMelody] = useState<Melody>(Melody.ALERT);
	const [weekdays, setWeekdays] = useState<Weekdays[]>([
		Weekdays.MONDAY,
		Weekdays.TUESDAY,
		Weekdays.WEDNESDAY,
		Weekdays.THURSDAY,
		Weekdays.FRIDAY,
	]);
	const [label, setLabel] = useState("Alarm");
	const [snooze, setSnooze] = useState(0);
	const [smart, setSmart] = useState(0);
	const [isSmart, setIsSmart] = useState(false);
	const vibrationBottomSheet = useRef<BottomSheetModal>(null);
	const repeatBottomSheet = useRef<BottomSheetModal>(null);
	const labelBottomSheet = useRef<BottomSheetModal>(null);
	const snoozeBottomSheet = useRef<BottomSheetModal>(null);
	const smartBottomSheet = useRef<BottomSheetModal>(null);

	const submitTime = (newValue: Date) => {
		setPickerVisible(false);
		setAlarmTime(newValue || alarmTime);
	};

	useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<CheckAlarmButton
					onPress={() =>
						circleAlarmService.createAlarm({
							snooze,
							smart,
							isSmart,
							weekdays,
							time: alarmTime,
							vibrationPower,
							vibrationRepetition: 1,
							melody,
							label,
						})
					}
				/>
			),
		});
	}, [snooze, smart, alarmTime, vibrationPower, label, isSmart, melody, weekdays]);

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
							onChange={(event, selectedTime) => {
								event.type !== "dismissed" && selectedTime ? submitTime(selectedTime) : setPickerVisible(false);
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
			<OtherButtonContainer onPress={() => repeatBottomSheet.current?.present()}>
				<SecondaryTitle>{format("alarm.new.repeat.title")}</SecondaryTitle>
				<PreviewContainer>
					<Tips>{format("alarm.new.repeat.friday")}</Tips>
					<Arrow source={require("@assets/images/topArrowGrey.png")} />
				</PreviewContainer>
			</OtherButtonContainer>
			<OtherButtonContainer onPress={() => labelBottomSheet.current?.present()}>
				<SecondaryTitle>{format("alarm.new.label.title")}</SecondaryTitle>
				<PreviewContainer>
					<Tips>{label}</Tips>
					<Arrow source={require("@assets/images/topArrowGrey.png")} />
				</PreviewContainer>
			</OtherButtonContainer>

			<OtherButtonContainer style={{ marginTop: 19 }} onPress={() => snoozeBottomSheet.current?.present()}>
				<SecondaryTitle>
					{isSmart ? format("alarm.new.snooze.title") : format("alarm.new.smart_snooze.title")}
				</SecondaryTitle>
				<PreviewContainer>
					<Tips>{format("alarm.new.snooze.off")}</Tips>
					<Arrow source={require("@assets/images/topArrowGrey.png")} />
				</PreviewContainer>
			</OtherButtonContainer>
			<OtherButtonContainer onPress={() => smartBottomSheet.current?.present()}>
				<SecondaryTitle>{format("alarm.new.smart_alarm.title")}</SecondaryTitle>
				<PreviewContainer>
					<Tips>{format("alarm.new.snooze.off")}</Tips>
					<Arrow source={require("@assets/images/topArrowGrey.png")} />
				</PreviewContainer>
			</OtherButtonContainer>

			<CircularBottomScrollSheet snapPoints={[820]} ref={vibrationBottomSheet}>
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
			<CircularBottomScrollSheet snapPoints={[700]} ref={repeatBottomSheet}>
				<RepeatBottomSheet
					weekdays={weekdays}
					onClose={(value) => {
						setWeekdays(value);
						repeatBottomSheet.current?.close();
					}}
				/>
			</CircularBottomScrollSheet>
			<CircularBottomSheet snapPoints={[500]} ref={labelBottomSheet}>
				<LabelBottomSheet
					label={label}
					onClose={(label) => {
						setLabel(label);
						labelBottomSheet.current?.close();
					}}
				/>
			</CircularBottomSheet>
			<CircularBottomScrollSheet snapPoints={[700]} ref={snoozeBottomSheet}>
				<IntervalBottomSheet
					value={snooze}
					isSmart={isSmart}
					snoozeDisplay
					onClose={(value, isSmart) => {
						setSnooze(value);
						setIsSmart(isSmart ?? false);
						snoozeBottomSheet.current?.close();
					}}
				/>
			</CircularBottomScrollSheet>
			<CircularBottomScrollSheet snapPoints={[700]} ref={smartBottomSheet}>
				<IntervalBottomSheet
					value={smart}
					onClose={(value) => {
						setSmart(value);
						smartBottomSheet.current?.close();
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
