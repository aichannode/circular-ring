import { useRepresentations } from "@core/representation";
import { Stack } from "@ui/components/layout";
import { CalendarNoteItem } from "@ui/screens/calendar/calendarNoteItem";
import { colors } from "@ui/styles/colors";
import { observer } from "mobx-react-lite";
import React from "react";

export const DailyNotes = observer(function DailyNotes({ isoDay }: { isoDay: string }) {
	const {
		calendar: {
			hooks: { useCalendar },
		},
	} = useRepresentations();

	const day = useCalendar(isoDay);
	return (
		<Stack gap={1}>
			{day?.notes.map((note) => (
				<CalendarNoteItem key={`${note.id}-${note.tag.name}`} note={note} color={colors.primary} tags={day.notes} />
			))}
		</Stack>
	);
});
