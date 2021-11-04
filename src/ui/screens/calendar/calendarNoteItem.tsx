import { useServices } from "@core/services";
import { CalendarNote } from "@domain/calendar/calendar";
import { Grow } from "@ui/components/layout";
import { Spinner } from "@ui/components/spinner";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import React, { useState, useRef, useEffect } from "react";
import { TouchableOpacity, Pressable, StyleProp, ViewStyle } from "react-native";
import styled from "styled-components/native";
import { TimeEditor, TimeEditorRef } from "@ui/components/timeEditor";

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

export const CalendarNoteItem: React.FC<CalendarNoteItemProps> = ({ note, tags, color, canDelete = false, style }) => {
	const { format, formatHour, formatNoteIntervalLinker } = useI18n();
	// const dateWithHour = useCallback((hour: number) => dayjs(day).hour(hour).toDate(), [day]);
	const { calendarService } = useServices();
	const [isLoading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
	const [startDate, setStartDate] = useState(note.startTime);
	const [endDate, setEndDate] = useState(note.endTime);

	// console.log(" StartDate ", startDate, " EndDate ", endDate);
	// console.log("NOTE", note);

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

	const [config, setConfig] = useState<TimeEditorConfig>({ ...startTimeEditionConfig, time: startDate });
	const timeEditorRef = useRef<TimeEditorRef>(null);

	useEffect(() => {
		console.log(
			"startDate !== note.startTime || endDate !== note.endTime",
			startDate !== note.startTime,
			endDate !== note.endTime
		);
		if (startDate !== note.startTime || endDate !== note.endTime) {
			// avoid first Render
			calendarService
				.updateNoteDate(note, startDate, endDate)
				.then(() => {
					console.log("Cir-397 Sucees Update Hour");
				})
				.catch((err) => console.log("CIR-397 error pdating date", err));
		}
	}, [startDate, endDate]);

	const deleteNote = async () => {
		setErrorMessage(undefined);
		setLoading(true);

		try {
			await calendarService.deleteNote(note);
			setLoading(false);
		} catch (e) {
			setLoading(false);
		}
		// try {
		// 	const newTags = tags
		// 		.filter((element: CalendarNote) => element.id === note.id)
		// 		.filter((element: CalendarNote) => {
		// 			return note.tag.id != element.tag.id;
		// 		});

		// 	if (newTags.length > 0) {
		// 		await calendarService.updateNote(
		// 			note,
		// 			newTags.map((item) => item.tag.id)
		// 		);
		// 	} else {
		// 		await calendarService.deleteNote(note);
		// 	}

		// 	setLoading(false);
		// } catch (e) {
		// 	setLoading(false);
		// 	setErrorMessage(format("global.default_error"));
		// }
	};

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
							console.log("OnStart");
							setConfig({ ...startTimeEditionConfig, time: startDate });
							timeEditorRef.current?.present();
						}}
					>
						<Value>{formatHour(note.startTime)}</Value>
					</TouchableOpacity>
					<Value>{formatNoteIntervalLinker()}</Value>
					<TouchableOpacity
						onPress={async () => {
							setConfig({ ...endTimeEditionConfig, time: endDate });
							timeEditorRef.current?.present();
						}}
					>
						<Value>{formatHour(note.endTime)}</Value>
					</TouchableOpacity>
				</EditableNoteHourContainer>
				{canDelete ? (
					isLoading ? (
						<SpinnerContainer>
							<Spinner size={24} />
						</SpinnerContainer>
					) : (
						<Pressable onPress={deleteNote}>
							<DeleteText>{format("calendar.delete_note")}</DeleteText>
						</Pressable>
					)
				) : null}
				<TimeEditor
					ref={timeEditorRef}
					defaultTime={config.time}
					title={config.title}
					description={config.description}
					saveTime={config.saveTime}
				/>
			</Container>
			{errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}
		</>
	);
};

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

const SpinnerContainer = styled.View`
	width: 59px;
	align-items: flex-end;
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

const ErrorMessage = styled.Text`
	${textStyles.errorMessage};
	padding: 0 20px;
`;
