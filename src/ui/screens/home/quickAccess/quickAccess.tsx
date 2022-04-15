import { useServices } from "@core/services";
import { I_QuickAccessElem } from "@domain/appState/type";
import { Stack } from "@ui/components/layout";
import { useI18n } from "@ui/i18n";
import { Routes, useRoutesNavigation } from "@ui/navigation/routes";
import { colors } from "@ui/styles/colors";
import { useObservable } from "micro-observables";
import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Tile } from "../components/Tile";
import { AlarmTile } from "./Alarm";
import { TimerTile } from "./Timer";

export const SleepTile = () => {
	const { appStateService } = useServices();
	const sleepMode = useObservable(appStateService.isInSleepMode);

	const sleepTextColor = sleepMode ? "white" : "black";
	const sleepBackGound = sleepMode ? colors.sleepBlue : "white";

	return (
		<Tile
			style={{ backgroundColor: sleepBackGound }}
			onPress={() => {
				appStateService.updateSleepMode(!sleepMode);
			}}
		>
			<Bold style={{ color: sleepTextColor }}>Sleep mode</Bold>
			<Light>{sleepMode ? "on" : "off"}</Light>
		</Tile>
	);
};

export const CalendarTile = () => {
	const navigation = useRoutesNavigation();
	return (
		<Tile onPress={() => navigation.navigate(Routes.Calendar)}>
			<Bold>Calendar</Bold>
		</Tile>
	);
};

export const QuickAccess: React.FC = () => {
	const { format } = useI18n();
	const [active, setActive] = useState<I_QuickAccessElem[] | undefined>([]);

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

	const { appStateService } = useServices();

	useEffect(() => {
		setActive(
			appStateService.quickAccess.get().active.length || appStateService.quickAccess.get().disabled.length
				? appStateService.quickAccess.get()?.active
				: _quickAccess
		);
		appStateService.quickAccess.subscribe((data) => {
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
		<Container gap={15}>
			{displaySleep && <SleepTile />}
			{displayAlarm && <AlarmTile />}
			{displayCalendar && <CalendarTile />}
			{displayTimer && <TimerTile />}
		</Container>
	);
};

const Container = styled(Stack)`
	height: 51px;
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
