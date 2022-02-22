import { FetchStrategy } from "@betomorrow/micro-stores";
import { useServices } from "@core/services";
import { useLastUsedTags } from "@domain/appState/representation/hooks";
import { CalendarTag } from "@domain/calendar/calendar";
import { useCalendar } from "@domain/calendar/hooks/useCalendar";
import { PrimaryButton } from "@ui/components/buttons";
import { CalendarDay } from "@ui/components/calendar/calendarDay";
import { circularCalendarTheme } from "@ui/components/calendar/circularCalendarTheme";
import { InfoListHeader, InfoListItem } from "@ui/components/infoList";
import { Grow, Stack } from "@ui/components/layout";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { Spinner } from "@ui/components/spinner";
import { TimeEditor, TimeEditorRef } from "@ui/components/timeEditor";
import { useI18n } from "@ui/i18n";
import { Routes, useAppRoute, useRoutesNavigation } from "@ui/navigation/routes";
import { CalendarNoteItem } from "@ui/screens/calendar/calendarNoteItem";
import { TagSelectionView } from "@ui/screens/calendar/tagSelectionView";
import { colors } from "@ui/styles/colors";
import { shadow } from "@ui/styles/containerStyles";
import { textStyles } from "@ui/styles/textStyles";
import { deduplicate } from "@ui/utils/filter";
import { useUnmount } from "@ui/utils/lifecycleHooks";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { LayoutAnimation, Pressable, View } from "react-native";
import styled from "styled-components/native";

interface TimeEditorConfig {
	time: Date;
	title: string;
	description: string;
	saveTime: (time: Date) => void;
}

/**
 * This hooks encapsulate the logic to get the list of selected tags from two sources:
 * - from the route params coming from the tag selection screen
 * - tags which are also selected on the last used tags list
 * It will also handle the deselection of tags.
 */
function useTagsSelection(tagsFromRoute: CalendarTag[]): [CalendarTag[], (tag: CalendarTag) => void, () => void] {
	const [selectedTags, setSelectedTags] = useState<CalendarTag[]>(tagsFromRoute);
	// Turn all tags in a string of ids to easily compare new/old version
	const tagsListIdentity = tagsFromRoute
		.map(({ id }) => id)
		.sort()
		.join();

	const selectTag = useCallback(function (tag: CalendarTag) {
		const isAlreadySelected = selectedTags.map((t) => t.id).indexOf(tag.id) >= 0;
		if (isAlreadySelected) {
			setSelectedTags(selectedTags.filter((t) => t.id !== tag.id));
		} else {
			setSelectedTags([...selectedTags, tag]);
		}
	}, []);
	const clearSelectedTags = useCallback(function () {
		setSelectedTags([]);
	}, []);
	/**
	 * Each time the allTagsScreen is close, this screen is refreshed
	 * with a new route selectedTags params.
	 * We need to recompute selectedTags state.
	 */
	useEffect(() => {
		setSelectedTags(tagsFromRoute);
	}, [tagsListIdentity]);

	return [selectedTags, selectTag, clearSelectedTags];
}

