import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import {
	FeedEntityStyle,
	InputType,
	SelectInputTypeConfig,
	UserInputConfiguration,
	UserInputComponentConfigurationDto,
	Activity,
} from "@domain/feed/type";
import ringGradient from "@assets/images/ringGradient.png";
import chevronTop from "@assets/images/topArrowBlack.png";
import { Image, LayoutChangeEvent, Pressable, View, ViewStyle } from "react-native";
import { PrimaryText, Strong } from "@ui/components/text";
import { SelectableButton } from "@ui/components/selectableButton";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useServices } from "@core/services";
import { getGradient } from "../utils";

type Props = UserInputComponentConfigurationDto & {
    palette: Activity["style"]
    compId: number
}

function Header({ title, isAnswered, isClosed }: UserInputConfiguration & { isClosed: boolean, isAnswered: boolean }) {
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
			<Strong style={{ flex: 1 }}>
				<PrimaryText>{isAnswered ? format("home.kira.question.answered") : format(title)}</PrimaryText>
			</Strong>
			<Image source={chevronTop} style={{ transform: [{ rotate: isClosed ? "180deg" : "0deg" }] }} />
		</View>
	);
}

type SelectProps = SelectInputTypeConfig["inputConfig"] & {
	palette: FeedEntityStyle;
	onLayout: (e: LayoutChangeEvent) => void;
};

function Select({
        label,
		minCount,
        maxCount,
        options,
		selectedOptions,
        palette,
        compId,
        onLayout,
    }: SelectProps & {compId: number}
) {
    const { format } = useI18n()
    const [selectedIds, setSelectedIds] = useState<number[]>(selectedOptions ?? [])
	const isRadio = minCount === 1 && maxCount === 1
    const hasReachedMaxSelectionCount = selectedIds.length === maxCount && !isRadio
    const { feedService } = useServices()

    // Send answer to server
    useEffect(function() {
        feedService.answerRecommendation(compId, selectedIds)
    }, [selectedIds])

	return (
		<View
			onLayout={onLayout}
			style={{
				paddingVertical: 14,
				paddingHorizontal: 21,
			}}
		>
			<PrimaryText style={{ fontWeight: "500", fontSize: 13 }}>{format(label)}</PrimaryText>
			<View style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
				{options.map((option, key) => {
					const isSelected = selectedIds.includes(option.id);
					return (
						<SelectableButton
							style={{ marginRight: 8, marginTop: 8 }}
							colors={getGradient(palette)?.slice(0,2) as [string, string]}
							isDisabled={hasReachedMaxSelectionCount && !isSelected}
							key={key}
							onPress={function () {
								if (
									selectedIds.includes(option.id)
								) {
									// CIR-429 need at least one option
									if (selectedIds.length === 1) return
									// Unselect
									setSelectedIds(selectedIds.filter((id) => id !== option.id));
								} else {
									// Select
									// It is a radio selection, we can pick just one
									if (isRadio) {
										setSelectedIds([option.id])
										return
									}
									if (!hasReachedMaxSelectionCount) {
										setSelectedIds([...selectedIds, option.id]);
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
	const [isVisible, setIsVisible] = useState(isAnimatedOnMount ? (isClosed ? true : false) : isClosed ? false : true);
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

export function UserInput({ compId, configuration, palette }: Props) {
    const {
        inputType,
        inputConfig,
    } = configuration
    const [isClosed, setIsClosed] = useState(!!inputConfig.answeredAt)
    const paperHeightRef = useSharedValue(0)

	/**
	 * Note on layout.
	 * Since Android does not support z-index, we need to use a trick with flex-box to have
	 * the paper folding under the header without override it.
	 * We just unintituively inverse the Header>Paper order in the flux to Paper<Order
	 * and set the flex direction of the container to "column-reverse". The views will be inverted,
	 * but the internal agency will remain. Making the paper sliding under the header. You are welcome.
	 */

    return (
        <View style={{ marginHorizontal: 5, overflow: "hidden", display: "flex", flexDirection: "column-reverse"}}>
            <Foldable
                heightRef={paperHeightRef}
                isClosed={isClosed}
                style={{
                    backgroundColor: "white",
                    borderBottomStartRadius: 2,
                    borderBottomEndRadius: 2
                }}
            >
                {inputType === InputType.SELECT && (
                    <Select
                        compId={compId}
                        onLayout={e => paperHeightRef.value = e.nativeEvent.layout.height}
                        palette={palette as FeedEntityStyle}
                        {...inputConfig}
                    />
                )}
            </Foldable>
            <Pressable onPress={() => setIsClosed(!isClosed)}>
                <Header
					isClosed={isClosed}
					isAnswered={!!inputConfig.answeredAt}
					{...configuration}
				/>
            </Pressable>
        </View>
    )
}
