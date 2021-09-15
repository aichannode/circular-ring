import { Stack } from "@ui/components/layout";
import { useI18n } from "@ui/i18n";
import { ScreenSection } from "@ui/screens/circleActivity/screenSection";
import React from "react";
import { ScrollView } from "react-native";
import styled from "styled-components/native";

export const CircleAlarmScreen: React.FC = () => {
	const { format } = useI18n();

	return (
		<Container>
			<ScrollView>
				<ScreenSection title={format("alarm.score.programmed")} />
				<ElementStack gap={10}>
					<ColorTag />
				</ElementStack>
			</ScrollView>
		</Container>
	);
};

const Container = styled.View`
	flex: 1;
`;
const AlarmContainer = styled.View`
	flex-direction: row;
	background-color: pink;
	padding: 25px 20px;
`;
const ElementStack = styled(Stack)`
	padding: 25px 20px;
`;

const ColorTag = styled.View`
	flex-grow: 1;
	background-color: green;
	height: 100%;
	width: 5px;
`;
