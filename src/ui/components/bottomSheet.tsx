import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useCallback, useState } from "react";
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

		return (
			<BottomSheetModal
				ref={ref}
				snapPoints={snapPoints}
				backdropComponent={renderBackdrop}
				style={{ paddingBottom: safeArea.bottom }}
			>
				{children}
			</BottomSheetModal>
		);
	}
);
