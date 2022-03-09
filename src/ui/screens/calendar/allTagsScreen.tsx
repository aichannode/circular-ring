import { useRepresentations } from "@core/representation";
import { InfoListHeader } from "@ui/components/infoList";
import { useI18n } from "@ui/i18n";
import { Routes, useAppRoute, useRoutesNavigation } from "@ui/navigation/routes";
import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import { observer } from "mobx-react-lite";
import React, { useLayoutEffect, useMemo, useState } from "react";
import { Image, Pressable, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import styled from "styled-components/native";
import CustomNote from "./customNotes";
import { TagSelectionView } from "./tagSelectionView";

export const AllTagsScreen: React.FC = observer(() => {
	const route = useAppRoute<Routes.AllTags>();
	const originalSelectedTags = route.params.selectedTags;
	const {
		calendar: {
			actions: { fetchAllTags },
			hooks: { useTagCategories, useTags },
		},
	} = useRepresentations();
	const allTags = useTags();
	const allCategories = useTagCategories();

	useMemo(() => {
		fetchAllTags({ useForceRefresh: true });
	}, []);

	const navigation = useRoutesNavigation();
	const navigate = navigation.navigate;
	const { format } = useI18n();

	const [selectedTags, setSelectedTags] = useState(originalSelectedTags);
	const [search, setSearch] = useState("");

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
		<ScrollView>
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
						tags={[]}
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
				<View style={{ flex: 1 }}>
					<CustomNote
						customNote={[...allTags.values()].flat().filter((tag) => tag.categoryId === null)}
						selectedTags={selectedTags}
						setSelectedTags={setSelectedTags}
					></CustomNote>
					{allCategories.map(({ id: categoryId, label: categoryLabel }) => {
						const categoryTags = allTags.get(categoryId) ?? [];
						return categoryTags.length === 0 ? null : (
							<View key={categoryId} style={{ flex: 1 }}>
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
							</View>
						);
					})}
				</View>
			)}
		</ScrollView>
	);
});

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
