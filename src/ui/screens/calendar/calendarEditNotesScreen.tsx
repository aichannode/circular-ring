import { FetchStrategy } from "@betomorrow/micro-stores";
import { useServices } from "@core/services";
import { delay } from "@core/utils";
import { CalendarTag } from "@domain/calendar/calendar";
import { useCalendar } from "@domain/calendar/hooks/useCalendar";
import { usePopularTags } from "@domain/calendar/hooks/useTags";
import { PrimaryButton } from "@ui/components/buttons";
import { CalendarDay } from "@ui/components/calendar/calendarDay";
import { circularCalendarTheme } from "@ui/components/calendar/circularCalendarTheme";
import { InfoListHeader, InfoListItem } from "@ui/components/infoList";
import { Grow } from "@ui/components/layout";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { Spinner } from "@ui/components/spinner";
import { PrimaryText } from "@ui/components/text";
import { TimeEditor, TimeEditorRef } from "@ui/components/timeEditor";
import { useI18n } from "@ui/i18n";
import { Routes, useAppRoute, useRoutesNavigation } from "@ui/navigation/routes";
import { TagSelectionView } from "@ui/screens/calendar/tagSelectionView";
import { colors } from "@ui/styles/colors";
import { shadow } from "@ui/styles/containerStyles";
import { textStyles } from "@ui/styles/textStyles";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pressable } from "react-native";
import { Marking } from "react-native-calendars";
import styled from "styled-components/native";

interface TimeEditorConfig {
	time: Date;
	title: string;
	description: string;
	saveTime: (time: Date) => void;
}

export const CalendarEditNotesScreen: React.FC = () => {
	const { format, formatDateInterval, formatHour } = useI18n();
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

	const dateWithHourMinute = useCallback(
		(hour: number, minute: number) => {
			const d = new Date(day);
			d.setHours(hour);
			d.setMinutes(minute);
			return d;
		},
		[day]
	);

	const [selectedTags, setSelectedTags] = useState<CalendarTag[]>(originalTags);
	const [startDate, setStartDate] = useState(dateWithHourMinute(new Date().getHours(), new Date().getMinutes()));
	const [endDate, setEndDate] = useState(dateWithHourMinute(new Date().getHours(), new Date().getMinutes()));
	const [isLoading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

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
		setSelectedTags(originalTags);
	}, [JSON.stringify(originalTags)]);

	const saveNote = useCallback(async () => {
		if (endDate < startDate) {
			setErrorMessage(format("calendar.note_time_error"));
			return;
		}
		setLoading(true);
		setErrorMessage("");
		try {
			await calendarService.createNote(selectedTags, startDate, endDate);
			setLoading(false);
			navigation.goBack();
		} catch (e) {
			setLoading(false);
			setErrorMessage(format("global.default_error"));
		}
	}, [selectedTags, startDate, endDate]);

	const allRawTags = [...selectedTags, ...popularTags];
	const visibleTags = allRawTags.filter((item, pos) => {
		return allRawTags.indexOf(item) == pos;
	});

	return calendar ? (
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
			<PopularTagContainer>
				<PopularTagHeader>
					<PopularTagHeaderText>{format("calendar.popular_tags_header")}</PopularTagHeaderText>
					<Pressable onPress={() => navigate(Routes.AllTags, { day, selectedTags })}>
						<AllTagButton>{format("calendar.see_all_tags")}</AllTagButton>
					</Pressable>
				</PopularTagHeader>
				{visibleTags ? (
					<TagSelectionView
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
					await delay(500);
					timeEditorRef.current?.present();
				}}
			/>
			<InfoListItem
				name={format("calendar.end_time")}
				value={formatHour(endDate)}
				hasDisclosure
				action={async () => {
					setConfig({ ...endTimeEditionConfig, time: endDate });
					await delay(500);
					timeEditorRef.current?.present();
				}}
			/>
			<Grow />
			<ErrorMessage>{errorMessage}</ErrorMessage>
			<BottomContainer>
				{isLoading ? (
					<Spinner size={24} />
				) : (
					<PrimaryButton onPress={saveNote}>{format("calendar.save_note")}</PrimaryButton>
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
	) : null;
};

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

const PopularTagHeaderText = styled(PrimaryText)`
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
