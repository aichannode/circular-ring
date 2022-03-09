import { useRepresentations } from "@core/representation";
import { CalendarNote } from "@domain/calendar/calendar";
import { Grow } from "@ui/components/layout";
import { TimeEditor, TimeEditorRef } from "@ui/components/timeEditor";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleProp, TouchableOpacity, ViewStyle } from "react-native";
import styled from "styled-components/native";

interface CalendarNoteItemProps {
	note: CalendarNote;
	color?: string;
	style?: StyleProp<ViewStyle>;
	canDelete?: boolean;
	tags: CalendarNote[];
}
interface TimeEditorConfig {
	time: Date;
	title: string;
	description: string;
	saveTime: (time: Date) => void;
}

export const CalendarNoteItem: React.FC<CalendarNoteItemProps> = observer(function CalendarNoteItem({
	note,
	tags,
	color,
	canDelete = false,
	style,
}) {
	const { format, formatHour, formatNoteIntervalLinker } = useI18n();
	const [startTime, setStartDate] = useState(note.startTime);
	const [endTime, setEndDate] = useState(note.endTime);
	const {
		calendar: {
			actions: { updateNote, deleteNote },
		},
	} = useRepresentations();
	const startTimeEditionConfig = {
		title: format("calendar.edit_start.title"),
		description: format("calendar.edit_start.description"),
		saveTime: setStartDate,
	};

	const endTimeEditionConfig = {
		title: format("calendar.edit_end.title"),
		description: format("calendar.edit_end.description"),
		saveTime: setEndDate,
	};

	const [config, setConfig] = useState<TimeEditorConfig>({ ...startTimeEditionConfig, time: startTime });
	const timeEditorRef = useRef<TimeEditorRef>(null);

	useEffect(
		action(() => {
			if (startTime !== note.startTime || endTime !== note.endTime) {
				// avoid first Render
				updateNote({
					...note,
					startTime,
					endTime,
				});
			}
		}),
		[startTime, endTime]
	);

	return (
		<>
			<Container style={style}>
				<NoteColor color={color} />
				<Name>{note.tag.name}</Name>
				<Grow />
				{/* <Value numberOfLines={1} ellipsizeMode={"tail"}>
					{formatDateInterval(note.startTime, note.endTime)}
				</Value> */}
				<EditableNoteHourContainer>
					<TouchableOpacity
						onPress={async () => {
							setConfig({ ...startTimeEditionConfig, time: startTime });
							timeEditorRef.current?.present();
						}}
					>
						<Value>{formatHour(note.startTime)}</Value>
					</TouchableOpacity>
					<Value>{formatNoteIntervalLinker()}</Value>
					<TouchableOpacity
						onPress={async () => {
							setConfig({ ...endTimeEditionConfig, time: endTime });
							timeEditorRef.current?.present();
						}}
					>
						<Value>{formatHour(note.endTime)}</Value>
					</TouchableOpacity>
				</EditableNoteHourContainer>
				{canDelete && (
					<Pressable onPress={() => deleteNote(note)}>
						<DeleteText>{format("calendar.delete_note")}</DeleteText>
					</Pressable>
				)}
				<TimeEditor
					ref={timeEditorRef}
					defaultTime={config.time}
					title={config.title}
					description={config.description}
					saveTime={config.saveTime}
				/>
			</Container>
		</>
	);
});

const Container = styled.View`
	width: 100%;
	height: 50px;
	padding-right: 20px;
	flex-direction: row;
	align-items: center;
	background-color: ${colors.lightgray};
`;

const NoteColor = styled.View<{ color?: string }>`
	height: 100%;
	width: 5px;
	${({ color }) => color && `background-color: ${color}`};
`;

const Name = styled.Text`
	${textStyles.primary};
	font-size: 14px;
	margin-left: 15px;
`;

const Value = styled.Text`
	font-size: 14px;
	font-weight: 500;
	color: ${colors.textPlaceholder};
	flex-shrink: 1;
	margin-left: 10px;
`;

const EditableNoteHourContainer = styled.View`
	display: flex;
	flex-direction: row;
`;

const DeleteText = styled.Text`
	font-size: 14px;
	color: ${colors.primary};
	padding: 6px 0 6px 10px;
`;
