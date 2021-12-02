import { WordingKey } from "src/wordings"

export enum IconType {
	URL = "URL",
	LOCAL = "LOCAL",
	OPEN_SELECTION = "OPEN_SELECTION"
}
export enum BannerAction {
	OPEN_WEB = "OPEN_WEB",
	APP_PAGE = "APP_PAGE",
}

export enum BannerType {
	NOTIFICATION = "NOTIFICATION",
	RECOMMENDATION = "RECOMMENDATION",
	CALIBRATION = "CALIBRATION",
}

type Icon = {
	type: IconType;
	icon: string;
}

// TODO extract when action architecture will be defined
export type ClientAction = {
	type: BannerAction;
	data: any; // TODO to tag type
}

export enum BannerComponentType {
	PARAGRAPH = "PARAGRAPH",
	GRAPH = "GRAPH",
	SCORES = "SCORES",
	METRICS = "METRICS",
	USER_INPUT = "USER_INPUT"
}

export enum BannerStyle {
	ORANGE_GRADIENT = "ORANGE_GRADIENT",
	WHITE_WITH_ORANGE_BORDER = "WHITE_WITH_ORANGE_BORDER",
	WHITE_WITH_LIGHT_BLUE_BORDER = "WHITE_WITH_LIGHT_BLUE_BORDER",
	WHITE_WITH_DARK_BLUE_BORDER = "WHITE_WITH_DARK_BLUE_BORDER",
	WHITE_WITH_RED_BORDER = "WHITE_WITH_RED_BORDER",
	WHITE_WITH_PURPLE_GRADIENT = "WHITE_WITH_PURPLE_GRADIENT"
}

export enum ParagraphStyle {
	DEFAULT = "DEFAULT"
}

export type ParagraphComponentConfigurationDto = {
	type: BannerComponentType.PARAGRAPH;
	configuration: {
		style: ParagraphStyle;
		translationKey: WordingKey;
		properties?: Record<string, string | number | boolean | Date | null | undefined>;
	}
}

export enum InputType {
	SELECT = "SELECT"
}

type OptionDto = {
	id: number
	label: WordingKey
	icon: Icon
	actions: ClientAction[]
}

export enum UserInputStyle {
	DEFAULT = "DEFAULT"
}

type InputTypeConfig<T extends InputType, C> = {
	style: UserInputStyle;
	title: WordingKey;
	inputType: T;
	inputConfig: C
}

export type SelectInputTypeConfig = InputTypeConfig<InputType.SELECT, {
	label: WordingKey
	minCount: number
	maxCount: number
	options: OptionDto[]
}>

export type UserInputConfiguration = SelectInputTypeConfig & {isAnswered: boolean}

export type UserInputComponentConfigurationDto = {
	type: BannerComponentType.USER_INPUT;
	configuration: UserInputConfiguration
}

export type BannerComponentDto =
	| ParagraphComponentConfigurationDto
	| UserInputComponentConfigurationDto

export type Activity = {
	type: BannerType.NOTIFICATION;
	style: Omit<BannerStyle, BannerStyle.ORANGE_GRADIENT>;
}

export type Notification = {
	type: Omit<BannerType, BannerType.NOTIFICATION>;
	style: BannerStyle.ORANGE_GRADIENT;
}

export type Banner<T> = T & {
	id: number;
	title: WordingKey;
	secondaryTitle: WordingKey;
	startDate: string;
	icon: Icon;
	priority: number;
	actions: ClientAction[];
	components: BannerComponentDto[];
}

export type HomeBanner = Banner<Notification> | Banner<Activity>

export interface ReadNotificationInfo {
	clientSideClosed: number[];
}
