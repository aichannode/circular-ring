/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */

export const LocationEnabler = {
	checkSettings(config: Config) {},
	requestResolutionSettings(config: Config) {},
	addListener(listener: Listener) {},
};

enum Priority {
	HIGH_ACCURACY = 100,
	BALANCED_POWER_ACCURACY = 102,
	LOW_POWER = 104,
	NO_POWER = 105,
}

type Listener = (args: { locationEnabled: boolean }) => void;

type Config = {
	priority?: Priority;
	alwaysShow?: boolean;
	needBle?: boolean;
};
