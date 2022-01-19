import React, { useState, useRef } from "react";
import { TouchableOpacity, Switch, Platform } from "react-native";
import { MAX_ALARMS } from "@domain/circleAlarm/circleAlarmService";
import { useAlarms } from "@domain/circleAlarm/alarmHooks";
import { WarningBottomSheet } from "@ui/screens/circleAlarm/warningBottomSheet";
import { Weekdays, dateToAlarmTime, Melody, RingAlarm } from "@domain/ring/ringAlarm";
import DatePicker from "react-native-date-picker";
import { CircularBottomSheet, CircularBottomSheetHandle } from "@ui/components/bottomSheet/bottomSheet";
import { useServices } from "@core/services";
import styled from "styled-components/native";
import { colors } from "@ui/styles/colors";
import { useI18n } from "@ui/i18n";
import { ResponsiveCenterView } from "@ui/components/layout";
import { useObservable } from "micro-observables";

interface AlarmBottomSheetProps {
	onClose: () => void;
}

const AlarmBottomSheet: React.FC<AlarmBottomSheetProps> = () => {
	const { circleAlarmService } = useServices();
	const quickAccessAlarm = useObservable(circleAlarmService.quickAccessRingAlarmId);
	const [alarm, setAlarm] = useState(quickAccessAlarm?.isActivated);
	const [date, setDate] = useState(new Date());
	const [snooze, setSnooze] = useState(quickAccessAlarm?.snooze ? true : false);
	const [smart, setSmart] = useState(quickAccessAlarm?.smart ? true : false);

	const weekdays: Weekdays[] = [
		Weekdays.MONDAY,
		Weekdays.TUESDAY,
		Weekdays.WEDNESDAY,
		Weekdays.THURSDAY,
		Weekdays.FRIDAY,
		Weekdays.SATURDAY,
		Weekdays.SUNDAY,
	];

	const newAlarm = {
		id: 255,
		snooze: snooze ? 1 : 0,
		smart: smart ? 1 : 0,
		isSmart: false,
		weekdays,
		time: dateToAlarmTime(date),
		vibrationPower: 50,
		vibrationRepetition: 4,
		melody: Melody.ALERT,
		label: "QuickAccess",
		isActivated: false,
		isExisting: false,
	};
	const updateQuickAccessAlarm = async (_alarm: RingAlarm) => {
		if (quickAccessAlarm) {
			console.log("CIR-270 UPDATE QUICKACCESS ALARM", { ..._alarm });
			circleAlarmService.saveQuickAccessAlarm({ ..._alarm });
			console.log("CIR-270 UPDATE ALARM");
			circleAlarmService.updateAlarm({ ..._alarm });
		} else {
			console.log("CIR-270 ELSE");
			const response = await circleAlarmService.createAlarm(newAlarm);
			circleAlarmService.quickAccessRingAlarmId.set(response);
		}
	};
	return (
		<SheetContainer>
			<TextAndSwitchContainer>
				<Label>Alarm</Label>
				<SwitchButton
					style={{ transform: Platform.OS === "android" ? [{ scale: 1.5 }] : undefined }}
					ios_backgroundColor={colors.gray}
					trackColor={{ false: colors.gray, true: colors.blue }}
					thumbColor={colors.white}
					onValueChange={() => {
						updateQuickAccessAlarm({ ...newAlarm, ...quickAccessAlarm, isActivated: !alarm });
						setAlarm(!alarm);
					}}
					value={alarm}
				/>
			</TextAndSwitchContainer>
			<Divider />
			<DatePicker
				mode="time"
				date={date}
				onDateChange={(d) => {
					setDate(d);
					updateQuickAccessAlarm({ ...newAlarm, ...quickAccessAlarm, time: dateToAlarmTime(d) });
				}}
			/>
			<Divider />
			<TextAndSwitchContainer>
				<Label>Smart Alarm</Label>
				<SwitchButton
					style={{ transform: Platform.OS === "android" ? [{ scale: 1.5 }] : undefined }}
					ios_backgroundColor={colors.gray}
					trackColor={{ false: colors.gray, true: colors.blue }}
					thumbColor={colors.white}
					onValueChange={() => {
						setSmart(!smart);
						updateQuickAccessAlarm({ ...newAlarm, ...quickAccessAlarm, smart: !smart ? 1 : 0 });
					}}
					value={smart}
				/>
			</TextAndSwitchContainer>
			<TextAndSwitchContainer>
				<Label>Snooze</Label>
				<SwitchButton
					style={{ transform: Platform.OS === "android" ? [{ scale: 1.5 }] : undefined }}
					ios_backgroundColor={colors.gray}
					trackColor={{ false: colors.gray, true: colors.blue }}
					thumbColor={colors.white}
					onValueChange={() => {
						setSnooze(!snooze);
						updateQuickAccessAlarm({ ...newAlarm, ...quickAccessAlarm, snooze: !snooze ? 1 : 0 });
					}}
					value={snooze}
				/>
			</TextAndSwitchContainer>
		</SheetContainer>
	);
};

