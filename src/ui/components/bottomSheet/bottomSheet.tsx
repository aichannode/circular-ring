import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { useForwardedRef } from "@ui/utils/useForwardedRef";
import { Signal } from "micro-signals";
import React, { useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { BackHandler, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface CircularBottomSheetHandle extends BottomSheetModalMethods {
	asyncClose: () => Promise<void>;
}

interface BottomSheetProps {
	snapPoints: Array<number>;
	children: JSX.Element;
	allowSwipeDownToClose?: boolean;
	onChange?: (index: number) => void;
}
export const CircularBottomSheet = React.forwardRef<CircularBottomSheetHandle, BottomSheetProps>(
	function CircularBottomSheet({ onChange, children, snapPoints, allowSwipeDownToClose = true }, ref) {
		const closedSignal = useRef(new Signal<void>());

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

		useImperativeHandle(inRef, () => ({
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			...inRef.current!,
			asyncClose: async () => {
				inRef.current?.close();
				await closedSignal.current.promisify();
			},
		}));

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
				onDismiss={() => {
					closedSignal.current.dispatch();
				}}
				enableContentPanningGesture={allowSwipeDownToClose}
				snapPoints={snapPoints}
				backdropComponent={renderBackdrop}
				style={{ paddingBottom: safeArea.bottom }}
				activeOffsetY={[-1, 1]}
				failOffsetX={[-5, 5]}
				handleComponent={null}
				onChange={onChange}
			>
				{children}
			</BottomSheetModal>
		);
	}
);

export const CircularBottomScrollSheet = React.forwardRef<BottomSheetModal, BottomSheetProps>(
	function CircularBottomScrollSheet({ children, snapPoints, allowSwipeDownToClose = true }, ref) {
		const closedSignal = useRef(new Signal<void>());
		const safeArea = useSafeAreaInsets();
		const renderBackdrop = useCallback(
			// eslint-disable-next-line react/jsx-props-no-spreading
			(props) => <BottomSheetBackdrop disappearsOnIndex={-1} appearsOnIndex={0} {...props} />,
			[]
		);

		const { height: screenHeight } = useWindowDimensions();

		const clampedSnapPoints = snapPoints.map((point) => {
			return Math.min(point, screenHeight - safeArea.top - 20);
		});

		const inRef = useForwardedRef(ref);
		const closeSheet = useCallback(() => {
			inRef.current?.close();
			return true;
		}, []);

		useImperativeHandle(inRef, () => ({
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			...inRef.current!,
			asyncClose: async () => {
				inRef.current?.close();
				await closedSignal.current.promisify();
			},
		}));

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
				onDismiss={() => {
					closedSignal.current.dispatch();
				}}
				snapPoints={clampedSnapPoints}
				enableContentPanningGesture={allowSwipeDownToClose}
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
