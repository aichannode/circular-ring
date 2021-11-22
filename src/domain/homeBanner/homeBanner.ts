export enum IconType {
	URL = "URL",
	LOCAL = "LOCAL",
	OPEN_SELECTION = "OPEN_SELECTION"
}
export enum BannerAction {
	OPEN_WEB = "OPEN_WEB",
	APP_PAGE = "APP_PAGE",
}

type Icon = {
	type: IconType;
	icon: string;
}

// TODO extract when action architecture will be defined
type ClientAction = {
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

type ParagraphComponentConfigurationDto = {
	type: BannerComponentType.PARAGRAPH;
	configuration: {
		style: string;
		translationKey: string;
		properties: Record<string, string>;
	}
}

export enum InputType {
	SELECT = "SELECT"
}

type OptionDto = {
	id: number
	label: string
	icon: Icon
	actions: ClientAction
	internalActions: any // TODO typing
}

type UserInputComponentConfigurationDto = {
	type: BannerComponentType.USER_INPUT;
	configuration: {
		style: string;
		inputType: string;
		inputConfig: {
			label: string
			minCount: number
			maxCount: number
			options: OptionDto
		}
	}
}

export type BannerComponentDto =
	| ParagraphComponentConfigurationDto
	| UserInputComponentConfigurationDto

export interface HomeBanner {
	id: number;
	title: string;
	icon: Icon;
	priority: 0;
	actions: ClientAction[];
	components: BannerComponentDto
}

export interface ReadBannersInfo {
	bannerIds: number[];
	lastRead?: Date;
}
