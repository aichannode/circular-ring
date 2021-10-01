import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { BottomSheetTextInputProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetTextInput";
import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import React from "react";
import { Platform } from "react-native";
import styled from "styled-components/native";

interface BottomSheetInputProps extends BottomSheetTextInputProps {
	submitDelay?: number;
}
export const BottomSheetInput: React.FC<BottomSheetInputProps> = ({
	submitDelay = Platform.select({ android: 50, ios: 0 }),
	...props
}) => {
	return (
		<LabelInput
			{...props}
			onSubmitEditing={
				submitDelay
					? (e) => {
							setTimeout(() => props.onSubmitEditing?.(e), submitDelay);
					  }
					: props.onSubmitEditing
			}
		/>
	);
};

const LabelInput = styled(BottomSheetTextInput)`
	${textStyles.primary}
	background-color: ${colors.white};
	border-radius: 40px;
	width: 300px;
	height: 50px;
	padding-left: 15px;
	shadow-color: #000000;
	shadow-offset: 0 10px;
	shadow-opacity: 0.1;
	shadow-radius: 18px;
	elevation: 10;
	text-align: left;

	/* align-self: center;
	margin-horizontal: 50px;
	margin-vertical: 100px; */
`;
