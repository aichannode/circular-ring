import ringGradient from "@assets/images/ringGradient.png";
import chevronTop from "@assets/images/topArrowBlack.png";
import { useServices } from "@core/services";
import {
	Activity,
	DatePickerInputTypeConfig,
	FeedEntityStyle,
	InputType,
	SelectInputTypeConfig,
	SliderInputTypeConfig,
	UserInputComponentConfigurationDto,
	UserInputConfiguration,
} from "@domain/feed/type";
import DateTimePicker from "@react-native-community/datetimepicker";
import { PrimaryButton, SecondaryButton } from "@ui/components/buttons";
import { SelectableButton } from "@ui/components/selectableButton";
import { SliderBetweenTwoValues } from "@ui/components/sliderBetweenTwoValues";
import { PrimaryText, Strong } from "@ui/components/text";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import React, { PropsWithChildren, useCallback, useEffect, useRef, useState } from "react";
import { Image, LayoutChangeEvent, Pressable, View, ViewStyle } from "react-native";
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { getGradient } from "../business";

type Props = UserInputComponentConfigurationDto & {
	palette: Activity["style"];
	compId: number;
	feedEntryId: number;
};

function Header({ title, isAnswered, isClosed }: UserInputConfiguration & { isClosed: boolean; isAnswered: boolean }) {
	const { format } = useI18n();

	return (
		<View
			style={{
				display: "flex",
				flexDirection: "row",
				paddingVertical: 13,
				paddingLeft: 23,
				paddingRight: 28,
				alignItems: "center",
				backgroundColor: "white",
				borderBottomColor: colors.midGray,
				borderBottomWidth: 1,
			}}
		>
			<Image style={{ marginRight: 20 }} source={ringGradient} />
			{(isAnswered || title) && (
				<Strong style={{ flex: 1 }}>
					<PrimaryText>{isAnswered ? format("home.kira.question.answered") : format(title)}</PrimaryText>
				</Strong>
			)}
			<Image source={chevronTop} style={{ transform: [{ rotate: isClosed ? "180deg" : "0deg" }] }} />
		</View>
	);
}

interface BaseProps {
	palette: FeedEntityStyle;
	onLayout: (e: LayoutChangeEvent) => void;
}

type SelectProps = SelectInputTypeConfig["inputConfig"] &
	BaseProps & {
		canSave: boolean;
	};

function Select({
	label,
	minCount,
	maxCount,
	options,
	selectedOptions,
	palette,
	compId,
	canSave,
	onLayout,
	feedEntryId,
}: SelectProps & { compId: number; feedEntryId: number }) {
	const { format } = useI18n();
	const [selectedIds, setSelectedIds] = useState<number[]>(selectedOptions ?? []);
	const isRadio = minCount === 1 && maxCount === 1;
	const hasReachedMaxSelectionCount = selectedIds.length === maxCount && !isRadio;
	const isValidAnswer = selectedIds.length >= minCount && selectedIds.length <= maxCount;
	const { feedService } = useServices();

	return (
		<View onLayout={onLayout}>
			<View
				onLayout={onLayout}
				style={{
					paddingVertical: 14,
					paddingHorizontal: 21,
				}}
			>
				{label && <PrimaryText style={{ fontWeight: "500", fontSize: 13 }}>{format(label)}</PrimaryText>}
				<View style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", paddingBottom: 8 }}>
					{options.map((option, key) => {
						const isSelected = selectedIds.includes(option.id);
						if (option.label === null || option.label === undefined) return;
						return (
							<SelectableButton
								style={{ marginRight: 8, marginTop: 8 }}
								colors={getGradient(palette)?.slice(0, 2) as [string, string]}
								isDisabled={hasReachedMaxSelectionCount && !isSelected}
								key={key}
								onPress={function () {
									// Can modify only if save is enable
									if (canSave) {
										if (selectedIds.includes(option.id)) {
											// CIR-429 need at least one option
											if (selectedIds.length === 1) return;
											// Unselect
											setSelectedIds(selectedIds.filter((id) => id !== option.id));
										} else {
											// Select
											// It is a radio selection, we can pick just one
											if (isRadio) {
												setSelectedIds([option.id]);
												return;
											}
											if (!hasReachedMaxSelectionCount) {
												setSelectedIds([...selectedIds, option.id]);
											}
										}
									}
								}}
								bgColor="white"
								selected={isSelected}
							>
								{format(option.label)}
							</SelectableButton>
						);
					})}
				</View>
			</View>
			{canSave && (
				<View style={{ borderTopColor: colors.midGray, borderTopWidth: 1, alignItems: "center", paddingVertical: 20 }}>
					<PrimaryButton
						disabled={!isValidAnswer}
						onPress={function () {
							feedService.answerRecommendation(feedEntryId, compId, selectedIds);
						}}
					>
						{format("global.save")}
					</PrimaryButton>
				</View>
			)}
		</View>
	);
}

type DatePickerProps = DatePickerInputTypeConfig["inputConfig"] & BaseProps;

function DatePicker({
	value: initialDate,
	compId,
	feedEntryId,
	onLayout,
}: DatePickerProps & { compId: number; feedEntryId: number }) {
	const { format } = useI18n();
	const [value, setValue] = useState(initialDate);
	const { feedService } = useServices();

	const cancel = useCallback(() => {
		setValue(initialDate);
	}, []);
	const save = () => {
		feedService.answerRecommendation(feedEntryId, compId, undefined, value.toISOString());
	};

	return (
		<View onLayout={onLayout}>
			<DateTimePicker
				value={value}
				mode="date"
				display="spinner"
				textColor={colors.textPrimary}
				onChange={(event: Event, selectedTime: Date | undefined) => (selectedTime ? setValue(selectedTime) : null)}
			/>
			<View
				style={{
					borderTopColor: colors.midGray,
					borderTopWidth: 1,
					flexDirection: "row",
					justifyContent: "space-between",
					paddingVertical: 20,
					paddingHorizontal: 85,
				}}
			>
				<SecondaryButton onPress={cancel}>{format("global.cancel")}</SecondaryButton>
				<SecondaryButton onPress={save}>{format("ok")}</SecondaryButton>
			</View>
		</View>
	);
}

