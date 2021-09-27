import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useForwardedRef } from "@ui/utils/useForwardedRef";
import React, { useCallback, useEffect } from "react";
import { BackHandler } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface CircularBottomSheetHandle {
	present: () => void;
	close: () => void;
}
interface BottomSheetProps {
	snapPoints: Array<string | number> | Animated.SharedValue<Array<string | number>>;
	children: JSX.Element;
}
export const CircularBottomSheet = React.forwardRef<BottomSheetModal, BottomSheetProps>(
	({ children, snapPoints }, ref) => {
		const safeArea = useSafeAreaInsets();
		const renderBackdrop = useCallback(
			// eslint-disable-next-line react/jsx-props-no-spreading
			(props) => <BottomSheetBackdrop disappearsOnIndex={-1} appearsOnIndex={0} {...props} />,
			[]
		);

		const inRef = useForwardedRef(ref);
		const closeSheet = useCallback(() => {
			inRef.current?.close();
			return true;
		}, []);

		useEffect(() => () => BackHandler.removeEventListener("hardwareBackPress", closeSheet));

		return (
			<BottomSheetModal
				ref={inRef}
				onAnimate={(_, to) => {
					if (to < 0) {
						BackHandler.removeEventListener("hardwareBackPress", closeSheet);
					} else {
						BackHandler.addEventListener("hardwareBackPress", closeSheet);
					}
				}}
				snapPoints={snapPoints}
				backdropComponent={renderBackdrop}
				style={{ paddingBottom: safeArea.bottom }}
				activeOffsetY={[-1, 1]}
				failOffsetX={[-5, 5]}
				handleComponent={null}
			>
				{children}
			</BottomSheetModal>
		);
	}
);

export const CircularBottomScrollSheet = React.forwardRef<BottomSheetModal, BottomSheetProps>(
	({ children, snapPoints }, ref) => {
		const safeArea = useSafeAreaInsets();
		const renderBackdrop = useCallback(
			// eslint-disable-next-line react/jsx-props-no-spreading
			(props) => <BottomSheetBackdrop disappearsOnIndex={-1} appearsOnIndex={0} {...props} />,
			[]
		);

		const inRef = useForwardedRef(ref);
		const closeSheet = useCallback(() => {
			inRef.current?.close();
			return true;
		}, []);

		useEffect(() => () => BackHandler.removeEventListener("hardwareBackPress", closeSheet));

		return (
			<BottomSheetModal
				ref={inRef}
				onAnimate={(_, to) => {
					if (to < 0) {
						BackHandler.removeEventListener("hardwareBackPress", closeSheet);
					} else {
						BackHandler.addEventListener("hardwareBackPress", closeSheet);
					}
				}}
				snapPoints={snapPoints}
				backdropComponent={renderBackdrop}
				style={{ paddingBottom: safeArea.bottom }}
				activeOffsetY={[-1, 1]}
				failOffsetX={[-5, 5]}
			>
				<BottomSheetScrollView>{children}</BottomSheetScrollView>
			</BottomSheetModal>
		);
	}
);
