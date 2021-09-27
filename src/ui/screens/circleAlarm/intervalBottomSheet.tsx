import { TertiaryButton } from "@ui/components/buttons";
import { Divider } from "@ui/components/divider";
import { PrimaryText, TitleText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import React, { useMemo, useState } from "react";
import { Image, Platform, StyleSheet, Switch, TouchableOpacity, View } from "react-native";
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
	const { format } = useI18n();
	const [interval, setInterval] = useState(value);
	const [isSmartValue, setIsSmartValue] = useState(isSmart);

	const snoozeLinkList = useMemo(
		() => [
			{
				label: snoozeDisplay ? "1 " + format("alarm.new.snooze.minute") : "30 " + format("alarm.new.snooze.minutes"),
				value: 1,
			},
			{
				label: snoozeDisplay ? "2 " + format("alarm.new.snooze.minutes") : "45 " + format("alarm.new.snooze.minutes"),
				value: 2,
			},
			{
				label: snoozeDisplay ? "5 " + format("alarm.new.snooze.minutes") : "1 " + format("alarm.new.snooze.hour"),
				value: 3,
			},
			{
				label: snoozeDisplay ? "10 " + format("alarm.new.snooze.minutes") : "1:15 " + format("alarm.new.snooze.hour"),
				value: 4,
			},
			{
				label: snoozeDisplay ? "15 " + format("alarm.new.snooze.minutes") : "1:30" + format("alarm.new.snooze.hour"),
				value: 5,
			},
			{
				label: format("alarm.new.snooze.off"),
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
						: format("alamr.new.snooze.descrition")
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
					<Description>{format("alamr.new.snooze.smart_switch")}</Description>
				</SwitchContainer>
			) : null}
			{snoozeLinkList.map((element, index, array) => (
				<View key={element.label}>
					<ListContainer>
						<PrimaryText>{element.label}</PrimaryText>
						<TouchableOpacity
							activeOpacity={0.85}
							style={interval === element.value ? styles.circlePress : styles.circleNormal}
							onPress={() => setInterval(array[index].value)}
						>
							<Image
								style={{ height: 14, width: 14, tintColor: colors.white }}
								source={require("@assets/images/check.png")}
							/>
						</TouchableOpacity>
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

const ListContainer = styled.View`
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