export const CalendarEditNotesScreen: React.FC = () => {
	const { format, formatHour } = useI18n();
	const navigation = useRoutesNavigation();
	const navigate = navigation.navigate;

	const route = useAppRoute<Routes.CalendarEditNotes>();
	const initialSelectedTags = route.params.selectedTags ?? [];
	const day = route.params.day;
	const date = new Date(day);
	const dateJS = dayjs(date);

	const { calendarService } = useServices();
	const calendar = useCalendar(day, FetchStrategy.Never);

	const dateWithHour = useCallback((hour: number) => dayjs(day).hour(hour).toDate(), [day]);

	const {
		lastUsedTags,
		actions: { setLastUsedTags },
	} = useLastUsedTags();
	const [selectedTags, selectTag, clearSelectedTags] = useTagsSelection(initialSelectedTags);

	const [startDate, setStartDate] = useState(dateWithHour(19));
	const [endDate, setEndDate] = useState(dateWithHour(20));
	const [isLoading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [noteAddedText, setNoteAddedText] = useState<string | undefined>(undefined);

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

	const dismissHeaderTimeout = useRef<NodeJS.Timeout>();

	const dismissHeader = useCallback(() => {
		if (noteAddedText !== undefined) {
			LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
			setNoteAddedText(undefined);
		}
	}, [noteAddedText]);

	useUnmount(() => {
		if (dismissHeaderTimeout.current) {
			clearTimeout(dismissHeaderTimeout.current);
		}
	}, []);

	useEffect(() => {
		if (noteAddedText !== undefined) {
			dismissHeaderTimeout.current = setTimeout(dismissHeader, 5000);
		}
	}, [noteAddedText]);

	const saveNote = useCallback(async () => {
		if (endDate < startDate) {
			setErrorMessage(format("calendar.note_time_error"));
			return;
		}
		setLoading(true);
		setErrorMessage("");
		try {
			await calendarService.createNote(selectedTags, startDate, endDate);
			setLastUsedTags(selectedTags);
			const noteNames = selectedTags.map((t) => t.name).join(", ");
			LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
			setNoteAddedText(
				format(selectedTags.length === 1 ? "calendar.note_added_success.one" : "calendar.note_added_success.many", {
					notes: noteNames,
				})
			);
			setLoading(false);
			clearSelectedTags();
		} catch (e) {
			setLoading(false);
			setErrorMessage(format("global.default_error"));
		}
	}, [selectedTags, startDate, endDate, dismissHeader]);

	// CIR-402, put selected tag first, then put the last used tags.
	const tags = selectedTags.concat(lastUsedTags).filter(deduplicate("id"));

	const disableRegisterNote = endDate < startDate || selectedTags.length === 0;

	return calendar ? (
		<View style={{ flex: 1 }}>
			<ScrollScreen contentContainerStyle={{ paddingVertical: 20 }}>
				<DayContainer>
					<DateText>
						<DateStrong>{dateJS.format("MMMM")}</DateStrong> {dateJS.format("YYYY")}
					</DateText>
					<CalendarDay
						date={{
							dateString: day,
							day: date.getDate(),
							month: date.getMonth(),
							year: date.getFullYear(),
							timestamp: dateJS.date(),
						}}
						marking={{ selected: true } as any} // TO REFACTOR
						onPress={() => null}
						onLongPress={() => null}
						state={"selected"}
						theme={circularCalendarTheme}
					/>
				</DayContainer>
				{calendar.notes.length > 0 ? (
					<>
						<InfoListHeader>{format("calendar.notes")}</InfoListHeader>
						<Stack gap={1}>
							{!calendar
								? null
								: calendar.notes.map((note) => {
										return (
											<CalendarNoteItem
												key={`${note.id}-${note.tag.name}`}
												note={note}
												tags={calendar.notes}
												canDelete
											/>
										);
								  })}
						</Stack>
					</>
				) : null}
				<InfoListHeader>{format("calendar.add_note")}</InfoListHeader>
				<PopularTagContainer>
					<PopularTagHeader>
						<PopularTagHeaderText>{format("calendar.popular_tags_header")}</PopularTagHeaderText>
						<Pressable onPress={() => navigate(Routes.AllTags, { day, selectedTags })}>
							<AllTagButton>{format("calendar.see_all_tags")}</AllTagButton>
						</Pressable>
					</PopularTagHeader>
					{!!tags.length && (
						<TagSelectionView
							// CIR-402 highlighted is display first
							shouldDisplayHighlightedFirst
							tags={tags}
							highlightedTagIds={selectedTags.map(({ id }) => id)}
							onClickTag={selectTag}
						/>
					)}
				</PopularTagContainer>
				<InfoListItem
					name={format("calendar.start_time")}
					value={formatHour(startDate)}
					hasDisclosure
					action={async () => {
						setConfig({ ...startTimeEditionConfig, time: startDate });
						timeEditorRef.current?.present();
					}}
				/>
				<InfoListItem
					name={format("calendar.end_time")}
					value={formatHour(endDate)}
					hasDisclosure
					action={async () => {
						setConfig({ ...endTimeEditionConfig, time: endDate });
						timeEditorRef.current?.present();
					}}
				/>
				<Grow />
				<ErrorMessage>{errorMessage}</ErrorMessage>
				<BottomContainer>
					{isLoading ? (
						<Spinner size={24} />
					) : (
						<PrimaryButton disabled={disableRegisterNote} onPress={saveNote}>
							{format("calendar.save_note")}
						</PrimaryButton>
					)}
				</BottomContainer>
				<TimeEditor
					ref={timeEditorRef}
					defaultTime={config.time}
					title={config.title}
					description={config.description}
					saveTime={config.saveTime}
				/>
			</ScrollScreen>
			{noteAddedText !== undefined && (
				<NoteAddedHeader>
					<NoteAddedText>{noteAddedText}</NoteAddedText>
					<PrimaryButton onPress={dismissHeader}>{format("ok")}</PrimaryButton>
				</NoteAddedHeader>
			)}
		</View>
	) : null;
};

const NoteAddedHeader = styled.View`
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	flex-direction: row;
	padding: 14px 24px;
	align-items: center;
	justify-content: space-between;
	background-color: ${colors.white};
	${shadow()};
	elevation: 20;
	z-index: 10000;
`;

const NoteAddedText = styled.Text`
	flex: 1;
	font-size: 14px;
	color: ${colors.textPrimary};
	margin-right: 10px;
`;

const DayContainer = styled.View`
	${shadow()};
	border-radius: 2px;
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

const PopularTagContainer = styled.View`
	padding: 15px 20px;
	background-color: ${colors.lightgray};
	margin-bottom: 1px;
`;

const PopularTagHeader = styled.View`
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
`;

const PopularTagHeaderText = styled.Text`
	${textStyles.primary};
	font-size: 14px;
`;

const AllTagButton = styled.Text`
	font-size: 14px;
	color: ${colors.primary};
	padding: 10px 0 10px 10px;
`;

const ErrorMessage = styled.Text`
	${textStyles.errorMessage};
	margin-top: 20px;
	text-align: center;
	align-self: center;
`;

const BottomContainer = styled.View`
	margin-top: 20px;
	margin-bottom: 30px;
	height: 38px;
	justify-content: center;
	align-items: center;
`;
