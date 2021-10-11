import { useServices } from "@core/services";
import { useAlarms } from "@domain/circleAlarm/alarmHooks";
import { alarmTimeToDate, dateToAlarmTime, Melody, Weekdays } from "@domain/ring/ringAlarm";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
	CircularBottomScrollSheet,
	CircularBottomSheet,
	CircularBottomSheetHandle,
} from "@ui/components/bottomSheet/bottomSheet";
import { QuadraryButton } from "@ui/components/buttons";
import { Hour } from "@ui/components/hour";
import { ImageButton } from "@ui/components/imageButton";
import { InfoListHeader, InfoListItem } from "@ui/components/infoList";
import { Grow } from "@ui/components/layout";
import { CheckAlarmButton } from "@ui/components/navigation/checkButton";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { useI18n } from "@ui/i18n";
import { Routes, useAppRoute, useRoutesNavigation } from "@ui/navigation/routes";
import { IntervalBottomSheet } from "@ui/screens/circleAlarm/intervalBottomSheet";
import { LabelBottomSheet } from "@ui/screens/circleAlarm/labelBottomSheet";
import { RepeatBottomSheet } from "@ui/screens/circleAlarm/repeatBottomSheet";
import { VibrationBottomSheet } from "@ui/screens/circleAlarm/vibrationBottomSheet";
import { colors } from "@ui/styles/colors";
import React, { useLayoutEffect, useRef, useState } from "react";
import { Platform, View } from "react-native";
import styled from "styled-components/native";

