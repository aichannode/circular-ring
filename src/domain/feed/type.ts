import { WordingKey } from "src/wordings";

export enum IconType {
	URL = "URL",
	LOCAL = "LOCAL",
	OPEN_SELECTION = "OPEN_SELECTION",
}
export enum FeedEntityAction {
	OPEN_WEB = "OPEN_WEB",
	APP_PAGE = "APP_PAGE",
}

export enum FeedEntityType {
	NOTIFICATION = "NOTIFICATION",
	RECOMMENDATION = "RECOMMENDATION",
	CALIBRATION = "CALIBRATION",
}

type Icon = {
	type: IconType;
	icon: string;
};

// TODO extract when action architecture will be defined
export type ClientAction = {
	type: FeedEntityAction;
	data: any; // TODO to tag type
};

export enum FeedEntityComponentType {
	PARAGRAPH = "PARAGRAPH",
	GRAPH = "GRAPH",
	SCORES = "SCORES",
	METRICS = "METRICS",
	USER_INPUT = "USER_INPUT",
}

export enum FeedEntityStyle {
	ORANGE_GRADIENT = "ORANGE_GRADIENT",
	WHITE_WITH_ORANGE_BORDER = "WHITE_WITH_ORANGE_BORDER",
	WHITE_WITH_LIGHT_BLUE_BORDER = "WHITE_WITH_LIGHT_BLUE_BORDER",
	WHITE_WITH_BLUE_BORDER = "WHITE_WITH_BLUE_BORDER",
	WHITE_WITH_DARK_BLUE_BORDER = "WHITE_WITH_DARK_BLUE_BORDER",
	WHITE_WITH_RED_BORDER = "WHITE_WITH_RED_BORDER",
	WHITE_WITH_PURPLE_GRADIENT_BORDER = "WHITE_WITH_PURPLE_GRADIENT_BORDER",
}

export enum ParagraphStyle {
	DEFAULT = "DEFAULT",
}

export type ParagraphComponentConfigurationDto = {
	id: number;
	type: FeedEntityComponentType.PARAGRAPH;
	configuration: {
		style: ParagraphStyle;
		translationKey: WordingKey;
		properties?: Record<string, string | number | boolean | Date | null | undefined>;
	};
};

export enum InputType {
	SELECT = "SELECT",
	SLIDER = "SLIDER",
	DATE_PICKER = "DATE_PICKER",
}

type OptionDto = {
	id: number;
	label: WordingKey;
	icon: Icon;
	actions: ClientAction[];
};

export enum UserInputStyle {
	DEFAULT = "DEFAULT",
}

type InputTypeConfig<T extends InputType, C> = {
	style: UserInputStyle;
	title: WordingKey;
	inputType: T;
	inputConfig: {
		answeredAt: string | null;
	} & C;
};

export type SelectInputTypeConfig = InputTypeConfig<
	InputType.SELECT,
	{
		label?: WordingKey;
		minCount: number;
		maxCount: number;
		options: OptionDto[];
		selectedOptions?: number[];
	}
>;

export type SliderInputTypeConfig = InputTypeConfig<
	InputType.SLIDER,
	{
		unit: WordingKey;
		min: number;
		max: number;
		value: number;
	}
>;

export type DatePickerInputTypeConfig = InputTypeConfig<
	InputType.DATE_PICKER,
	{
		value: Date;
	}
>;

export type UserInputConfiguration = SelectInputTypeConfig | SliderInputTypeConfig | DatePickerInputTypeConfig;

export type UserInputComponentConfigurationDto = {
	id: number;
	type: FeedEntityComponentType.USER_INPUT;
	configuration: UserInputConfiguration;
};

export type FeedEntityComponentDto = ParagraphComponentConfigurationDto | UserInputComponentConfigurationDto;

export type Activity = {
	type: Omit<FeedEntityType, FeedEntityType.NOTIFICATION>;
	style: Omit<FeedEntityStyle, FeedEntityStyle.ORANGE_GRADIENT>;
};

export type Notification = {
	type: FeedEntityType.NOTIFICATION;
	style: FeedEntityStyle.ORANGE_GRADIENT;
};

type CommonFeedEntityProps = {
	id: number;
	title: WordingKey;
	secondaryTitle: WordingKey;
	startDate: string;
	icon: Icon;
	priority: number;
	actions: ClientAction[];
	components: FeedEntityComponentDto[];
};

export type FeedNotification = CommonFeedEntityProps & Notification;
export type FeedRecommendation = CommonFeedEntityProps & Activity;

export type FeedEntity = FeedNotification | FeedRecommendation;

export type NotificationsState = {
	clientSideClosed: number[];
};

export type InputAnswer<T extends InputType = never> = T extends InputType.SELECT ? number[] : never;

export type InputValueTest<T extends InputType = never> = T extends InputType.SLIDER ? number : string;


export type UserInputState<T extends InputType = any> = {
	id: number;
	answeredAt: string;
	feedEntryId: number;
	answer?: InputAnswer<T>;
	value?: InputValueTest<T>;
	compId?: number;
};

export type UserInputStates = Array<UserInputState>;