type SliderProps = SliderInputTypeConfig["inputConfig"] & BaseProps;

function Slider({
	unit,
	min,
	max,
	value: initialValue,
	compId,
	feedEntryId,
}: SliderProps & { compId: number; feedEntryId: number }) {
	const { format } = useI18n();
	const [value, setValue] = useState(initialValue);

	const { feedService } = useServices();

	const save = () => {
		feedService.answerRecommendation(feedEntryId, compId, undefined, value);
	};

	return (
		<>
			<SliderBetweenTwoValues
				title={format(unit)}
				start={min}
				stop={max}
				defaultValue={initialValue}
				value={value}
				setValue={(args) => setValue(Array.isArray(args) ? args[0] : args)}
				minimumTrackTintColor={colors.purple}
				hideResetButton
			/>

			<PrimaryButton onPress={save}>{format("ok")}</PrimaryButton>
		</>
	);
}

function Foldable({
	isClosed,
	isAnimatedOnMount,
	style,
	heightRef,
	children,
}: PropsWithChildren<{
	isAnimatedOnMount?: boolean;
	heightRef: Animated.SharedValue<number>;
	isClosed?: boolean;
	style?: ViewStyle;
}>) {
	const isMountedRef = useRef(false);
	const nextAnimationDirection = useSharedValue<"closing" | "opening">(
		isAnimatedOnMount ? (isClosed ? "closing" : "opening") : isClosed ? "opening" : "closing"
	);
	const [isVisible, setIsVisible] = useState(isAnimatedOnMount ? !!isClosed : !isClosed);
	const animatedValue = useSharedValue(isAnimatedOnMount ? (isClosed ? 0 : -1) : isClosed ? -1 : 0);
	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ translateY: animatedValue.value * heightRef.value }],
		};
	});

	useEffect(
		function () {
			if ((isAnimatedOnMount && !isMountedRef.current) || isMountedRef.current) {
				if (nextAnimationDirection.value === "opening") {
					setIsVisible(true);
				}
				animate(animatedValue, nextAnimationDirection, setIsVisible);
			}
			if (!isMountedRef.current) {
				isMountedRef.current = true;
			}
		},
		[isClosed]
	);

	return <Animated.View style={[animatedStyle, style]}>{isVisible && children}</Animated.View>;
}

function animate(
	animatedValue: Animated.SharedValue<number>,
	nextAnimationDirection: Animated.SharedValue<"closing" | "opening">,
	setIsVisible: (isVisible: boolean) => void
) {
	animatedValue.value = withTiming(
		nextAnimationDirection.value === "closing" ? -1 : 0,
		{
			duration: 200,
			easing: Easing.out(Easing.exp),
		},
		function (isComplete) {
			if (isComplete) {
				const isClosed = nextAnimationDirection.value === "closing";
				nextAnimationDirection.value = isClosed ? "opening" : "closing";
				if (isClosed) {
					runOnJS(setIsVisible)(false);
				}
			}
		}
	);
}

export function UserInput({ feedEntryId, compId, configuration, palette }: Props) {
	const { inputType, inputConfig } = configuration;
	const [isClosed, setIsClosed] = useState(!!inputConfig.answeredAt);
	const paperHeightRef = useSharedValue(0);

	/**
	 * Note on layout.
	 * Since Android does not support z-index, we need to use a trick with flex-box to have
	 * the paper folding under the header without override it.
	 * We just unintituively inverse the Header>Paper order in the flux to Paper<Order
	 * and set the flex direction of the container to "column-reverse". The views will be inverted,
	 * but the internal agency will remain. Making the paper sliding under the header. You are welcome.
	 */

	return (
		<View style={{ marginHorizontal: 5, overflow: "hidden", display: "flex", flexDirection: "column-reverse" }}>
			<Foldable
				heightRef={paperHeightRef}
				isClosed={isClosed}
				style={{
					backgroundColor: "white",
					borderBottomStartRadius: 2,
					borderBottomEndRadius: 2,
				}}
			>
				{inputType === InputType.SELECT && (
					<Select
						canSave={!inputConfig.answeredAt}
						feedEntryId={feedEntryId}
						compId={compId}
						onLayout={(e) => (paperHeightRef.value = e.nativeEvent.layout.height)}
						palette={palette as FeedEntityStyle}
						{...inputConfig}
					/>
				)}
				{inputType === InputType.SLIDER && (
					<Slider
						feedEntryId={feedEntryId}
						compId={compId}
						onLayout={(e) => (paperHeightRef.value = e.nativeEvent.layout.height)}
						palette={palette as FeedEntityStyle}
						{...inputConfig}
					/>
				)}
				{inputType === InputType.DATE_PICKER && (
					<DatePicker
						feedEntryId={feedEntryId}
						compId={compId}
						onLayout={(e) => (paperHeightRef.value = e.nativeEvent.layout.height)}
						palette={palette as FeedEntityStyle}
						{...inputConfig}
					/>
				)}
			</Foldable>
			<Pressable onPress={() => setIsClosed(!isClosed)}>
				<Header isClosed={isClosed} isAnswered={!!inputConfig.answeredAt} {...configuration} />
			</Pressable>
		</View>
	);
}
