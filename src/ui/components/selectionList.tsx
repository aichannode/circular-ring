import { Melody } from "@domain/ring/ringAlarm";
import { PrimaryText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import React, { useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import styled from "styled-components/native";

interface SelectionListProps {
	list: string[];
	defaultIndex: number;
	triggeredData: (data: string) => void;
	multipleSelection?: boolean;
}

export const SelectionList: React.FC<SelectionListProps> = ({ list, defaultIndex, triggeredData }) => {
	const { formatMelody } = useI18n();
	const triggeredList = list.map((value, index) => {
		return index === defaultIndex;
	});
	const [triggeredElement, setTriggeredElement] = useState(triggeredList);

	return (
		<>
			{list.map((element, index, array) => (
				<View key={index}>
					<Container
						onPress={() => {
							setTriggeredElement(triggeredElement.map((value, i) => i === index));
							triggeredData(element);
						}}
					>
						<PrimaryText>{formatMelody(element as Melody)}</PrimaryText>
						<View style={triggeredElement[index] ? styles.circlePress : styles.circleNormal}>
							<Image
								style={{ height: 14, width: 14, tintColor: colors.white }}
								source={require("@assets/images/check.png")}
							/>
						</View>
					</Container>
					{index < array.length - 1 ? <Separator /> : null}
				</View>
			))}
		</>
	);
};

const styles = StyleSheet.create({
	circleNormal: {
		height: 24,
		width: 24,
		borderRadius: 12,
		borderWidth: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: colors.white,
		borderColor: colors.lightgray,
	},
	circlePress: {
		height: 24,
		width: 24,
		borderRadius: 12,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: colors.blue,
	},
});

const Container = styled.Pressable`
	flex-direction: row;
	margin-horizontal: 40px;
	margin-vertical: 16px;
	justify-content: space-between;
`;

const Separator = styled.View`
	align-self: center;
	width: 350px;
	height: 1px;
	background-color: ${colors.lightgray};
	margin-horizontal: 20px;
`;
