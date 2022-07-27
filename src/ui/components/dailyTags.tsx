import { useRepresentations } from "@core/representation";
import { ISODay } from "@domain/common/type";
import { Tag } from "@ui/components/tag";
import { observer } from "mobx-react-lite";
import React from "react";
import { View } from "react-native";

type Props = {
	selectedDay: ISODay;
};

export const DailyTags = observer(function dailyTags({ selectedDay }: Props) {
	const {
		calendar: {
			hooks: { useDailyTags },
		},
	} = useRepresentations();
	const tags = useDailyTags(selectedDay);
	return (
		<View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
			{tags.map(({ name, id }) => (
				<View key={id} style={{ marginLeft: 8 }}>
					<Tag>{name}</Tag>
				</View>
			))}
		</View>
	);
});
