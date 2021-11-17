import React, { useState, useEffect, useRef } from "react";
import { TouchableOpacity, Switch, Platform } from "react-native";
import { MAX_ALARMS } from "@domain/circleAlarm/circleAlarmService";
import { useAlarms } from "@domain/circleAlarm/alarmHooks";
import { WarningBottomSheet } from "@ui/screens/circleAlarm/warningBottomSheet";
import { Weekdays, dateToAlarmTime, Melody, RingAlarm } from "@domain/ring/ringAlarm";
import { useAutoConnectState } from "@domain/device/hooks";
import { DeviceAutoConnectState } from "@domain/device/bleDeviceService";
import DatePicker from "react-native-date-picker";
import { CircularBottomSheet, CircularBottomSheetHandle } from "@ui/components/bottomSheet/bottomSheet";
import { useServices } from "@core/services";
import styled from "styled-components/native";
import { colors } from "@ui/styles/colors";
import { useI18n } from "@ui/i18n";
import { ResponsiveCenterView } from "@ui/components/layout";

interface AlarmBottomSheetProps {
	onClose: () => void;
}

const AlarmBottomSheet: React.FC<AlarmBottomSheetProps> = () => {
	const [alarm, setAlarm] = useState(false);
	const [date, setDate] = useState(new Date());

	const weekdays: Weekdays[] = [
		Weekdays.MONDAY,
		Weekdays.TUESDAY,
		Weekdays.WEDNESDAY,
		Weekdays.THURSDAY,
		Weekdays.FRIDAY,
	];
	const [snooze, setSnooze] = useState(false);
	const [smart, setSmart] = useState(false);
	const { circleAlarmService } = useServices();

	const { alarms, loadAlarms } = useAlarms();
	const autoConnectState = useAutoConnectState();
	const [quickAccessAlarm, setQuickAccessAlarm] = useState<RingAlarm | null>(null);

	const isAlarmOn = quickAccessAlarm && quickAccessAlarm.isActivated;
	useEffect(() => {
		console.log("CIR-270 useEffect", quickAccessAlarm, isAlarmOn, alarm);
		if (isAlarmOn) {
			setAlarm(true);
		}
	}, [quickAccessAlarm]);

	useEffect(() => {
		setQuickAccessAlarm(circleAlarmService.quickAccessRingAlarmId.get());
		circleAlarmService.quickAccessRingAlarmId.subscribe((alarm) => {
			setQuickAccessAlarm(alarm);
		});
	}, []);

	useEffect(() => {
		if (autoConnectState === DeviceAutoConnectState.CONNECTED) {
			loadAlarms();
		}
	}, [loadAlarms, autoConnectState]);

	console.log("ALARMS", alarms);

	console.log("CIR-270 alarm", alarm);

	const checkForExistingQuickAccessAlarm = async () => {
		const newAlarm = {
			snooze: snooze ? 1 : 0,
			smart: smart ? 1 : 0,
			isSmart: false,
			weekdays,
			time: dateToAlarmTime(date),
			vibrationPower: 50,
			vibrationRepetition: 4,
			melody: Melody.ALERT,
			label: "QuickAccess",
		};

		console.log("Alarm : ", alarm, " isAlarmOn: ", isAlarmOn);
		if (alarm && alarm !== isAlarmOn) {
			if (quickAccessAlarm) {
				console.log("CIR-270 UPDATE QUICKACCESS ALARM", { ...quickAccessAlarm, ...newAlarm });
				circleAlarmService.saveQuickAccessAlarm({ ...quickAccessAlarm, ...newAlarm, isActivated: true });
				circleAlarmService.updateAlarm({ ...quickAccessAlarm, ...newAlarm, isActivated: true });
			} else {
				console.log("CIR-270 ELSE");
				const response = await circleAlarmService.createAlarm(newAlarm);
				circleAlarmService.quickAccessRingAlarmId.set(response);
			}
		} else if (isAlarmOn && alarm !== isAlarmOn) {
			// put the existing alarm to off;
			circleAlarmService.updateAlarm({ ...quickAccessAlarm, isActivated: true });
		}
	};

	useEffect(() => {
		checkForExistingQuickAccessAlarm();
	}, [alarm, date]);

	return (
		<SheetContainer>
			<TextAndSwitchContainer>
				<Label>Alarm</Label>
				<SwitchButton
					style={{ transform: Platform.OS === "android" ? [{ scale: 1.5 }] : undefined }}
					ios_backgroundColor={colors.gray}
					trackColor={{ false: colors.gray, true: colors.blue }}
					thumbColor={colors.white}
					onValueChange={() => setAlarm(!alarm)}
					value={alarm}
				/>
			</TextAndSwitchContainer>
			<Divider />
			<DatePicker mode="time" date={date} onDateChange={setDate} />
			<Divider />
			<TextAndSwitchContainer>
				<Label>Smart Alarm</Label>
				<SwitchButton
					style={{ transform: Platform.OS === "android" ? [{ scale: 1.5 }] : undefined }}
					ios_backgroundColor={colors.gray}
					trackColor={{ false: colors.gray, true: colors.blue }}
					thumbColor={colors.white}
					onValueChange={() => setSmart(!alarm)}
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
					onValueChange={() => setSnooze(!snooze)}
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
	const [quickAccessAlarm, setQuickAccessAlarm] = useState<RingAlarm | null>(null);

	const isAlarmOn = quickAccessAlarm && quickAccessAlarm.isActivated;

	circleAlarmService.quickAccessRingAlarmId.subscribe((alarm) => {
		setQuickAccessAlarm(alarm);
		console.log("CIR-270 UPDATE", alarm);
	});
	useEffect(() => {
		setQuickAccessAlarm(circleAlarmService.quickAccessRingAlarmId.get());
	}, []);

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
					<Bold>{quickAccessAlarm ? `${quickAccessAlarm.time.hour}:${quickAccessAlarm.time.minute}` : "Alarm"}</Bold>
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
	border-right-width: 0.25;
	border-left-width: 0.25;
	border-color: ${colors.gray};
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
