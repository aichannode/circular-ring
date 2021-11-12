import { FetchStrategy } from "@betomorrow/micro-stores";
import { useServices } from "@core/services";
import { CalendarTag } from "@domain/calendar/calendar";
import { useCalendar } from "@domain/calendar/hooks/useCalendar";
import { useDebugTags, usePopularTags } from "@domain/calendar/hooks/useTags";
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
import { useUnmount } from "@ui/utils/lifecycleHooks";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LayoutAnimation, Pressable, View } from "react-native";
// import { Marking } from "react-native-calendars";
import styled from "styled-components/native";

interface TimeEditorConfig {
	time: Date;
	title: string;
	description: string;
	saveTime: (time: Date) => void;
}

export const CalendarEditNotesScreen: React.FC = () => {
	const { format, formatHour } = useI18n();
	const navigation = useRoutesNavigation();
	const navigate = navigation.navigate;

	const route = useAppRoute<Routes.CalendarEditNotes>();
	const originalTags = useMemo(() => route.params.selectedTags ?? [], [route.params.selectedTags]);
	const day = route.params.day;
	const date = new Date(day);
	const dateJS = dayjs(date);

	const { calendarService } = useServices();
	const calendar = useCalendar(day, FetchStrategy.Never);
	const popularTags = usePopularTags();
	const debugTags = useDebugTags();

	const dateWithHour = useCallback((hour: number) => dayjs(day).hour(hour).toDate(), [day]);

	const [selectedTags, setSelectedTags] = useState<CalendarTag[]>(originalTags);
	const [startDate, setStartDate] = useState(dateWithHour(19));
	const [endDate, setEndDate] = useState(dateWithHour(20));
	const [isLoading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [noteAddedText, setNoteAddedText] = useState<string | undefined>(undefined);
	const [visibleTags, setVisibleTags] = useState<CalendarTag[]>([]);

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

	useEffect(() => {
		setSelectedTags(originalTags);
	}, [JSON.stringify(originalTags)]);

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
			const noteNames = selectedTags.map((t) => t.name).join(", ");
			LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
			setNoteAddedText(
				format(selectedTags.length === 1 ? "calendar.note_added_success.one" : "calendar.note_added_success.many", {
					notes: noteNames,
				})
			);
			setLoading(false);
			setSelectedTags([]);
		} catch (e) {
			setLoading(false);
			setErrorMessage(format("global.default_error"));
		}
	}, [selectedTags, startDate, endDate, dismissHeader]);

	const allRawTags = [...selectedTags, ...popularTags, ...debugTags].sort((t1, t2) => {
		return t1.name.localeCompare(t2.name);
	});

	// console.log("allRawTags", allRawTags, popularTags, selectedTags, debugTags);

	useEffect(() => {
		let _allRawTags = allRawTags.filter((item, pos) => {
			return allRawTags.indexOf(item) == pos;
		});

		_allRawTags = _allRawTags.sort((a, b) => {
			console.log(
				"CIR-402",
				selectedTags.findIndex((el) => el.name == a.name)
			);
			if (selectedTags.findIndex((el) => el.name == a.name) > selectedTags.findIndex((el) => el.name == b.name))
				return 1;
			else return -1;
		});

		console.log();

		setVisibleTags(_allRawTags);
	}, [selectedTags]);

	console.log(
		"CIR-402 visibleTags",
		visibleTags.map((i) => i.name)
	);
	// console.log("CIR-402 allRawTags", allRawTags);

	const disableRegisterNote = endDate < startDate || selectedTags.length === 0;
	console.log("Calendar", calendar);

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
						marking={{ selected: true } as unknown as []}
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
					{visibleTags ? (
						<TagSelectionView
							displayCount={14}
							tags={visibleTags}
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
					) : null}
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
