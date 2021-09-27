import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { TertiaryButton } from "@ui/components/buttons";
import { TitleText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import React, { useState } from "react";
import styled from "styled-components/native";

interface LabelBottomSheetProps {
	label: string;
	onClose: (label: string) => void;
}
export const LabelBottomSheet: React.FC<LabelBottomSheetProps> = ({ label, onClose }) => {
	const { format } = useI18n();
	const [newLabel, setNewLabel] = useState(label);

	return (
		<Container>
			<Title style={{ alignSelf: "center" }}>{format("alarm.new.label.screen_title")}</Title>
			<LabelInput
				value={newLabel}
				onChangeText={setNewLabel}
				returnKeyType={"next"}
				blurOnSubmit={true}
				onSubmitEditing={() => onClose(newLabel)}
			/>
			<TertiaryButton style={{ alignSelf: "center" }} onPress={() => onClose(newLabel)}>
				{format("alarm.new.save_button")}
			</TertiaryButton>
		</Container>
	);
};

const Container = styled.View`
	flex: 1;
	padding-vertical: 20px;
`;

const Title = styled(TitleText)`
	align-self: center;
`;

const LabelInput = styled(BottomSheetTextInput)`
	align-self: center;
	padding-horizontal: 50px;
	margin-vertical: 100px;
`;