export const EditAlarmScreen: React.FC = () => {
	const navigation = useRoutesNavigation();
	const route = useAppRoute<Routes.EditAlarm>();
	const { alarms: allAlarm } = useAlarms();
	const initialAlarm = route.params?.initialAlarm;
	const { format, formatDay, formatSnooze, formatSmart, formatMelody } = useI18n();
	const { circleAlarmService } = useServices();
	const [pickerVisible, setPickerVisible] = useState(false);
	const [alarmTime, setAlarmTime] = useState<Date>(initialAlarm ? alarmTimeToDate(initialAlarm.time) : new Date());
	const [vibrationPower, setVibrationPower] = useState(initialAlarm?.vibrationPower ?? 50);
	const [melody, setMelody] = useState<Melody>(initialAlarm?.melody ?? Melody.ALERT);
	const [weekdays, setWeekdays] = useState<Weekdays[]>(
		initialAlarm?.weekdays ?? [
			Weekdays.MONDAY,
			Weekdays.TUESDAY,
			Weekdays.WEDNESDAY,
			Weekdays.THURSDAY,
			Weekdays.FRIDAY,
		]
	);
	const [label, setLabel] = useState(
		initialAlarm?.label ?? format("alarm.label.default") + (allAlarm.length > 0 ? ` ${allAlarm.length + 1}` : "")
	);
	const [snooze, setSnooze] = useState(initialAlarm?.snooze ?? 0);
	const [smart, setSmart] = useState(initialAlarm?.smart ?? 0);
	const [isSmart, setIsSmart] = useState(initialAlarm?.isSmart ?? false);
	const vibrationBottomSheet = useRef<CircularBottomSheetHandle>(null);
	const repeatBottomSheet = useRef<CircularBottomSheetHandle>(null);
	const labelBottomSheet = useRef<CircularBottomSheetHandle>(null);
	const snoozeBottomSheet = useRef<CircularBottomSheetHandle>(null);
	const smartBottomSheet = useRef<CircularBottomSheetHandle>(null);

	const submitTime = (newValue: Date) => {
		setPickerVisible(false);
		setAlarmTime(newValue || alarmTime);
	};

	useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<CheckAlarmButton
					onPress={() => {
						const newAlarm = {
							snooze,
							smart,
							isSmart,
							weekdays,
							time: dateToAlarmTime(alarmTime),
							vibrationPower,
							vibrationRepetition: 4,
							melody,
							label,
						};
						if (initialAlarm) {
							circleAlarmService.updateAlarm({ ...initialAlarm, ...newAlarm });
						} else {
							circleAlarmService.createAlarm(newAlarm);
						}
					}}
				/>
			),
		});
	}, [snooze, smart, alarmTime, vibrationPower, label, isSmart, melody, weekdays]);

	return (
		<Container>
			{Platform.OS === "android" ? (
				<>
					<HourContainer>
						<Grow />
						<Hour value={alarmTime} style={{ fontSize: 36 }} onPress={() => setPickerVisible(true)} />
						<Grow>
							<View style={{ paddingLeft: 20, paddingTop: 4 }}>
								<EditTimeButton onPress={() => setPickerVisible(true)} source={require("@assets/images/pen.png")}>
									{format("alarm.new.time.edit")}
								</EditTimeButton>
							</View>
						</Grow>
					</HourContainer>
					{pickerVisible && (
						<DateTimePicker
							value={alarmTime}
							mode={"time"}
							is24Hour={true}
							onChange={(event: Event, selectedTime: Date | undefined) => {
								selectedTime ? submitTime(selectedTime) : setPickerVisible(false);
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
					textColor={colors.textPrimary}
					onChange={(event: Event, selectedTime: Date | undefined) => setAlarmTime(selectedTime || alarmTime)}
				/>
			)}

			<InfoListHeader>{format("alarm.new.other.title")}</InfoListHeader>

			<InfoListItem
				name={format("alarm.new.edit_vibration.title")}
				hasDisclosure
				value={formatMelody(melody)}
				action={() => vibrationBottomSheet.current?.present()}
			/>
			<InfoListItem
				name={format("alarm.new.repeat.title")}
				hasDisclosure
				value={formatDay(weekdays)}
				action={() => repeatBottomSheet.current?.present()}
			/>
			<InfoListItem
				name={format("alarm.new.label.title")}
				hasDisclosure
				value={label}
				action={() => labelBottomSheet.current?.present()}
			/>

			<InfoListItem
				style={{ marginTop: 20 }}
				name={isSmart ? format("alarm.new.smart_snooze.title") : format("alarm.new.snooze.title")}
				hasDisclosure
				value={formatSnooze(smart)}
				action={() => snoozeBottomSheet.current?.present()}
			/>
			<InfoListItem
				name={format("alarm.new.smart_alarm.title")}
				hasDisclosure
				value={formatSmart(snooze)}
				action={() => smartBottomSheet.current?.present()}
			/>

			<CircularBottomScrollSheet snapPoints={[2000]} ref={vibrationBottomSheet}>
				<VibrationBottomSheet
					vibrationPower={vibrationPower}
					melody={melody}
					onClose={async (vibrationPower, melody) => {
						await vibrationBottomSheet.current?.asyncClose();
						setVibrationPower(vibrationPower);
						setMelody(melody);
					}}
				/>
			</CircularBottomScrollSheet>
			<CircularBottomScrollSheet snapPoints={[700]} ref={repeatBottomSheet}>
				<RepeatBottomSheet
					weekdays={weekdays}
					onClose={async (value) => {
						await repeatBottomSheet.current?.asyncClose();
						setWeekdays(value);
					}}
				/>
			</CircularBottomScrollSheet>
			<CircularBottomSheet snapPoints={[400]} ref={labelBottomSheet}>
				<LabelBottomSheet
					label={label}
					onClose={async (label) => {
						await labelBottomSheet.current?.asyncClose();
						setLabel(label);
					}}
				/>
			</CircularBottomSheet>
			<CircularBottomScrollSheet snapPoints={[700]} ref={snoozeBottomSheet}>
				<IntervalBottomSheet
					value={snooze}
					isSmart={isSmart}
					snoozeDisplay
					onClose={async (value, isSmart) => {
						await snoozeBottomSheet.current?.asyncClose();
						setSnooze(value);
						setIsSmart(isSmart ?? false);
					}}
				/>
			</CircularBottomScrollSheet>
			<CircularBottomScrollSheet snapPoints={[700]} ref={smartBottomSheet}>
				<IntervalBottomSheet
					value={smart}
					onClose={async (value) => {
						await smartBottomSheet.current?.asyncClose();
						setSmart(value);
					}}
				/>
			</CircularBottomScrollSheet>
			{!!initialAlarm && (
				<QuadraryButton
					style={{ alignSelf: "center", width: 180, marginTop: 40 }}
					onPress={() => {
						circleAlarmService.deleteAlarm(initialAlarm);
						navigation.navigate(Routes.Alarm);
					}}
				>
					{format("alarm.delete")}
				</QuadraryButton>
			)}
		</Container>
	);
};

const Container = styled(ScrollScreen)`
	padding-vertical: 50px;
`;

const HourContainer = styled.View`
	margin-bottom: 50px;
	justify-content: center;
	align-items: center;
	flex-direction: row;
`;

const EditTimeButton = styled(ImageButton)`
	margin-left: 20px;
`;
