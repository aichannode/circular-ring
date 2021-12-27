import { Routes, useRoutesNavigation } from "@ui/navigation/routes";
import { colors } from "@ui/styles/colors";
import React, { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { Stack } from "@ui/components/layout";
import styled from "styled-components/native";
import { useServices } from "@core/services";
import { I_Active } from "@domain/quickaccess/quickAccess";
import { AlarmTile } from "./Alarm";

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
		setActive(
			userQuickAccess.quickaccess.get().active.length || userQuickAccess.quickaccess.get().disabled.length
				? userQuickAccess.quickaccess.get()?.active
				: _quickAccess
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

	if (active?.length === 0) return null;

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
	border-right-width: 0.25px;
	border-left-width: 0.25px;
	border-color: ${colors.gray};
`;
