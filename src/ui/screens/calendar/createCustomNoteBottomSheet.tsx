import { useRepresentations } from "@core/representation";
import { CalendarErrorContext } from "@domain/calendar/common/type";
import { PrimaryButton, TertiaryButton } from "@ui/components/buttons";
import { Grow, ResponsiveCenterView, Row } from "@ui/components/layout";
import { Spinner } from "@ui/components/spinner";
import { MediumTitleText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import { reaction } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Image, View } from "react-native";
import styled from "styled-components/native";
import { ErrorMessage } from "../../components/errorMessage";

interface CreateCustomNoteBottomSheetProps {
	onClose: () => void;
}

export const CreateCustomNoteBottomSheet: React.FC<CreateCustomNoteBottomSheetProps> = observer(
	function CreateCustomNoteBottomSheet({ onClose }) {
		const { format } = useI18n();
		const [name, setName] = useState("");
		const [loading, setLoading] = useState(false);
		const {
			calendar: {
				hooks: { useTags, useErrors },
				actions: { createTag },
			},
		} = useRepresentations();
		const hasAPIError = useErrors(CalendarErrorContext.TAG_CREATE);
		const createCustomNote = () => {
			if (name !== "") {
				setLoading(true);
				createTag(name);
			}
		};

		useEffect(
			function () {
				if (hasAPIError) {
					setLoading(false);
				}
			},
			[hasAPIError]
		);

		useEffect(function () {
			return reaction(
				() => Array.from(useTags().values()).reduce((sum, tags) => sum + tags.length, 0),
				(nbTags, prevNbTags) => {
					if (prevNbTags > 0 && nbTags > prevNbTags) {
						onClose();
					}
				}
			);
		}, []);

		return (
			<Container horizontalPadding={0}>
				<Title>{format("calendar.add_custom_note")}</Title>
				<Grow />
				<SearchWrapper>
					<SearchInput
						placeholder={format("calendar.add_custom_note")}
						value={name}
						onChangeText={setName}
						autoFocus={true}
					/>
					{name.length > 0 && (
						<CloseWrapper onPress={() => setName("")}>
							<Image
								style={{ tintColor: colors.textPrimary, width: 14, height: 13 }}
								source={require("@assets/images/close.png")}
							/>
						</CloseWrapper>
					)}
				</SearchWrapper>
				<Grow />
				{!loading ? (
					<>
						{hasAPIError && (
							<View>
								<ErrorMessage>{format("calendar.errors.add_custom_note")}</ErrorMessage>
							</View>
						)}

						<ButtonContainer gap={35}>
							<TertiaryButton key={"cancel"} containerBackgroundColor={colors.white} onPress={onClose}>
								{format("global.cancel")}
							</TertiaryButton>

							<PrimaryButton key={"create"} onPress={createCustomNote}>
								{format("global.create")}
							</PrimaryButton>
						</ButtonContainer>
					</>
				) : (
					<View style={{ marginBottom: 20 }}>
						<Spinner size={12}></Spinner>
					</View>
				)}
			</Container>
		);
	}
);

const SearchWrapper = styled(View)`
	background-color: ${colors.white};
	border-radius: 20px;
	padding-left: 14px;
	padding-right: 7px;
	height: 38px;
	margin: 6px 16px;
	display: flex;
	flex-direction: row;
  	shadow-color: #000;
	shadow-offset: {
	width: 0px,
	height: 2px,
	};
	shadow-opacity: 0.25px;
	shadow-Radius: 3.84px;
	elevation: 12;
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

const Container = styled(ResponsiveCenterView)`
	flex: 1;
	justify-content: space-between;
	align-items: center;
`;

const Title = styled(MediumTitleText)`
	margin-top: 120px;
	font-size: 16px;
	text-align: center;
`;

const ButtonContainer = styled(Row)`
	margin: 30px 0;
`;
