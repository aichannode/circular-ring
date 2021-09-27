import { TertiaryButton } from "@ui/components/buttons";
import { Divider } from "@ui/components/divider";
import { PrimaryText, TitleText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import React, { useMemo, useState } from "react";
import { Image, Platform, StyleSheet, Switch, View } from "react-native";
import styled from "styled-components/native";

interface IntervalBottomSheetProps {
	value: number;
	isSmart?: boolean;
	snoozeDisplay?: boolean;
	onClose: (value: number, isSmart?: boolean) => void;
}
export const IntervalBottomSheet: React.FC<IntervalBottomSheetProps> = ({
	value,
	isSmart,
	snoozeDisplay = false,
	onClose,
}) => {
	const { format, formatSnooze, formatSmart } = useI18n();
	const [interval, setInterval] = useState(value);
	const [isSmartValue, setIsSmartValue] = useState(isSmart);

	const snoozeLinkList = useMemo(
		() => [
			{
				label: snoozeDisplay ? formatSnooze(1) : formatSmart(1),
				value: 1,
			},
			{
				label: snoozeDisplay ? formatSnooze(2) : formatSmart(2),
				value: 2,
			},
			{
				label: snoozeDisplay ? formatSnooze(3) : formatSmart(3),
				value: 3,
			},
			{
				label: snoozeDisplay ? formatSnooze(4) : formatSmart(4),
				value: 4,
			},
			{
				label: snoozeDisplay ? formatSnooze(5) : formatSmart(5),
				value: 5,
			},
			{
				label: formatSnooze(0),
				value: 0,
			},
		],
		[]
	);

	return (
		<Container>
			<Title style={{ alignSelf: "center" }}>
				{snoozeDisplay
					? isSmartValue
						? format("alarm.new.smart_snooze.title")
						: format("alarm.new.snooze.title")
					: format("alarm.new.smart_alarm.title")}
			</Title>
			<Description style={{ marginLeft: 34 }}>
				{snoozeDisplay
					? isSmartValue
						? format("alarm.new.smart_snooze.description")
						: format("alarm.new.snooze.description")
					: format("alarm.new.smart_alarm.description")}
			</Description>
			{snoozeDisplay ? (
				<SwitchContainer>
					<SwitchButton
						style={{ transform: Platform.OS === "android" ? [{ scale: 1.5 }] : undefined }}
						ios_backgroundColor={colors.gray}
						trackColor={{ false: colors.gray, true: colors.blue }}
						thumbColor={colors.white}
						onValueChange={() => setIsSmartValue((prev) => !prev)}
						value={isSmartValue}
					/>
					<Description>{format("alarm.new.snooze.smart_switch")}</Description>
				</SwitchContainer>
			) : null}
			{snoozeLinkList.map((element, index, array) => (
				<View key={element.label}>
					<ListContainer onPress={() => setInterval(array[index].value)}>
						<PrimaryText>{element.label}</PrimaryText>
						<View style={interval === element.value ? styles.circlePress : styles.circleNormal}>
							<Image
								style={{ height: 14, width: 14, tintColor: colors.white }}
								source={require("@assets/images/check.png")}
							/>
						</View>
					</ListContainer>
					{index < array.length - 1 ? <Divider width={350} style={{ alignSelf: "center" }} /> : null}
				</View>
			))}
			<TertiaryButton style={{ alignSelf: "center" }} onPress={() => onClose(interval, isSmartValue)}>
				{format("alarm.new.save_button")}
			</TertiaryButton>
		</Container>
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

const Container = styled.View`
	flex: 1;
	padding-vertical: 20px;
`;

const ListContainer = styled.Pressable`
	flex-direction: row;
	margin-horizontal: 40px;
	margin-vertical: 16px;
	justify-content: space-between;
`;

const Title = styled(TitleText)`
	align-self: center;
`;

const Description = styled.Text`
	${textStyles.primary};
	align-self: center;
	justify-content: center;
	margin-top: 30px;
	margin-bottom: 60px;
	padding: 0 44px;
	text-align: center;
`;

const SwitchContainer = styled.View`
	flex-grow: 1;
	justify-content: center;
	align-items: center;
`;

const SwitchButton = styled(Switch)`
	margin-right: 10px;
	border-color: ${colors.blue};
`;
