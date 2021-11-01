import { useAllTags } from "@domain/calendar/hooks/useTags";
import { InfoListHeader } from "@ui/components/infoList";
import { ScrollScreen } from "@ui/components/scrollScreen";
import { useI18n } from "@ui/i18n";
import { Routes, useAppRoute, useRoutesNavigation } from "@ui/navigation/routes";
import { TagSelectionView } from "@ui/screens/calendar/tagSelectionView";
import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import React, { useLayoutEffect, useState, useRef } from "react";
import { Image, Pressable, View, Text, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { CreateCustomNoteBottomSheet } from "./createCustomNoteBottomSheet";
import { CircularBottomSheet, CircularBottomSheetHandle } from "@ui/components/bottomSheet/bottomSheet";

const tagsDebug = [
	{ id: 1232, name: "dosssrssss" },
	{ id: 1231, name: "dorssssssssssad" },
	{ id: 1230, name: "asddorsasd" },
	{ id: 1235, name: "dorsd" },
	{ id: 1236, name: "dsadors" },
];
const Cross = require("@assets/images/crossBig.png");

const CustomNote = () => {
	const [del, setDel] = useState<boolean>(false);
	const [selectedTags, setSelectedTags] = useState([]);

	console.log("Selected", selectedTags);
	const createCustomNoteRef = useRef<CircularBottomSheetHandle>(null);

	return (
		<>
			<Container>
				<Name>Custom Notes</Name>
				<View style={{ height: 90, justifyContent: "space-between" }}>
					<TouchableOpacity onPress={() => setDel((del) => !del)}>
						<OrangeText>{!del ? "Delete" : "Cancel"}</OrangeText>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							createCustomNoteRef.current?.present();
						}}
					>
						<OrangeText>Create</OrangeText>
					</TouchableOpacity>
				</View>
			</Container>

			<Tags>
				{tagsDebug.map((tag, key) => (
					<TagContainer key={key} selected={selectedTags.filter((t) => t.id === tag.id).length > 0} style={{}}>
						<Touchable
							onPress={() => {
								const isAlreadySelected = selectedTags.filter((t) => t.id === tag.id).length > 0;
								console.log(
									"AlreadtS",
									isAlreadySelected,
									selectedTags.filter((t) => t.id === tag.id)
								);
								if (isAlreadySelected) {
									setSelectedTags(selectedTags.filter((t) => t.id !== tag.id));
									console.log(
										"Filter",
										selectedTags.filter((t) => t.id !== tag.id)
									);
								} else {
									console.log("Else", tag);
									setSelectedTags((tags) => [...tags, tag]);
								}
							}}
						>
							<TagText numberOfLines={1} selected={selectedTags.filter((t) => t.id === tag.id).length > 0}>
								{tag.name}
							</TagText>
						</Touchable>
						{del && (
							<TouchableOpacity style={{ height: "100%", width: 20 }}>
								<Image style={{ height: 10, width: 10, margin: 14 }} resizeMode="contain" source={Cross}></Image>
							</TouchableOpacity>
						)}
					</TagContainer>
				))}
			</Tags>
			<CircularBottomSheet snapPoints={[480]} ref={createCustomNoteRef}>
				<CreateCustomNoteBottomSheet onClose={() => createCustomNoteRef.current?.close()} />
			</CircularBottomSheet>
		</>
	);
};

const Container = styled.View`
	width: 100%;
	height: 50px;
	padding: 0 20px;
	flex-direction: row;
	justify-content: space-between;
	margin-bottom: 1px;
	margin-vertical: 25px;
`;

const Name = styled.Text`
	${textStyles.mediumTitle};
`;

const OrangeText = styled.Text`
	color: ${colors.orangeRed};
	z-index: 2;
	padding: 5px 0;
	width: 50px;
`;

const Tags = styled.View`
	display: flex;
	flex-direction: row;
	padding: 0 20px;
	flex-wrap: wrap;
	padding: 0 70px 0 20px;
`;

const Touchable = styled.TouchableOpacity`
	justify-content: center;
`;

const TagContainer = styled.Pressable<{ selected: boolean }>`
	height: 36px;
	border-radius: 18px;
	padding: 0 20px;
	margin: 0 5px;
	background-color: ${({ selected }) => (selected ? colors.primary : "transparent")};
	border-width: 1px;
	border-color: ${({ selected }) => (selected ? colors.primary : colors.textPrimary)};
	display: flex;
	justify-content: center;
	flex-direction: row;
	margin-top: 4px;
	margin-bottom: 4px;
`;

const TagText = styled.Text<{ selected: boolean }>`
	color: ${({ selected }) => (selected ? colors.white : colors.textPrimary)};
	align-self: center;
`;

export default CustomNote;
