// import { useI18n } from "@ui/i18n";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";
import { colors } from "@ui/styles/colors";
import React, { useState, useEffect, useRef } from "react";
import { TouchableOpacity } from "react-native";
import { Stack, ResponsiveCenterView } from "@ui/components/layout";
import { CircularBottomSheet, CircularBottomSheetHandle } from "@ui/components/bottomSheet/bottomSheet";
import styled from "styled-components/native";
import RNSiwtch from "@estebanleclet/react-native-reanimated-switch-ts";
import DatePicker from "react-native-date-picker";
import { useServices } from "@core/services";
import { I_Active } from "@domain/quickaccess/quickAccess";

import { TimerTile } from "./Timer";
import { useI18n } from "@ui/i18n";

const SleepTile = () => {
	// const { format } = useI18n();
	const [sleepMode, setSleepMode] = useState<boolean>(false);

	useEffect(() => {
		console.log("SLEEP MODE = ", sleepMode);
	}, [sleepMode]);

	const sleepTextColor = sleepMode ? "white" : "black";
	const sleepBackGound = sleepMode ? colors.sleepBlue : "white";

	return (
		<Tile style={{ backgroundColor: sleepBackGound }}>
			<TouchableOpacity
				onPress={() => {
					setSleepMode(!sleepMode);
				}}
			>
				<Bold style={{ color: sleepTextColor }}>Sleep mode</Bold>
				<Light>{sleepMode ? "on" : "off"}</Light>
			</TouchableOpacity>
		</Tile>
	);
};

interface AlarmBottomSheetProps {
	onClose: () => void;
}

const AlarmBottomSheet: React.FC<AlarmBottomSheetProps> = () => {
	const [alarm, setAlarm] = useState(false);
	const [date, setDate] = useState(new Date());

	return (
		<SheetContainer>
			<TextAndSwitchContainer>
				<Label>Alarm</Label>
				<RNSiwtch
					handleOnPress={() => setAlarm(!alarm)}
					activeTrackColor={colors.orangeRed}
					thumbStyle={{ borderWidth: 1, borderColor: colors.orangeRed }}
					containerStyle={{ borderWidth: 1, borderColor: colors.orangeRed }}
					inActiveTrackColor="white"
					thumbColor="white"
					value={alarm}
				></RNSiwtch>
			</TextAndSwitchContainer>
			<Divider />
			<DatePicker mode="time" date={date} onDateChange={setDate} />
			<Divider />
			<TextAndSwitchContainer>
				<Label>Smart Alarm</Label>
				<RNSiwtch
					handleOnPress={() => setAlarm(!alarm)}
					activeTrackColor={colors.orangeRed}
					thumbStyle={{ borderWidth: 1, borderColor: colors.orangeRed }}
					containerStyle={{ borderWidth: 1, borderColor: colors.orangeRed }}
					inActiveTrackColor="white"
					thumbColor="white"
					value={alarm}
				></RNSiwtch>
			</TextAndSwitchContainer>
			<TextAndSwitchContainer>
				<Label>Snooze</Label>
				<RNSiwtch
					handleOnPress={() => setAlarm(!alarm)}
					activeTrackColor={colors.orangeRed}
					thumbStyle={{ borderWidth: 1, borderColor: colors.orangeRed }}
					containerStyle={{ borderWidth: 1, borderColor: colors.orangeRed }}
					inActiveTrackColor="white"
					thumbColor="white"
					value={alarm}
				></RNSiwtch>
			</TextAndSwitchContainer>
		</SheetContainer>
	);
};

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

const AlarmTile = () => {
	const AlarmBottomSheetRef = useRef<CircularBottomSheetHandle>(null);
	// const [date, setDate] = useState(new Date());

	return (
		<>
			<Tile style={{ borderLeftWidth: 0.5, borderRightWidth: 0.5, borderColor: colors.gray }}>
				<TouchableOpacity
					onPress={() => {
						AlarmBottomSheetRef.current?.present();
					}}
				>
					<Bold>9:00 AM</Bold>
					<Light>off</Light>
				</TouchableOpacity>
			</Tile>
			<CircularBottomSheet allowSwipeDownToClose={false} snapPoints={[480]} ref={AlarmBottomSheetRef}>
				<AlarmBottomSheet onClose={() => AlarmBottomSheetRef.current?.close()} />
			</CircularBottomSheet>
		</>
	);
};

const CalendarTile = () => {
	const navigation = useRoutesNavigation();
	return (
		<Tile>
			<TouchableOpacity onPress={() => navigation.navigate(Routes.Calendar)}>
				<Bold>Calendar</Bold>
			</TouchableOpacity>
		</Tile>
	);
};

export const QuickAccess: React.FC = () => {
	const { format } = useI18n();
	const [active, setActive] = useState<I_Active[] | undefined>([]);

	const _quickAccess = [
		{
			title: format("quickaccess.sleeptitle"),
			desc: format("quickaccess.sleepdesc"),
			id: "sleep",
		},
		{
			title: format("quickaccess.alarmtitle"),
			desc: format("quickaccess.alarmdesc"),
			id: "alarm",
		},
		{
			title: format("quickaccess.calendartitle"),
			desc: format("quickaccess.calendardesc"),
			id: "calendar",
		},
	];

	const { userQuickAccess } = useServices();

	useEffect(() => {
		console.log("CIR-275 Get quickaccess", userQuickAccess.quickaccess.get().active);
		setActive(
			userQuickAccess.quickaccess.get().active.length ? userQuickAccess.quickaccess.get()?.active : _quickAccess
		);
		userQuickAccess.quickaccess.subscribe((data) => {
			if (data?.active) {
				setActive(data?.active);
			}
		});
	}, []);

	const displaySleep = active?.map((t) => t.id).indexOf("sleep") !== -1;
	const displayAlarm = active?.map((t) => t.id).indexOf("alarm") !== -1;
	const displayTimer = active?.map((t) => t.id).indexOf("timer") !== -1;
	const displayCalendar = active?.map((t) => t.id).indexOf("calendar") !== -1;

	return (
		<>
			<Container gap={15}>
				{displaySleep && <SleepTile />}
				{displayAlarm && <AlarmTile />}
				{displayCalendar && <CalendarTile />}
				{displayTimer && <TimerTile />}
			</Container>
		</>
	);
};

const SheetContainer = styled(ResponsiveCenterView)`
	flex: 1;
	justify-content: space-between;
	align-items: center;
	padding-top: 30px;
`;

const Container = styled(Stack)`
	background-color: ${colors.white};
	height: 50px;
	margin-top: 10px;
	display: flex;
	flex-direction: row;
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

const Tile = styled.View`
	flex: 1;
	height: 50px;
	justify-content: center;
	border-right-width: 0.25;
	border-left-width: 0.25;
	border-color: ${colors.gray};
`;
