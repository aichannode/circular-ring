import { useAllTags } from "@domain/calendar/hooks/useTags";
import { InfoListHeader } from "@ui/components/infoList";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { MediumTitleText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { Routes, useAppRoute, useRoutesNavigation } from "@ui/navigation/routes";
import { TagSelectionView } from "@ui/screens/calendar/tagSelectionView";
import { colors } from "@ui/styles/colors";
import React, { useLayoutEffect, useState } from "react";
import { Pressable } from "react-native";
import styled from "styled-components/native";

export const AllTagsScreen: React.FC = () => {
	const route = useAppRoute<Routes.AllTags>();
	const originalSelectedTags = route.params.selectedTags;
	const validateTagSelection = route.params.validateTagSelection;

	const allTags = useAllTags();

	const navigation = useRoutesNavigation();
	const { format } = useI18n();

	const [selectedTags, setSelectedTags] = useState(originalSelectedTags);

	useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<Pressable
					onPress={() => {
						validateTagSelection(selectedTags);
						navigation.goBack();
					}}
				>
					<EditButtonText>{format("global.edit")}</EditButtonText>
				</Pressable>
			),
		});
	}, [selectedTags, originalSelectedTags]);

	return (
		<ScrollScreen>
			{/* TODO : search */}
			{Array.from(allTags.keys()).map((category) => {
				const categoryTags = allTags.get(category) ?? [];
				return categoryTags.length === 0 ? null : (
					<>
						<InfoListHeader>{category}</InfoListHeader>
						<TagListContainer>
							<TagSelectionView
								tags={categoryTags}
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
						</TagListContainer>
					</>
				);
			})}
		</ScrollScreen>
	);
};

const EditButtonText = styled(MediumTitleText)`
	color: ${colors.primary};
`;

const TagListContainer = styled.View`
	padding: 0 20px;
`;
