import { Weekdays } from "@domain/ring/ringAlarm";
import { QuadraryButton } from "@ui/components/buttons";
import { Divider } from "@ui/components/divider";
import { PrimaryText, TitleText } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import React, { useMemo, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import styled from "styled-components/native";

interface RepeatBottomSheetProps {
	weekdays: Weekdays[];
	onClose: (weekdays: Weekdays[]) => void;
}
export const RepeatBottomSheet: React.FC<RepeatBottomSheetProps> = ({ weekdays, onClose }) => {
	const { format } = useI18n();

	const weekdaysLinkList = useMemo(
		() => [
			{
				label: format("alarm.new.repeat.weekdays"),
				value: [Weekdays.MONDAY, Weekdays.TUESDAY, Weekdays.WEDNESDAY, Weekdays.THURSDAY, Weekdays.FRIDAY],
			},
			{
				label: format("alarm.new.repeat.monday"),
				value: [Weekdays.MONDAY],
			},
			{
				label: format("alarm.new.repeat.tuesday"),
				value: [Weekdays.TUESDAY],
			},
			{
				label: format("alarm.new.repeat.wednesday"),
				value: [Weekdays.WEDNESDAY],
			},
			{
				label: format("alarm.new.repeat.thursday"),
				value: [Weekdays.THURSDAY],
			},
			{
				label: format("alarm.new.repeat.friday"),
				value: [Weekdays.FRIDAY],
			},
			{
				label: format("alarm.new.repeat.saturday"),
				value: [Weekdays.SATURDAY],
			},
			{
				label: format("alarm.new.repeat.sunday"),
				value: [Weekdays.SUNDAY],
			},
		],
		[]
	);

	const [triggeredElements, setTriggeredElements] = useState(weekdays ?? weekdaysLinkList[0].value);

	const pushWithoutDuplicate = (elements: Weekdays[]): Weekdays[] => {
		triggeredElements.push(...elements);
		return triggeredElements.filter((value, i) => triggeredElements.indexOf(value) === i);
	};

	return (
		<Container>
			<Title style={{ alignSelf: "center" }}>{format("alarm.new.repeat.title")}</Title>
			<Description>{format("alarm.new.repeat.description")}</Description>
			<ListContainer
				onPress={() =>
					setTriggeredElements(
						weekdaysLinkList[0].value.every((value) => triggeredElements.includes(value))
							? triggeredElements.filter((value) => value === (Weekdays.SATURDAY || Weekdays.SUNDAY))
							: pushWithoutDuplicate(weekdaysLinkList[0].value)
					)
				}
			>
				<PrimaryText>{format("alarm.new.repeat.weekdays")}</PrimaryText>
				<View
					style={
						weekdaysLinkList[0].value.every((value) => triggeredElements.includes(value))
							? styles.circlePress
							: styles.circleNormal
					}
				>
					<Image
						style={{ height: 14, width: 14, tintColor: colors.white }}
						source={require("@assets/images/check.png")}
					/>
				</View>
			</ListContainer>
			<Divider width={350} style={{ alignSelf: "center" }} />
			{weekdaysLinkList.slice(1).map((element, index, array) => (
				<View key={element.label}>
					<ListContainer
						onPress={() =>
							setTriggeredElements(
								triggeredElements.includes(weekdaysLinkList[index + 1].value[0])
									? triggeredElements.filter((value) => value !== weekdaysLinkList[index + 1].value[0])
									: pushWithoutDuplicate([weekdaysLinkList[index + 1].value[0]])
							)
						}
					>
						<PrimaryText>{element.label}</PrimaryText>
						<View
							style={
								triggeredElements.includes(weekdaysLinkList[index + 1].value[0])
									? styles.circlePress
									: styles.circleNormal
							}
						>
							<Image
								style={{ height: 14, width: 14, tintColor: colors.white }}
								source={require("@assets/images/check.png")}
							/>
						</View>
					</ListContainer>
					{index < array.length - 1 ? <Divider width={350} style={{ alignSelf: "center" }} /> : null}
				</View>
			))}
			<QuadraryButton style={{ alignSelf: "center" }} onPress={() => onClose(triggeredElements)}>
				{format("alarm.new.save_button")}
			</QuadraryButton>
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
	margin-bottom: 36px;
`;

const Description = styled.Text`
	${textStyles.primary};
	align-self: center;
	justify-content: center;
	margin-bottom: 60px;
	padding: 0 66px;
	text-align: center;
`;