const SwitchButton = styled(Switch)`
	margin-right: 10px;
	border-color: ${colors.blue};
`;

const Divider = styled.View`
	border-bottom-width: 0.5px;
	border-bottom-color: ${colors.gray};
	height: 0;
	width: 80%;
	margin: 10%;
`;

const Label = styled.Text`
	font-size: 16px;
	font-weight: 500;
	line-height: 35px;
	color: ${colors.textSecondary};
`;

const TextAndSwitchContainer = styled.View`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	width: 100%;
	height: 35px;
`;

export const AlarmTile = () => {
	const AlarmBottomSheetRef = useRef<CircularBottomSheetHandle>(null);
	const warningBottomSheet = useRef<CircularBottomSheetHandle>(null);
	const { alarms } = useAlarms();
	const { format } = useI18n();
	const { circleAlarmService } = useServices();
	const quickAccessAlarm = useObservable(circleAlarmService.quickAccessRingAlarmId);

	const isAlarmOn = quickAccessAlarm && quickAccessAlarm.isActivated;
	return (
		<>
			<Tile style={{ borderLeftWidth: 0.5, borderRightWidth: 0.5, borderColor: colors.gray }}>
				<TouchableOpacity
					onPress={() => {
						alarms.length >= MAX_ALARMS
							? warningBottomSheet.current?.present()
							: AlarmBottomSheetRef.current?.present();
					}}
				>
					<Bold>
						{quickAccessAlarm
							? `${quickAccessAlarm.time.hour}:${("0" + quickAccessAlarm.time.minute).slice(-2)}`
							: "Alarm"}
					</Bold>
					<Light>{isAlarmOn ? "on" : "off"}</Light>
				</TouchableOpacity>
			</Tile>
			<CircularBottomSheet snapPoints={[500]} ref={AlarmBottomSheetRef}>
				<AlarmBottomSheet onClose={() => AlarmBottomSheetRef.current?.close()} />
			</CircularBottomSheet>
			<CircularBottomSheet snapPoints={[500]} ref={warningBottomSheet}>
				<WarningBottomSheet
					message={format("alarm.new.warning.description")}
					onClose={() => {
						warningBottomSheet.current?.close();
					}}
				/>
			</CircularBottomSheet>
		</>
	);
};

const Tile = styled.View`
	flex: 1;
	height: 50px;
	justify-content: center;
	border-right-width: 0.25px;
	border-left-width: 0.25px;
	border-color: ${colors.gray};
	background-color: white;
`;

const SheetContainer = styled(ResponsiveCenterView)`
	flex: 1;
	justify-content: space-between;
	align-items: center;
	padding-top: 30px;
	padding-bottom: 30px;
`;

const Light = styled.Text`
	color: ${colors.gray};
	text-align: center;
	font-size: 12px;
`;

const Bold = styled.Text`
	text-align: center;
	font-size: 14px;
`;
