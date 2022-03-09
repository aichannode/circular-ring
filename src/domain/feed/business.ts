import { isToday } from "@domain/common/business";
import { HourFormat } from "@domain/units";
import { produce } from "immer";
import moment from "moment";
import { FeedStorage } from "./feedStorage";
import {
	FeedEntity,
	FeedEntityComponentDto,
	FeedEntityComponentType,
	FeedEntityType,
	FeedNotification,
	FeedRecommendation,
	UserInputComponentConfigurationDto,
	UserInputStates,
} from "./type";

export const isNotification = (entity: FeedEntity): entity is FeedNotification =>
	entity.type === FeedEntityType.NOTIFICATION;
export const isRecommendation = (entity: FeedEntity): entity is FeedRecommendation =>
	entity.type !== FeedEntityType.NOTIFICATION;

export function getFeedEntityDate(isoDate: string, todayIsoDate: string, format?: HourFormat) {
	const date = moment(isoDate);
	const today = moment(todayIsoDate);

	// The entry appeared today, return the relative time
	if (isToday(isoDate, todayIsoDate)) {
		return date.from(today);
	}

	// The entry is older than one day, return the hours
	return date.format(format === HourFormat.TWELVE ? "hh:mm A" : "HH:mm");
}

function isUserInput(reco: FeedEntityComponentDto): reco is UserInputComponentConfigurationDto {
	return reco.type === FeedEntityComponentType.USER_INPUT;
}

/**
 * Processus of reconciliation of recommandations answers between client and server.
 * The most recent always win.
 * This can be reduced to four cases:
 * - The server has no answer for this question but the client has. Take client state.
 * - The server has an older answer for this question than the client. Take client state.
 * - The server has a more recent answer for this question than the client. Take server state.
 * - The client has a no cache for this answer. Take server state.
 */
export function reconciliate(
	localUserInputStates: UserInputStates
): (value: FeedRecommendation, index: number, array: FeedRecommendation[]) => FeedRecommendation {
	return function (serverRecommandation: FeedRecommendation) {
		return produce(serverRecommandation, (draft) => {
			draft.components.filter(isUserInput).forEach(function (userInput) {
				// If this reco uses an user input component
				// we need to get the most recent state
				if (userInput) {
					const serverDate = userInput?.configuration.inputConfig.answeredAt;
					// Get the client date, return the server entity if not found or if the
					// as there are no conflict
					const clientState = localUserInputStates.find(({ id }) => id === userInput.id);
					if (clientState) {
						const serverIsOlder =
							// The server date is older than the client date
							(serverDate && moment(serverDate).isBefore(clientState.answeredAt)) ||
							// The server question is not answered yet
							!serverDate;
						if (serverIsOlder) {
							userInput.configuration.inputConfig.answeredAt = clientState.answeredAt;
							userInput.configuration.inputConfig.selectedOptions = clientState.answer;
						}
					}
				}
			});
		});
	};
}

export function getStaleLocalUserInputStates(localUserInputStates: UserInputStates, serverRecos: FeedRecommendation[]) {
	const serverUserInputStates = serverRecos
		.flatMap(({ components }) => components)
		.filter(isUserInput)
		.filter(Boolean);

	return localUserInputStates.filter(function (localUserInputState) {
		const serverUserInputState = serverUserInputStates.find(({ id }) => id === localUserInputState.id);

		// The server has this user input state. Let's see if our local is older. In this case, it will be deleted.
		if (serverUserInputState) {
			const serverAnswerDate = serverUserInputState.configuration.inputConfig.answeredAt;
			const clientAnswerDate = localUserInputState.answeredAt;
			if (serverAnswerDate) {
				// The client answer is older
				return moment(clientAnswerDate).isBefore(serverAnswerDate);
			}
		}
	});
}

export function removeStaleLocalAnswers(
	localRecoStates: UserInputStates,
	serverRecos: FeedRecommendation[],
	feedStorage: FeedStorage
) {
	getStaleLocalUserInputStates(localRecoStates, serverRecos).forEach(({ id }) => feedStorage.removeById(id));
}
