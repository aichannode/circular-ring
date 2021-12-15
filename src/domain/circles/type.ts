import { WordingKey } from "src/wordings";
import { Routes } from "@ui/navigation/routes";

export type CircleEntity = {
  id: number;
	route: Routes;
	source: number;
	key: WordingKey;
	desc: WordingKey;
	on: boolean,
	type: string
}

 