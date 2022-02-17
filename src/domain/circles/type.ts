import { WordingKey } from "src/wordings";
import { Routes } from "@ui/navigation/routes";

export type CircleEntityIcon = {
	type: "LOCAL" | "URL";
	icon: string;
	id: 0;
};

export type CircleEntity = {
	id: number;
	default: boolean;
	name: WordingKey;
	description: WordingKey;
	category: string;
	enabled: boolean;
	order: number;
	canNavigateInSleepMode: boolean;
	route: Routes;
	icon: CircleEntityIcon;
	sleepModeIcon: CircleEntityIcon;
};
