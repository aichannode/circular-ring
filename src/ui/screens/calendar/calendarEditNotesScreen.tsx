import { FetchStrategy } from "@betomorrow/micro-stores";
import { CalendarTag } from "@domain/calendar/calendar";
import { useCalendar } from "@domain/calendar/hooks/useCalendar";
import { useTags } from "@domain/calendar/hooks/useTags";
import { PrimaryButton } from "@ui/components/buttons";
import { CalendarDay } from "@ui/components/calendar/calendarDay";
import { circularCalendarTheme } from "@ui/components/calendar/circularCalendarTheme";
import { InfoListHeader, InfoListItem } from "@ui/components/infoList";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { Spinner } from "@ui/components/spinner";
import { useI18n } from "@ui/i18n";
import { Routes, useAppRoute } from "@ui/navigation/routes";
import { CalendarTagListView } from "@ui/screens/calendar/calendarTagListView";
import { colors } from "@ui/styles/colors";
import { shadow } from "@ui/styles/containerStyles";
import dayjs from "dayjs";
import React, { useCallback, useState } from "react";
import { Marking } from "react-native-calendars";
import styled from "styled-components/native";

export const CalendarEditNotesScreen: React.FC = () => {
	const { format, formatDateInterval, formatHour } = useI18n();
	const route = useAppRoute<Routes.CalendarEditNotes>();
	const day = route.params.day;
	const date = new Date(day);
	const dateJS = dayjs(date);

	const calendar = useCalendar(day, FetchStrategy.Never);
	const tags = useTags();

	const [isLoading, setLoading] = useState(false);
	const [selectedTags, setSelectedTags] = useState<CalendarTag[]>([]);

	const saveNote = useCallback(async () => {
		// TODO
	}, []);

	console.log("day param : " + day + " / day : " + dateJS.day());

	return calendar ? (
		<ScrollScreen contentContainerStyle={{ paddingVertical: 20 }}>
			<DayContainer>
				<DateText>
					<DateStrong>{dateJS.format("MMMM")}</DateStrong> {dateJS.format("YYYY")}
				</DateText>
				<CalendarDay
					date={{
						dateString: day,
						day: dateJS.day(),
						month: dateJS.month(),
						year: dateJS.year(),
						timestamp: dateJS.date(),
					}}
					marking={{ selected: true } as unknown as Marking[]}
					onPress={() => null}
					onLongPress={() => null}
					state={"selected"}
					theme={circularCalendarTheme}
				/>
			</DayContainer>
			{calendar.notes.length > 0 ? (
				<>
					<InfoListHeader>{format("calendar.notes")}</InfoListHeader>
					{!calendar
						? null
						: calendar.notes.map((note) => (
								<InfoListItem
									key={note.tag.name}
									name={note.tag.name}
									value={formatDateInterval(note.startTime, note.endTime)}
								/>
						  ))}
					)
				</>
			) : null}
			<InfoListHeader>{format("calendar.add_note")}</InfoListHeader>
			<CalendarTagListView
				tags={tags}
				selectedTags={selectedTags}
				onClickTag={(tag) => {
					const isAlreadySelected = selectedTags.map((t) => t.id).indexOf(tag.id) >= 0;
					if (isAlreadySelected) {
						setSelectedTags(selectedTags.filter((t) => t.id !== tag.id));
					} else {
						setSelectedTags([...selectedTags, tag]);
					}
				}}
			/>
			<InfoListItem
				name={"start time toto"}
				value={formatHour(new Date())}
				hasDisclosure
				action={() => {
					/* TODO */
				}}
			/>
			<InfoListItem
				name={"end time toto"}
				value={formatHour(new Date())}
				hasDisclosure
				action={() => {
					/* TODO */
				}}
			/>
			<BottomContainer>
				{isLoading ? (
					<Spinner size={24} />
				) : (
					<PrimaryButton onPress={saveNote}>{format("calendar.save_note")}</PrimaryButton>
				)}
			</BottomContainer>
		</ScrollScreen>
	) : null;
};

const DayContainer = styled.View`
	${shadow()};
	background-color: ${colors.white};
	align-items: center;
	padding: 20px;
	margin-right: 20px;
	margin-left: 20px;
`;

const DateText = styled.Text`
	font-size: 14px;
	color: ${colors.textPrimary};
	margin-bottom: 2px;
`;

const DateStrong = styled.Text`
	font-weight: 500;
`;

const BottomContainer = styled.View`
	margin-top: 20px;
	margin-bottom: 30px;
	height: 38px;
	justify-content: center;
`;
