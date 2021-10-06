import { CalendarTag } from "@domain/calendar/calendar";
import { Row } from "@ui/components/layout";
import { CalendarTagView } from "@ui/screens/calendar/calendarTagView";
import { colors } from "@ui/styles/colors";
import React from "react";
import styled from "styled-components/native";

interface CalendarTagListViewProps {
	tags: CalendarTag[];
	selectedTags: CalendarTag[];
	onClickTag: (tag: CalendarTag) => void;
}

export const CalendarTagListView: React.FC<CalendarTagListViewProps> = ({ tags, selectedTags, onClickTag }) => {
	return (
		<Container gap={8} wrap={"wrap"}>
			{tags.map((tag) => {
				return (
					<CalendarTagView
						key={tag.id}
						selected={selectedTags.map((tag) => tag.id).indexOf(tag.id) >= 0}
						onClick={() => onClickTag(tag)}
					>
						{tag.name}
					</CalendarTagView>
				);
			})}
		</Container>
	);
};

const Container = styled(Row)`
	background-color: ${colors.lightgray};
	padding: 10px 20px 25px;
	margin-bottom: 1px;
`;
