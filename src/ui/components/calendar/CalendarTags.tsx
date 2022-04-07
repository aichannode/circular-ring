import { CalendarTag } from "@domain/calendar/calendar";
import { Tag } from "@ui/components/tag";
import { colors } from "@ui/styles/colors";
import React from "react";
import { View } from "react-native";

interface Props {
	tags?: Array<{ tag: CalendarTag; nb: number }>;
}

export const CalendarTags = ({ tags = [] }: Props) => (
	<View style={{ flex: 1, flexDirection: "row-reverse", flexWrap: "wrap" }}>
		{tags.map(({ tag, nb }) => (
			<Tag
				key={`tag-${tag.id}`}
				containerStyle={{
					marginLeft: 7,
					marginBottom: 7,
					backgroundColor: colors.redOrange,
				}}
			>
				{nb > 1 ? `${tag.name} x${nb}` : tag.name}
			</Tag>
		))}
	</View>
);
