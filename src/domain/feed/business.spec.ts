import moment from "moment";
import { getFeedEntityDate, getStaleLocalUserInputStates, isToday, reconciliate } from "./business";
import {
	FeedEntityComponentType,
	FeedEntityStyle,
	FeedEntityType,
	FeedRecommendation,
	IconType,
	InputType,
	UserInputStates,
	UserInputConfiguration,
	UserInputStyle,
} from "./type";

const today = "2021-10-11T14:31:06.585Z";

it("Check if jest is configured in UTC", function () {
	expect(new Date().getTimezoneOffset()).toBe(0);
});

it("should be a today date", function () {
	expect(isToday("2021-10-11T10:31:06.585Z", today)).toBeTruthy();
});

it("should not be a today date", function () {
	expect(isToday("2021-09-11T14:31:06.585Z", today)).toBeFalsy();
});

it("Date < 24h: should get the delta from current date in hours", function () {
	expect(getFeedEntityDate("2021-10-11T11:31:06.585Z", today)).toEqual("3 hours ago");
});

it("Date >= 24h: should extract the hour of the corresponding day", function () {
	expect(getFeedEntityDate("2021-09-11T11:14:00.585Z", today, "12")).toEqual("11:14 AM");
	expect(getFeedEntityDate("2021-09-11T14:14:00.585Z", today, "24")).toEqual("14:14");
});

function createaRecommandationsData(today: string, yesterday: string) {
	const serverRecommandations = [
		{
			id: 253,
			type: FeedEntityType.RECOMMENDATION,
			title: "home.banner.kira.general.title",
			priority: 10,
			startDate: "2021-11-23T14:06:43.000Z",
			style: FeedEntityStyle.WHITE_WITH_DARK_BLUE_BORDER,
			icon: {
				type: IconType.LOCAL,
				icon: "",
			},
			actions: [],
			secondaryTitle: "home.banner.common.select",
			components: [
				{
					id: 0,
					type: FeedEntityComponentType.USER_INPUT,
					configuration: {
						style: UserInputStyle.DEFAULT,
						title: "alarm.new.repeat.description",
						inputType: InputType.SELECT,
						inputConfig: {
							answeredAt: null,
							label: "alarm.new.repeat.description",
							minCount: 1,
							maxCount: 2,
							options: [],
						},
					},
				},
			],
		},
		{
			id: 254,
			type: FeedEntityType.RECOMMENDATION,
			title: "home.banner.kira.general.title",
			priority: 10,
			startDate: "2021-11-23T14:06:43.000Z",
			style: FeedEntityStyle.WHITE_WITH_DARK_BLUE_BORDER,
			icon: {
				type: IconType.LOCAL,
				icon: "",
			},
			actions: [],
			secondaryTitle: "home.banner.common.select",
			components: [
				{
					id: 1,
					type: FeedEntityComponentType.USER_INPUT,
					configuration: {
						style: UserInputStyle.DEFAULT,
						title: "alarm.new.repeat.description",
						inputType: InputType.SELECT,
						inputConfig: {
							answeredAt: yesterday,
							selectedOptions: [2],
							label: "alarm.new.repeat.description",
							minCount: 1,
							maxCount: 2,
							options: [],
						},
					},
				},
			],
		},
		{
			id: 255,
			type: FeedEntityType.RECOMMENDATION,
			title: "home.banner.kira.general.title",
			priority: 10,
			startDate: "2021-11-23T14:06:43.000Z",
			style: FeedEntityStyle.WHITE_WITH_DARK_BLUE_BORDER,
			icon: {
				type: IconType.LOCAL,
				icon: "",
			},
			actions: [],
			secondaryTitle: "home.banner.common.select",
			components: [
				{
					id: 2,
					type: FeedEntityComponentType.USER_INPUT,
					configuration: {
						style: UserInputStyle.DEFAULT,
						title: "alarm.new.repeat.description",
						inputType: InputType.SELECT,
						inputConfig: {
							answeredAt: today,
							selectedOptions: [0, 2],
							label: "alarm.new.repeat.description",
							minCount: 1,
							maxCount: 2,
							options: [],
						},
					},
				},
			],
		},
		{
			id: 256,
			type: FeedEntityType.RECOMMENDATION,
			title: "home.banner.kira.general.title",
			priority: 10,
			startDate: today,
			style: FeedEntityStyle.WHITE_WITH_DARK_BLUE_BORDER,
			icon: {
				type: IconType.LOCAL,
				icon: "",
			},
			actions: [],
			secondaryTitle: "home.banner.common.select",
			components: [
				{
					id: 3,
					type: FeedEntityComponentType.USER_INPUT,
					configuration: {
						style: UserInputStyle.DEFAULT,
						title: "alarm.new.repeat.description",
						inputType: InputType.SELECT,
						inputConfig: {
							answeredAt: null,
							label: "alarm.new.repeat.description",
							minCount: 1,
							maxCount: 2,
							options: [],
						},
					},
				},
			],
		},
	] as FeedRecommendation[];

	const localRecommandationsState = [
		{
			id: 0,
			answeredAt: today,
			answer: [0],
		},
		{
			id: 1,
			answeredAt: today,
			answer: [0],
		},
		{
			id: 2,
			answeredAt: yesterday,
			answer: [1],
		},
	] as UserInputStates;

	return {
		localRecommandationsState,
		serverRecommandations,
	};
}

it("should detect stale local recommandation states", function () {
	const today = moment().toISOString();
	const yesterday = moment(today).subtract(1, "d").toISOString();

	const { serverRecommandations, localRecommandationsState } = createaRecommandationsData(today, yesterday);

	expect(getStaleLocalUserInputStates(localRecommandationsState, serverRecommandations).map(({ id }) => id)).toEqual([
		2,
	]);
});

it("should merge the most recent state in server recommendations", function () {
	const today = moment().toISOString();
	const yesterday = moment(today).subtract(1, "d").toISOString();

	const { serverRecommandations, localRecommandationsState } = createaRecommandationsData(today, yesterday);

	const reconciliated: FeedRecommendation[] = JSON.parse(JSON.stringify(serverRecommandations));
	// The server has no answer for this question but the client has. Take client state.
	(reconciliated[0].components[0].configuration as UserInputConfiguration).inputConfig.answeredAt = today;
	(reconciliated[0].components[0].configuration as UserInputConfiguration).inputConfig.selectedOptions = [0];
	// The server has an older answer for this question than the client. Take client state.
	(reconciliated[1].components[0].configuration as UserInputConfiguration).inputConfig.answeredAt = today;
	(reconciliated[1].components[0].configuration as UserInputConfiguration).inputConfig.selectedOptions = [0];
	// The server has a more recent answer for this question than the client. Take server state.
	(reconciliated[2].components[0].configuration as UserInputConfiguration).inputConfig.answeredAt = today;
	(reconciliated[2].components[0].configuration as UserInputConfiguration).inputConfig.selectedOptions = [0, 2];
	// The client has a no cache for this answer. Take server state.
	reconciliated[3] = serverRecommandations[3];

	expect(serverRecommandations.map(reconciliate(localRecommandationsState))).toEqual(reconciliated);
});
