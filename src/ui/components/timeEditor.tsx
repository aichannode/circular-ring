import DateTimePicker from "@react-native-community/datetimepicker";
import { CircularBottomSheet, CircularBottomSheetHandle } from "@ui/components/bottomSheet/bottomSheet";
import { PrimaryButton, TertiaryButton } from "@ui/components/buttons";
import { ResponsiveCenterView, Row } from "@ui/components/layout";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import { textStyles } from "@ui/styles/textStyles";
import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Platform } from "react-native";
import styled from "styled-components/native";

/**
 * iOS bottom sheet
 */

interface EditTimeBottomSheetProps {
	title: string;
	description: string;
	defaultTime: Date;
	onSave: (time: Date) => void;
	onClose: () => void;
}

export const EditTimeBottomSheet: React.FC<EditTimeBottomSheetProps> = ({
	title,
	description,
	defaultTime,
	onSave,
	onClose,
}) => {
	const { format } = useI18n();

	const [time, setTime] = useState(defaultTime);

	return (
		<Container horizontalPadding={0}>
			<TopContainer>
				<Title>{title}</Title>
				<Description>{description}</Description>
			</TopContainer>
			<EditionContainer>
				<DateTimePicker
					value={time}
					mode={"time"}
					display="spinner"
					textColor={colors.textPrimary}
					onChange={(event: Event, selectedTime: Date | undefined) => (selectedTime ? setTime(selectedTime) : null)}
				/>
			</EditionContainer>
			<ButtonContainer gap={35}>
				<TertiaryButton containerBackgroundColor={colors.white} onPress={onClose}>
					{format("global.cancel")}
				</TertiaryButton>
				<PrimaryButton onPress={() => onSave(time)}>{format("global.save")}</PrimaryButton>
			</ButtonContainer>
		</Container>
	);
};

const Container = styled(ResponsiveCenterView)`
	flex: 1;
	justify-content: space-between;
	align-items: center;
`;

const TopContainer = styled.View`
	margin-top: 30px;
`;

const Title = styled.Text`
	${textStyles.mediumTitle};
	text-align: center;
`;

const Description = styled.Text`
	font-size: 14px;
	color: ${colors.textPrimary};
	text-align: center;
	margin-top: 16px;
	margin-bottom: 16px;
`;

const EditionContainer = styled.View`
	flex: 1;
	width: 100%;
	justify-content: center;
`;

const ButtonContainer = styled(Row)`
	height: 38px;
	margin-top: 30px;
	margin-bottom: 30px;
`;

/**
 * Time editor - All platforms
 */

interface TimeEditorProps {
	title: string;
	description: string;
	defaultTime: Date;
	saveTime: (time: Date) => void;
}

export interface TimeEditorRef {
	present: () => void;
}

export const TimeEditor = forwardRef<TimeEditorRef, TimeEditorProps>(
	({ title, description, defaultTime, saveTime }, ref) => {
		const [isVisible, setVisible] = useState(false);

		const editTimeBottomSheetRef = useRef<CircularBottomSheetHandle>(null);

		useImperativeHandle(ref, () => ({
			present: () => {
				if (Platform.OS === "android") {
					setVisible(true);
				} else {
					editTimeBottomSheetRef.current?.present();
				}
			},
		}));

		return (
			<>
				{Platform.OS === "android" ? (
					isVisible && (
						<DateTimePicker
							value={defaultTime}
							mode={"time"}
							is24Hour={true}
							onChange={(event: Event, selectedTime: Date | undefined) => {
								setVisible(false);
								selectedTime ? saveTime(selectedTime) : setVisible(false);
							}}
						/>
					)
				) : (
					<CircularBottomSheet snapPoints={[480]} ref={editTimeBottomSheetRef} allowSwipeDownToClose={false}>
						<EditTimeBottomSheet
							title={title}
							description={description}
							defaultTime={defaultTime}
							onSave={async (time) => {
								await editTimeBottomSheetRef.current?.asyncClose();
								saveTime(time);
							}}
							onClose={async () => await editTimeBottomSheetRef.current?.asyncClose()}
						/>
					</CircularBottomSheet>
				)}
			</>
		);
	}
);
