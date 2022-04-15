import Cross from "@assets/images/crossBig.png";
import { useRepresentations } from "@core/representation";
import { useLastUsedTags } from "@domain/appState/representation/hooks";
import { CalendarTag } from "@domain/calendar/calendar";
import { CircularBottomSheet, CircularBottomSheetHandle } from "@ui/components/bottomSheet/bottomSheet";
import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import { CreateCustomNoteBottomSheet } from "./createCustomNoteBottomSheet";

const CustomNote = observer(function CustomNote({
	selectedTags,
	setSelectedTags,
	customNote,
}: {
	selectedTags: CalendarTag[];
	setSelectedTags: (arg: CalendarTag[]) => void;
	customNote: CalendarTag[];
}) {
	const [deleteMode, setDelete] = useState<boolean>(false);
	const createCustomNoteRef = useRef<CircularBottomSheetHandle>(null);
	const {
		lastUsedTags,
		actions: { setLastUsedTags },
	} = useLastUsedTags();
	const {
		calendar: {
			actions: { deleteTag },
		},
	} = useRepresentations();

	// Disable delete mode when there is no more tag anymore
	useEffect(
		action(function () {
			if (!customNote.length && !selectedTags.length) {
				setDelete(false);
			}
		}),
		[customNote.length, selectedTags.length]
	);

	function onPressDelete(id: number) {
		deleteTag(id);
		setLastUsedTags(lastUsedTags.filter((tag) => tag.id !== id));
	}

	return (
		<>
			<Container>
				<Name>Custom Notes</Name>
				{!!customNote.length && (
					<View style={{ justifyContent: "space-between" }}>
						<TouchableOpacity style={{ padding: 10 }} onPress={() => setDelete((del) => !del)}>
							<OrangeText>{!deleteMode ? "Delete" : "Cancel"}</OrangeText>
						</TouchableOpacity>
					</View>
				)}
			</Container>

			<Tags>
				{customNote.map((tag, key) => (
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
									setSelectedTags([...selectedTags, tag]);
								}
							}}
						>
							<TagText
								deleteMode={deleteMode}
								numberOfLines={1}
								selected={selectedTags.filter((t: CalendarTag) => t.id === tag.id).length > 0}
							>
								{tag.name}
							</TagText>
						</Touchable>
						{deleteMode && (
							<TouchableOpacity
								style={{ width: 40, height: 35, position: "absolute", right: -5 }}
								onPress={() => onPressDelete(tag.id)}
							>
								<Image style={{ height: 10, width: 10, margin: 14 }} resizeMode="contain" source={Cross}></Image>
							</TouchableOpacity>
						)}
					</TagContainer>
				))}
				{!deleteMode && (
					<AddContainer
						onPress={() => {
							console.log("ONPRESS");
							createCustomNoteRef.current?.present();
						}}
					>
						<Add>+</Add>
					</AddContainer>
				)}
			</Tags>
			<CircularBottomSheet snapPoints={[480]} ref={createCustomNoteRef}>
				<CreateCustomNoteBottomSheet onClose={() => createCustomNoteRef.current?.forceClose()} />
			</CircularBottomSheet>
		</>
	);
});

const AddContainer = styled.TouchableOpacity`
	height: 35px;
	width: 35px;
	border: 1px solid ${colors.redOrange};
	border-radius: 35px;
	margin: 5px;
`;

const Add = styled.Text`
	text-align: center;
	font-weight: bold;
	font-size: 15px;
	line-height: 30px;
	color: ${colors.redOrange};
`;

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

const TagText = styled.Text<{ selected: boolean; deleteMode: boolean }>`
	color: ${({ selected }) => (selected ? colors.white : colors.textPrimary)};
	align-self: center;
	padding-right: ${({ deleteMode }) => (deleteMode ? "10px" : "0px")}; ;
`;

export default CustomNote;
