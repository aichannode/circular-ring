import { CalendarTag } from "@domain/calendar/calendar";
import { Row } from "@ui/components/layout";
import { CalendarTagView } from "@ui/screens/calendar/calendarTagView";
import React from "react";
import styled from "styled-components/native";

interface CalendarTagListViewProps {
	tags: CalendarTag[];
	selectedTags: CalendarTag[];
	onClickTag: (tag: CalendarTag) => void;
}

export const TagSelectionView: React.FC<CalendarTagListViewProps> = ({ tags, selectedTags, onClickTag }) => {
	const visibleTags = tags
		.filter((item, pos) => {
			return tags.map((t) => t.id).indexOf(item.id) == pos;
		})
		.sort((t1, t2) => {
			return t1.name.localeCompare(t2.name);
		});

	return (
		<Container gap={8} wrap={"wrap"}>
			{visibleTags.map((tag) => {
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
	margin-bottom: 1px;
`;
