import { ApiService } from "@core/api/apiService";
import moment from "moment";
import { BannerAction, BannerComponentType, BannerStyle, BannerType, HomeBanner, IconType, InputType, ParagraphComponentConfigurationDto, UserInputComponentConfigurationDto, UserInputStyle } from "./homeBanner";

const homeBannerBaseUrl = "/banners";

const mockedData = [
	{
		"id": 4245,
		"type": BannerType.RECOMMENDATION,
		"style": BannerStyle.WHITE_WITH_DARK_BLUE_BORDER,
		"title": "home.banner.kira.general.title",
		"startDate": "2021-11-25T13:49:43Z",
		"secondaryTitle": "home.banner.common.select",
		"priority": 10,
		"actions": [
		  {
			"type": BannerAction.OPEN_WEB,
			"data": "https://test.com"
		  },
		  {
			"type": BannerAction.APP_PAGE,
			"data": "APP_ROUTER_PAGE_EXAMPLE"
		  }
		],
		"icon": {
		  "type": IconType.LOCAL,
		  "icon": "app_local_icon_identifier",
		},
		"components": [
		  {
			"id": 4246,
			"type": BannerComponentType.PARAGRAPH,
			"configuration": {
			  "style": "DEFAULT",
			  "translationKey": "calendar.note_added_success.one",
			  "properties": {"notes": 4247}
			}
		  } as ParagraphComponentConfigurationDto,
		  {
			"id": 4248,
			"type": BannerComponentType.USER_INPUT,
			"configuration": {
				"style": UserInputStyle.DEFAULT,
				"inputType": InputType.SELECT,
				"inputConfig": {
					"label": "input.label",
					"minCount": 1, // Min options to select
					"maxCount": 1, // Max options to select
					"options": [{	
						"id": 4241,
						"label": "option.label",
						"icon": { // Icon is optional
							"type": "LOCAL",
							"icon": "app_local_icon_identifier",
						},
						"actions": [
							{
							"type": BannerAction.OPEN_WEB,
							"data": "https://test.com"
							},
							{
							"type": BannerAction.APP_PAGE,
							"data": "APP_ROUTER_PAGE_EXAMPLE"
							}
						]
					}
					]
				}
			}
		  } as UserInputComponentConfigurationDto
		]
	  },
	{
	  "id": 4242,
	  "type": BannerType.NOTIFICATION,
	  "style": BannerStyle.ORANGE_GRADIENT,
	  "title": "home.banner.kira.general.title",
	  "startDate": "2021-11-24T14:06:43Z",
	  "secondaryTitle": "home.banner.common.select",
	  "priority": 10,
	  "actions": [
		{
		  "type": BannerAction.OPEN_WEB,
		  "data": "https://test.com"
		},
		{
		  "type": BannerAction.APP_PAGE,
		  "data": "APP_ROUTER_PAGE_EXAMPLE"
		}
	  ],
	  "icon": {
		"type": IconType.URL,
		"icon": "https://anyurlhere.com/jpg.jpeg",
	  },
	  "components": [
		{
		  "id": 4243,
		  "type": BannerComponentType.PARAGRAPH,
		  "configuration": {
			"style": "DEFAULT",
			"translationKey": "onboarding.wear.info.bottom", // example i18n key value: "User HR: {user.hr}"
			"properties": {"user.hr": 4244}
		  }
		} as ParagraphComponentConfigurationDto
	  ]
	},
	{
	  "id": 4245,
	  "type": BannerType.RECOMMENDATION,
	  "style": BannerStyle.WHITE_WITH_DARK_BLUE_BORDER,
	  "title": "home.banner.kira.general.title",
	  "startDate": "2021-11-23T14:06:43Z",
	  "secondaryTitle": "home.banner.common.select",
	  "priority": 10,
	  "actions": [
		{
		  "type": BannerAction.OPEN_WEB,
		  "data": "https://test.com"
		},
		{
		  "type": BannerAction.APP_PAGE,
		  "data": "APP_ROUTER_PAGE_EXAMPLE"
		}
	  ],
	  "icon": {
		"type": IconType.LOCAL,
		"icon": "app_local_icon_identifier",
	  },
	  "components": [
		{
		  "id": 4246,
		  "type": BannerComponentType.PARAGRAPH,
		  "configuration": {
			"style": "DEFAULT",
			"translationKey": "calendar.note_added_success.one",
			"properties": {"notes": 4247}
		  }
		} as ParagraphComponentConfigurationDto,
		{
		  "id": 4248,
		  "type": BannerComponentType.USER_INPUT,
		  "configuration": {
			  "style": UserInputStyle.DEFAULT,
			  "inputType": InputType.SELECT,
			  "inputConfig": {
				  "label": "input.label",
				  "minCount": 1, // Min options to select
				  "maxCount": 1, // Max options to select
				  "options": [{	
					  "id": 4241,
					  "label": "option.label",
					  "icon": { // Icon is optional
						  "type": "LOCAL",
						  "icon": "app_local_icon_identifier",
					  },
					  "actions": [
						  {
						  "type": BannerAction.OPEN_WEB,
						  "data": "https://test.com"
						  },
						  {
						  "type": BannerAction.APP_PAGE,
						  "data": "APP_ROUTER_PAGE_EXAMPLE"
						  }
					  ]
				  }
				  ]
			  }
		  }
		} as UserInputComponentConfigurationDto
	  ]
	}, 
	{
		"id": 4246,
		"type": BannerType.RECOMMENDATION,
		"style": BannerStyle.WHITE_WITH_DARK_BLUE_BORDER,
		"title": "home.banner.kira.general.title",
		"startDate": "2021-11-19T14:06:43Z",
		"secondaryTitle": "home.banner.common.select",
		"priority": 10,
		"actions": [
		  {
			"type": BannerAction.OPEN_WEB,
			"data": "https://test.com"
		  },
		  {
			"type": BannerAction.APP_PAGE,
			"data": "APP_ROUTER_PAGE_EXAMPLE"
		  }
		],
		"icon": {
		  "type": IconType.LOCAL,
		  "icon": "app_local_icon_identifier",
		},
		"components": [
		  {
			"id": 4246,
			"type": BannerComponentType.PARAGRAPH,
			"configuration": {
			  "style": "DEFAULT",
			  "translationKey": "calendar.note_added_success.one",
			  "properties": {"notes": 4247}
			}
		  } as ParagraphComponentConfigurationDto,
		  {
			"id": 4248,
			"type": BannerComponentType.USER_INPUT,
			"configuration": {
				"style": UserInputStyle.DEFAULT,
				"inputType": InputType.SELECT,
				"inputConfig": {
					"label": "input.label",
					"minCount": 1, // Min options to select
					"maxCount": 1, // Max options to select
					"options": [{	
						"id": 4241,
						"label": "option.label",
						"icon": { // Icon is optional
							"type": "LOCAL",
							"icon": "app_local_icon_identifier",
						},
						"actions": [
							{
							"type": BannerAction.OPEN_WEB,
							"data": "https://test.com"
							},
							{
							"type": BannerAction.APP_PAGE,
							"data": "APP_ROUTER_PAGE_EXAMPLE"
							}
						]
					}
					]
				}
			}
		  } as UserInputComponentConfigurationDto
		]
	  },
	  {
		"id": 4247,
		"type": BannerType.RECOMMENDATION,
		"style": BannerStyle.WHITE_WITH_DARK_BLUE_BORDER,
		"title": "home.banner.kira.general.title",
		"startDate": "2021-11-19T14:06:43Z",
		"secondaryTitle": "home.banner.common.select",
		"priority": 10,
		"actions": [
		  {
			"type": BannerAction.OPEN_WEB,
			"data": "https://test.com"
		  },
		  {
			"type": BannerAction.APP_PAGE,
			"data": "APP_ROUTER_PAGE_EXAMPLE"
		  }
		],
		"icon": {
		  "type": IconType.LOCAL,
		  "icon": "app_local_icon_identifier",
		},
		"components": [
		  {
			"id": 4246,
			"type": BannerComponentType.PARAGRAPH,
			"configuration": {
			  "style": "DEFAULT",
			  "translationKey": "onboarding.wear.info.top"
			}
		  } as ParagraphComponentConfigurationDto,
		  {
			"id": 4248,
			"type": BannerComponentType.USER_INPUT,
			"configuration": {
				"style": UserInputStyle.DEFAULT,
				"inputType": InputType.SELECT,
				"inputConfig": {
					"label": "input.label",
					"minCount": 1, // Min options to select
					"maxCount": 1, // Max options to select
					"options": [{	
						"id": 4241,
						"label": "option.label",
						"icon": { // Icon is optional
							"type": "LOCAL",
							"icon": "app_local_icon_identifier",
						},
						"actions": [
							{
							"type": BannerAction.OPEN_WEB,
							"data": "https://test.com"
							},
							{
							"type": BannerAction.APP_PAGE,
							"data": "APP_ROUTER_PAGE_EXAMPLE"
							}
						]
					}
					]
				}
			}
		  } as UserInputComponentConfigurationDto
		]
	  }
  ] as HomeBanner[]

export class HomeBannerApi {
	constructor(private readonly apiService: ApiService) {}

	/**
	 * Fetch the banners from 1 year old
	 */
	async getBanners(from: Date = new Date(moment().subtract(1, "month").toISOString())) {
		const res = await this.apiService.get<{ data: HomeBanner[] }>(`${homeBannerBaseUrl}/me`, { params: { from } });
		return res.data.data.length
			? res.data.data
			: __DEV__
				? mockedData
				: [];
	}
	
}
