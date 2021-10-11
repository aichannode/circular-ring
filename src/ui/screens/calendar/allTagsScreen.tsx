import { useAllTags } from "@domain/calendar/hooks/useTags";
import { InfoListHeader } from "@ui/components/infoList";
import { Row } from "@ui/components/layout";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { MediumTitleText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { Routes, useAppRoute, useRoutesNavigation } from "@ui/navigation/routes";
import { TagSelectionView } from "@ui/screens/calendar/tagSelectionView";
import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import React, { useLayoutEffect, useState } from "react";
import { Image, Pressable, View } from "react-native";
import styled from "styled-components/native";

export const AllTagsScreen: React.FC = () => {
	const route = useAppRoute<Routes.AllTags>();
	const originalSelectedTags = route.params.selectedTags;

	const allTags = useAllTags();

	const navigation = useRoutesNavigation();
	const navigate = navigation.navigate;
	const { format } = useI18n();

	const [selectedTags, setSelectedTags] = useState(originalSelectedTags);
	const [search, setSearch] = useState("");

	const searchedTags = [...allTags.values()]
		.flat()
		.filter((tag) => tag.name.toLowerCase().includes(search.toLowerCase()));

	useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<Pressable
					onPress={() => {
						navigate(Routes.CalendarEditNotes, { day: route.params.day, selectedTags });
					}}
				>
					<EditButtonText>{format("global.edit")}</EditButtonText>
				</Pressable>
			),
		});
	}, [selectedTags, originalSelectedTags]);

	return (
		<ScrollScreen>
			<View style={{ backgroundColor: colors.lightgray }}>
				<SearchWrapper gap={8} align="center">
					<Image source={require("@assets/images/search.png")} />
					<SearchInput
						placeholder={format("calendar.notes_search.placeholder")}
						value={search}
						onChangeText={setSearch}
					/>
					{!!search && (
						<CloseWrapper onPress={() => setSearch("")}>
							<Image
								style={{ tintColor: colors.textPrimary, width: 14, height: 13 }}
								source={require("@assets/images/close.png")}
							/>
						</CloseWrapper>
					)}
				</SearchWrapper>
			</View>
			{search ? (
				<View style={{ paddingVertical: 30, paddingHorizontal: 20 }}>
					<TagSelectionView
						tags={searchedTags}
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
				</View>
			) : (
				Array.from(allTags.keys()).map((category) => {
					const categoryTags = allTags.get(category) ?? [];
					return categoryTags.length === 0 ? null : (
						<React.Fragment key={category}>
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
						</React.Fragment>
					);
				})
			)}
		</ScrollScreen>
	);
};

const EditButtonText = styled(MediumTitleText)`
	color: ${colors.primary};
`;

const TagListContainer = styled.View`
	padding: 0 20px;
`;

const SearchWrapper = styled(Row)`
	background-color: ${colors.white};
	border-radius: 20px;
	padding-left: 14px;
	padding-right: 7px;
	height: 38px;
	margin: 6px 16px;
`;

const SearchInput = styled.TextInput`
	${textStyles.primary};
	flex: 1;
`;

const CloseWrapper = styled.Pressable`
	width: 28px;
	height: 28px;
	border-radius: 14px;
	background-color: ${colors.lightgray};
	align-items: center;
	justify-content: center;
`;
