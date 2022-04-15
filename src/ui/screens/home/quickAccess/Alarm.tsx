import { useServices } from "@core/services";
import { useAlarms } from "@domain/circleAlarm/alarmHooks";
import { MAX_ALARMS } from "@domain/circleAlarm/circleAlarmService";
import { dateToAlarmTime, Melody, RingAlarm, Weekdays } from "@domain/ring/ringAlarm";
import { CircularBottomSheet, CircularBottomSheetHandle } from "@ui/components/bottomSheet/bottomSheet";
import { ResponsiveCenterView } from "@ui/components/layout";
import { useI18n } from "@ui/i18n";
import { WarningBottomSheet } from "@ui/screens/circleAlarm/warningBottomSheet";
import { colors } from "@ui/styles/colors";
import { useObservable } from "micro-observables";
import React, { useRef, useState } from "react";
import { Platform, Switch } from "react-native";
import DatePicker from "react-native-date-picker";
import styled from "styled-components/native";
import { Tile } from "../components/Tile";

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
			circleAlarmService.saveQuickAccessAlarm({ ..._alarm });
			circleAlarmService.updateAlarm({ ..._alarm });
		} else {
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
			<Tile
				style={{ borderLeftWidth: 0.5, borderRightWidth: 0.5, borderColor: colors.gray }}
				onPress={() => {
					alarms.length >= MAX_ALARMS ? warningBottomSheet.current?.present() : AlarmBottomSheetRef.current?.present();
				}}
			>
				<Bold>
					{quickAccessAlarm
						? `${quickAccessAlarm.time.hour}:${("0" + quickAccessAlarm.time.minute).slice(-2)}`
						: "Alarm"}
				</Bold>
				<Light>{isAlarmOn ? "on" : "off"}</Light>
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
