import {
	FeedEntityComponentType,
	FeedEntityStyle,
	FeedEntityType,
	InputType,
	ParagraphStyle,
	UserInputStyle,
} from "./type";

/**
 * Factory for the notification data post query.
 */
export function createTemplates() {
	return [
		{
			type: FeedEntityType.CALIBRATION,
			style: FeedEntityStyle.WHITE_WITH_PURPLE_GRADIENT_BORDER,
			title: "banner.calibration.title",
			secondaryTitle: "banner.calibration.title",
			priority: 1,
			name: "Calibration with question 0",
			actions: [],
			iconId: 1,
			components: [
				{
					type: FeedEntityComponentType.PARAGRAPH,
					configuration: {
						style: ParagraphStyle.DEFAULT,
						translationKey: "onboarding.wear.info.top",
						properties: {},
					},
				},
				{
					type: FeedEntityComponentType.USER_INPUT,
					configuration: {
						style: UserInputStyle.DEFAULT,
						inputType: InputType.SELECT,
						title: "home.banner.common.select",
						inputConfig: {
							label: "calibration.recommandation.6.question.label",
							minCount: 1,
							maxCount: 2,
							options: [
								{
									label: "calibration.recommandation.6.question.option.0",
									actions: [],
								},
								{
									label: "calibration.recommandation.6.question.option.1",
									actions: [],
								},
								{
									label: "calibration.recommandation.6.question.option.2",
									actions: [],
								},
							],
						},
					},
				},
			],
		},
		{
			type: FeedEntityType.CALIBRATION,
			style: FeedEntityStyle.WHITE_WITH_RED_BORDER,
			title: "banner.calibration.title",
			secondaryTitle: "banner.calibration.title",
			priority: 1,
			name: "Calibration with question 0",
			actions: [],
			iconId: 1,
			components: [
				{
					type: FeedEntityComponentType.PARAGRAPH,
					configuration: {
						style: ParagraphStyle.DEFAULT,
						translationKey: "onboarding.wear.info.top",
						properties: {},
					},
				},
				{
					type: FeedEntityComponentType.USER_INPUT,
					configuration: {
						style: UserInputStyle.DEFAULT,
						inputType: InputType.SELECT,
						title: "home.banner.common.select",
						inputConfig: {
							label: "calibration.recommandation.6.question.label",
							minCount: 1,
							maxCount: 1,
							options: [
								{
									label: "global.yes",
									actions: [],
								},
								{
									label: "global.no",
									actions: [],
								},
							],
						},
					},
				},
			],
		},
		{
			type: FeedEntityType.CALIBRATION,
			style: FeedEntityStyle.WHITE_WITH_BLUE_BORDER,
			title: "banner.calibration.title",
			secondaryTitle: "banner.calibration.title",
			priority: 1,
			name: "Calibration with question 0",
			actions: [],
			iconId: 1,
			components: [
				{
					type: FeedEntityComponentType.PARAGRAPH,
					configuration: {
						style: ParagraphStyle.DEFAULT,
						translationKey: "onboarding.wear.info.top",
						properties: {},
					},
				},
			],
		},
		{
			type: FeedEntityType.CALIBRATION,
			style: FeedEntityStyle.WHITE_WITH_LIGHT_BLUE_BORDER,
			title: "banner.calibration.title",
			secondaryTitle: "banner.calibration.title",
			priority: 1,
			name: "Calibration with question 0",
			actions: [],
			iconId: 1,
			components: [
				{
					type: FeedEntityComponentType.PARAGRAPH,
					configuration: {
						style: ParagraphStyle.DEFAULT,
						translationKey: "onboarding.wear.info.top",
						properties: {},
					},
				},
			],
		},
	];
}
