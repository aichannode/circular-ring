import { useServices } from "@core/services";
import { CalendarNote } from "@domain/calendar/calendar";
import { Grow } from "@ui/components/layout";
import { Spinner } from "@ui/components/spinner";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import React, { useCallback, useState } from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import styled from "styled-components/native";

interface CalendarNoteItemProps {
	note: CalendarNote;
	color?: string;
	style?: StyleProp<ViewStyle>;
	canDelete?: boolean;
}

export const CalendarNoteItem: React.FC<CalendarNoteItemProps> = ({ note, color, canDelete = false, style }) => {
	const { format, formatDateInterval } = useI18n();
	const { calendarService } = useServices();

	const [isLoading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

	const deleteNote = useCallback(async () => {
		setErrorMessage(undefined);
		setLoading(true);
		try {
			await calendarService.deleteNote(note);
			setLoading(false);
		} catch (e) {
			setLoading(false);
			setErrorMessage(format("global.default_error"));
		}
	}, []);

	return (
		<>
			<Container style={style}>
				<NoteColor color={color} />
				<Name>{note.tag.name}</Name>
				<Grow />
				<Value numberOfLines={1} ellipsizeMode={"tail"}>
					{formatDateInterval(note.startTime, note.endTime)}
				</Value>
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

const DeleteText = styled.Text`
	font-size: 14px;
	color: ${colors.primary};
	padding: 6px 0 6px 10px;
`;

const ErrorMessage = styled.Text`
	${textStyles.errorMessage};
	padding: 0 20px;
`;
