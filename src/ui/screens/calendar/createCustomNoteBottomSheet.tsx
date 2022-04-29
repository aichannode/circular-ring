import { useRepresentations } from "@core/representation";
import { CalendarErrorContext } from "@domain/calendar/common/type";
import { BottomSheetInput } from "@ui/components/bottomSheet/bottomSheetInput";
import { PrimaryButton, TertiaryButton } from "@ui/components/buttons";
import { Grow, Row } from "@ui/components/layout";
import { Spinner } from "@ui/components/spinner";
import { MediumTitleText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { reaction } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
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
						setTimeout(() => onClose(), 100);
					}
				}
			);
		}, []);

		return (
			<Container>
				<Title>{format("calendar.add_custom_note")}</Title>
				<Grow />
				<NameInput
					placeholder={format("calendar.add_custom_note")}
					value={name}
					onChangeText={setName}
					autoFocus={true}
				/>
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

const NameInput = styled(BottomSheetInput)``;

const Container = styled(View)`
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
