import React, { PureComponent, ReactNode } from "react";
import {
	LayoutChangeEvent,
	NativeScrollEvent,
	NativeSyntheticEvent,
	Platform,
	ScrollView,
	ScrollViewProps,
	TouchableWithoutFeedback,
	View,
} from "react-native";

export interface HorizontalPickerProps extends ScrollViewProps {
	data: any[];
	renderItem: (item: any, index: number) => ReactNode;
	itemWidth: number;
	defaultIndex?: number;
	animatedScrollToDefaultIndex?: boolean;
	onChange?: (position: number) => void;
}

export type HorizontalPickerState = {
	scrollViewWidth: number;
};

export class HorizontalPicker extends PureComponent<HorizontalPickerProps, HorizontalPickerState> {
	private paddingSide: number;
	private refScrollView: React.RefObject<ScrollView>;
	private ignoreNextScroll: boolean;
	private timeoutDelayedSnap: number | NodeJS.Timeout;
	private currentPositionX: number;
	private readonly defaultScrollEventThrottle = 16;
	private readonly defaultDecelerationRate = Platform.OS == "ios" ? 50 : 0.9;

	constructor(props: HorizontalPickerProps) {
		super(props);
		this.paddingSide = 0;
		this.refScrollView = React.createRef();
		this.ignoreNextScroll = false;
		this.timeoutDelayedSnap = 0;
		this.currentPositionX = 0;

		this.state = {
			scrollViewWidth: 0,
		};
	}

	private onLayoutScrollView = (e: LayoutChangeEvent) => {
		setTimeout(this.scrollToDefaultIndex, 0);
		const { width } = e.nativeEvent.layout;
		this.setState(() => ({ scrollViewWidth: width }));
		this.paddingSide = width / 2 - this.props.itemWidth / 2;

		if (this.props.onLayout != null) {
			this.props.onLayout(e);
		}
	};

	private onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
		this.currentPositionX = e.nativeEvent.contentOffset.x;

		if (this.props.onScroll != null) {
			this.props.onScroll(e);
		}

		if (this.props.onChange != null && !this.ignoreNextScroll) {
			const position = Math.min(
				this.props.data.length - 1,
				Math.max(0, Math.round(this.currentPositionX / this.props.itemWidth))
			);
			this.props.onChange(position);
			this.setDelayedSnap(position);
		}
	};

	private onScrollBeginDrag = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
		this.ignoreNextScroll = false;

		if (this.props.onScrollBeginDrag != null) {
			this.props.onScrollBeginDrag(e);
		}
	};

	private onMomentumScrollBegin = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
		this.ignoreNextScroll = false;

		if (this.props.onMomentumScrollBegin != null) {
			this.props.onMomentumScrollBegin(e);
		}
	};

	public scrollToPosition = (position: number) => {
		const { itemWidth } = this.props;
		const x = position * itemWidth;
		this.ignoreNextScroll = true;

		if (this.refScrollView.current != null) {
			this.refScrollView.current.scrollTo({ x, y: 0, animated: true });
		}
	};

	private cancelDelayedSnap = () => {
		clearTimeout(this.timeoutDelayedSnap as NodeJS.Timeout);
	};

	private setDelayedSnap = (position: number) => {
		const snapTimeout = 300;
		this.cancelDelayedSnap();
		this.timeoutDelayedSnap = setTimeout(() => {
			this.scrollToPosition(position);
		}, snapTimeout);
	};

	scrollToDefaultIndex = () => {
		if (this.refScrollView.current != null && this.props.defaultIndex != null) {
			const { defaultIndex, itemWidth, data } = this.props;

			if (defaultIndex >= data.length) {
				return;
			}

			const x = defaultIndex * itemWidth;
			this.refScrollView.current.scrollTo({ x, y: 0, animated: this.props.animatedScrollToDefaultIndex || false });
		}
	};

	render() {
		const { data, renderItem, ...props } = this.props;

		return (
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				scrollEventThrottle={this.defaultScrollEventThrottle}
				decelerationRate={this.defaultDecelerationRate}
				contentContainerStyle={{ paddingHorizontal: this.paddingSide }}
				ref={this.refScrollView}
				onLayout={this.onLayoutScrollView}
				onScroll={this.onScroll}
				onScrollBeginDrag={this.onScrollBeginDrag}
				onMomentumScrollBegin={this.onMomentumScrollBegin}
				{...props}
			>
				{data.map((item: any, index: number) => (
					<TouchableWithoutFeedback onPress={() => this.scrollToPosition(index)} key={index}>
						<View>{renderItem(item, index)}</View>
					</TouchableWithoutFeedback>
				))}
			</ScrollView>
		);
	}
}
