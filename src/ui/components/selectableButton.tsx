import { PrimaryButton, Tertiarybutton } from "@ui/components/buttons";
import React from "react";

interface SelectableButtonProps {
	title: string;
	selected: boolean;
	onSelected: () => void;
	bgColor: string;
}

export const SelectableButton: React.FC<SelectableButtonProps> = ({ title, selected, onSelected, bgColor }) => {
	return selected ? (
		<PrimaryButton onPress={() => null}>{title}</PrimaryButton>
	) : (
		<Tertiarybutton onPress={onSelected} containerBackgroundColor={bgColor}>
			{title}
		</Tertiarybutton>
	);
};
