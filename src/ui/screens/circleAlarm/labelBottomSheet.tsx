import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { QuadraryButton } from "@ui/components/buttons";
import { TitleText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
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

const LabelInput = styled(BottomSheetTextInput)`
	${textStyles.primary}
	background-color: ${colors.white};
	align-self: center;
	border-radius: 40px;
	width: 300px;
	height: 50px;
	margin-horizontal: 50px;
	padding-left: 15px;
	margin-vertical: 100px;
	shadow-color: #000000;
	shadow-offset: 0 10px;
	shadow-opacity: 0.1;
	shadow-radius: 18px;
	elevation: 10;
	text-align: left;
`;
