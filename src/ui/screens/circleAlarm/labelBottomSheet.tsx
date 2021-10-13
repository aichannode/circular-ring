import { BottomSheetInput } from "@ui/components/bottomSheet/bottomSheetInput";
import { QuadraryButton } from "@ui/components/buttons";
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
				returnKeyType="done"
				onSubmitEditing={() => {
					onClose(newLabel);
				}}
			/>
			<QuadraryButton style={{ alignSelf: "center" }} onPress={() => onClose(newLabel)}>
				{format("alarm.new.save_button")}
			</QuadraryButton>
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

const LabelInput = styled(BottomSheetInput)`
	align-self: center;
	margin-horizontal: 50px;
	margin-vertical: 100px;
`;
