// TODO: Merge this component with SleepTags

import { CalendarTag } from "@domain/calendar/calendar";
import { Tag } from "@ui/components/tag";
import { colors } from "@ui/styles/colors";
import React from "react";
import { View } from "react-native";

interface Props {
	tags?: CalendarTag[];
}

export const ActivityTags = ({ tags = [] }: Props) => (
	<View style={{ flex: 1, flexDirection: "row-reverse", flexWrap: "wrap" }}>
		{tags.map((tag) => (
			<Tag
				key={`tag-${tag.id}`}
				containerStyle={{
					marginLeft: 7,
					marginBottom: 7,
					backgroundColor: colors.redOrange,
				}}
			>
				{tag.name}
			</Tag>
		))}
	</View>
);
