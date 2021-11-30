import moment from "moment";
import { BannerAction, BannerComponentDto, BannerComponentType, BannerStyle, BannerType, ClientAction, ParagraphStyle } from "./homeBanner";

/**
 * For debuging purpose only
 */
type UpdateUserFeedEntityDto = {
	id?: number,
	type: BannerType
	style?: BannerStyle
	title?: string
	secondaryTitle: string
	priority: number
	actions?: ClientAction[]
	targetUserId?: number
	startDate?: string
	endDate?: string
	templateId?: number
	iconId?: number
	components: BannerComponentDto[]
}

/**
 * Factory for the notification banner data post query.
 */
export function createRecommendation(id: number): UpdateUserFeedEntityDto {
	return {
		"type": BannerType.NOTIFICATION,
		"style": BannerStyle.ORANGE_GRADIENT,
		"title": "banner.calibration.title",
		"secondaryTitle": "",
		"priority": 10,
		"actions": [
			{
				"type": BannerAction.OPEN_WEB,
				"data": "https://expo.io"
			}
		],
		"startDate": moment().toISOString(),
		"endDate": moment().add(10, "d").toISOString(),
		"iconId": 1,
		"components": [
			{
				"type": BannerComponentType.PARAGRAPH,
				"configuration": {
					"style": ParagraphStyle.DEFAULT,
					"translationKey": "banner.calibration.message",
					"properties": {
						"days": id
					}
				}
			}
		]
	}
}