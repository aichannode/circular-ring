import React from "react";
import styled from "styled-components/native";
import { AlarmTile } from "@ui/screens/home/quickAccess/Alarm";
import { SleepTile, CalendarTile } from "@ui/screens/home/quickAccess/quickAccess";
import { Stack } from "@ui/components/layout";

export const FakeQuiAccess = () => {
	return (
		<Container gap={15}>
			<SleepTile />
			<AlarmTile />
			<CalendarTile />
		</Container>
	);
};

const Container = styled(Stack)`
	height: 50px;
	margin-top: 10px;
	display: flex;
	flex-direction: row;
`;
