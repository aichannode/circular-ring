/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FeedRecommendation } from "@domain/feed/type";
import { IconType, InputType, UserInputStyle, FeedEntityComponentType } from "@domain/feed/type";

export const recommendationData: FeedRecommendation = {
	type: "SLEEP",
	id: 568,
	icon: {
		icon: "test",
		type: IconType.LOCAL,
	},
	endDate: null,
	title: "tutorial.sleep",
	priority: 1,
	targetUserId: null,
	startDate: "2022-01-12T12:53:12.008Z",
	components: [
		{
			id: 99,
			type: FeedEntityComponentType.USER_INPUT,
			configuration: {
				style: UserInputStyle.DEFAULT,
				inputType: InputType.SELECT,
				title: "home.banner.common.select",
				inputConfig: {
					//@ts-ignore
					label: "",
					minCount: 1,
					maxCount: 1,
					options: [
						{
							id: 46,
							actions: [],
							label: "tutorial.night",
							icon: {
								icon: "test",
								type: IconType.LOCAL,
							},
						},
						{
							id: 45,
							actions: [],
							label: "tutorial.day",
							icon: {
								icon: "test",
								type: IconType.LOCAL,
							},
						},
					],
					selectedOptions: [45],
					answeredAt: null,
				},
			},
			//@ts-ignore
			BannerTemplateComponent: {
				bannerTemplat: 86,
				bannerCompone: 99,
			},
			options: [
				{
					id: 46,
					actions: [],
					internalActions: [
						{
							type: "GENERATE_BANNER",
							data: {
								templateId: 81,
							},
						},
						{
							type: "GENERATE_BANNER",
							data: {
								templateId: 82,
							},
						},
						{
							type: "GENERATE_BANNER",
							data: {
								templateId: 83,
							},
						},
						{
							type: "GENERATE_BANNER",
							data: {
								templateId: 84,
							},
						},
						{
							type: "GENERATE_BANNER",
							data: {
								templateId: 85,
							},
						},
					],
					iconId: null,
					label: "Night 🌝",
					bannerComponentTemplateId: 99,
					createdAt: "2022-01-11T13:01:41.955Z",
					updatedAt: "2022-01-11T13:01:41.955Z",
					deletedAt: null,
					icon: null,
				},
				{
					id: 45,
					actions: [],
					internalActions: [
						{
							type: "GENERATE_BANNER",
							data: {
								templateId: 81,
							},
						},
						{
							type: "GENERATE_BANNER",
							data: {
								templateId: 82,
							},
						},
						{
							type: "GENERATE_BANNER",
							data: {
								templateId: 83,
							},
						},
						{
							type: "GENERATE_BANNER",
							data: {
								templateId: 84,
							},
						},
						{
							type: "GENERATE_BANNER",
							data: {
								templateId: 85,
							},
						},
					],
					iconId: null,
					label: "Day 🌞",
					bannerComponentTemplateId: 99,
					createdAt: "2022-01-11T13:01:41.953Z",
					updatedAt: "2022-01-11T13:01:41.953Z",
					deletedAt: null,
					icon: null,
				},
			],
		},
		{
			id: 98,
			type: FeedEntityComponentType.PARAGRAPH,
			configuration: {
				style: UserInputStyle.DEFAULT,
				//@ts-ignore

				translationKey: "tutorial.examplerecommendation",
			},
			createdAt: "2022-01-11T13:01:41.947Z",
			updatedAt: "2022-01-11T13:01:41.947Z",
			deletedAt: null,
			BannerTemplateComponent: {
				bannerTemplat: 86,
				bannerCompone: 98,
			},
			options: [],
		},
	],
	style: "WHITE_WITH_DARK_BLUE_BORDER",
	actions: [],
	secondaryTitle: "banner.disturbances.title",
};

export const recommendationDataFeed: FeedRecommendation = {
	type: "CALIBRATION",
	id: 758,
	icon: {
		icon: "test",
		type: IconType.LOCAL,
	},
	endDate: null,
	title: "tutorial.calibration",
	priority: 1,
	targetUserId: null,
	startDate: "2022-01-14T13:08:01.984Z",
	components: [
		{
			id: 97,
			type: FeedEntityComponentType.PARAGRAPH,
			configuration: {
				style: UserInputStyle.DEFAULT,
				//@ts-ignore

				translationKey: "tutorial.backgroundrecommendation",
			},
			createdAt: "2022-01-11T13:01:41.856Z",
			updatedAt: "2022-01-11T13:01:41.856Z",
			deletedAt: null,
			BannerTemplateComponent: {
				bannerTemplat: 85,
				bannerCompone: 97,
			},
			options: [],
		},
	],
	style: "WHITE_WITH_PURPLE_GRADIENT_BORDER",
	actions: [],
	secondaryTitle: "banner.calibration.title",
};
