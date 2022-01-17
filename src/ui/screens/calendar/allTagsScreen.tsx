import { useTagCategories, useTags } from "@domain/calendar/hooks/useTags";
import { InfoListHeader } from "@ui/components/infoList";
import { ScrollScreen } from "@ui/components/scrollScreen";
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

	const allTags = useTags();
	const allCategories = useTagCategories();

	console.log("CIR-262", allTags);
	const navigation = useRoutesNavigation();
	const navigate = navigation.navigate;
	const { format } = useI18n();

	// const systemTags = allTags ? allTags.keys().filter((tag) => tag.system) : [];
	// const userTags = allTags ? allTags?.filter((tag) => !tag.system) : [];

	Array.from(allTags.keys()).map((category) => {
		// const categoryTags = allTags.get(category) ?? [];
		console.log("category", category);
	});

	// console.log("System Tags", systemTags);
	// console.log("User Tags", userTags);

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
					<CheckLogo source={require("@assets/images/checkSmall.png")} />
				</Pressable>
			),
		});
	}, [selectedTags, originalSelectedTags]);

	return (
		<ScrollScreen>
			<View style={{ backgroundColor: colors.lightgray }}>
				<SearchWrapper>
					<ImageCenter source={require("@assets/images/search.png")} />
					<SearchInput
						placeholder={format("calendar.notes_search.placeholder")}
						value={search}
						onChangeText={setSearch}
					/>
					{search.length > 0 && (
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
						highlightedTagIds={selectedTags.map(({ id }) => id)}
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
				<View>
					{allCategories.map(({ id: categoryId, label: categoryLabel }) => {
						const categoryTags = allTags.get(categoryId) ?? [];
						return categoryTags.length === 0 ? null : (
							<React.Fragment key={categoryId}>
								<InfoListHeader>{format(categoryLabel)}</InfoListHeader>
								<TagListContainer>
									<TagSelectionView
										tags={categoryTags}
										highlightedTagIds={selectedTags.map(({ id }) => id)}
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
					})}
				</View>
			)}
		</ScrollScreen>
	);
};

const ImageCenter = styled(Image)`
	align-self: center;
`;

const TagListContainer = styled.View`
	padding: 0 20px;
`;

const SearchWrapper = styled(View)`
	background-color: ${colors.white};
	border-radius: 20px;
	padding-left: 14px;
	padding-right: 7px;
	height: 38px;
	margin: 6px 16px;
	display: flex;
	flex-direction: row;
`;

const SearchInput = styled.TextInput`
	${textStyles.primary};
	flex: 1;
	padding: 0px 10px 0px 10px;
`;

const CloseWrapper = styled.Pressable`
	width: 28px;
	height: 28px;
	border-radius: 14px;
	background-color: ${colors.lightgray};
	align-items: center;
	justify-content: center;
	align-self: center;
`;

const CheckLogo = styled(Image)`
	height: 21px;
	width: 21px;
	tint-color: ${colors.primary};
`;
