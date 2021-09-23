import React, { PureComponent, ReactNode } from "react";
import {
	LayoutChangeEvent,
	NativeScrollEvent,
	NativeSyntheticEvent,
	Platform,
	ScrollViewProps,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export interface HorizontalPickerProps<T> extends ScrollViewProps {
	data: T[];
	renderItem: (item: T, index?: number) => ReactNode;
	itemWidth: number;
	item?: T;
	animatedScrollToDefaultIndex?: boolean;
	onItemChange?: (item: T) => void;
}

export type HorizontalPickerState = {
	scrollViewWidth: number;
};

export class HorizontalPicker<T> extends PureComponent<HorizontalPickerProps<T>, HorizontalPickerState> {
	private paddingSide: number;
	private refScrollView: React.RefObject<ScrollView>;
	private ignoreNextScroll: boolean;
	private timeoutDelayedSnap: number | NodeJS.Timeout;
	private currentPositionX: number;
	private readonly defaultScrollEventThrottle = 16;
	private readonly defaultDecelerationRate = Platform.OS == "ios" ? 50 : 0.9;

	constructor(props: HorizontalPickerProps<T>) {
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

		if (this.props.onItemChange != null && !this.ignoreNextScroll) {
			const position = Math.min(
				this.props.data.length - 1,
				Math.max(0, Math.round(this.currentPositionX / this.props.itemWidth))
			);
			this.props.onItemChange(this.props.data[position]);
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
		if (this.refScrollView.current != null && this.props.item != null) {
			const { item, itemWidth, data } = this.props;

			const itemIndex = Math.max(0, data.indexOf(item));
			if (itemIndex >= data.length) {
				return;
			}

			const x = itemIndex * itemWidth;
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
				style={{ flexGrow: 0 }}
			>
				{data.map((item: T, index: number) => (
					<TouchableWithoutFeedback onPress={() => this.scrollToPosition(index)} key={index}>
						<View>{renderItem(item, index)}</View>
					</TouchableWithoutFeedback>
				))}
			</ScrollView>
		);
	}
}
