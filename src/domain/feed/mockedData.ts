import moment from "moment";
import { FeedEntityAction, FeedEntityComponentDto, FeedEntityComponentType, FeedEntityStyle, FeedEntityType, ClientAction, ParagraphStyle } from "./type";

/**
 * For debuging purpose only
 */
type UpdateUserFeedEntityDto = {
	id?: number,
	type: FeedEntityType
	style?: FeedEntityStyle
	title?: string
	secondaryTitle: string
	priority: number
	actions?: ClientAction[]
	targetUserId?: number
	startDate?: string
	endDate?: string
	templateId?: number
	iconId?: number
	components: FeedEntityComponentDto[]
}

/**
 * Factory for the notification data post query.
 */
export function createRecommendation(id: number): UpdateUserFeedEntityDto {
	return {
		"type": FeedEntityType.NOTIFICATION,
		"style": FeedEntityStyle.ORANGE_GRADIENT,
		"title": "banner.calibration.title",
		"secondaryTitle": "",
		"priority": 10,
		"actions": [
			{
				"type": FeedEntityAction.OPEN_WEB,
				"data": "https://expo.io"
			}
		],
		"startDate": moment().toISOString(),
		"endDate": moment().add(10, "d").toISOString(),
		"iconId": 1,
		"components": [
			{
				"id": 0,
				"type": FeedEntityComponentType.PARAGRAPH,
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