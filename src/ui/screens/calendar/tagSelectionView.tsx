import { CalendarTag } from "@domain/calendar/calendar";
import { CalendarTagView } from "@ui/screens/calendar/calendarTagView";
import React from "react";
import styled from "styled-components/native";

interface CalendarTagListViewProps {
	tags: ReadonlyArray<CalendarTag>;
	highlightedTagIds: number[];
	onClickTag: (tag: CalendarTag) => void;
	shouldDisplayHighlightedFirst?: boolean;
	shouldSortAlphabeticaly?: boolean;
}

export const TagSelectionView: React.FC<CalendarTagListViewProps> = function TagSelectionView({
	tags,
	highlightedTagIds,
	shouldDisplayHighlightedFirst,
	shouldSortAlphabeticaly,
	onClickTag,
}) {
	const highlitedTags = tags.filter(({ id }) => highlightedTagIds.includes(id));
	const normalTags = tags.filter(({ id }) => !highlightedTagIds.includes(id));

	const tagsToDisplay = shouldDisplayHighlightedFirst ? [...highlitedTags, ...normalTags] : [...tags];

	if (shouldSortAlphabeticaly) {
		tagsToDisplay.sort((a, b) => a.name.localeCompare(b.name));
	}

	return (
		<Container>
			{tagsToDisplay.map((tag) => {
				return (
					<CalendarTagView
						key={tag.id}
						style={{ marginRight: 8 }}
						selected={highlightedTagIds.includes(tag.id)}
						onClick={() => onClickTag(tag)}
					>
						{tag.name}
					</CalendarTagView>
				);
			})}
		</Container>
	);
};

const Container = styled.View`
	flex: 1;
	flex-direction: row;
	align-items: stretch;
	justify-content: flex-start;
	flex-wrap: wrap;
	margin-bottom: 1px;
`;
