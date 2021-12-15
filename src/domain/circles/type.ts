import { WordingKey } from "src/wordings";
import { Routes } from "@ui/navigation/routes";

// export type CircleEntity = {
//     id: number,
//     activeIconUrl: string,
//     inactiveIconUrl: string,
//     default: boolean,
//     name: string,
//     description: string,
//     category: string,
//     on: boolean,
//     order: number,
//     orderHome: number
//   }

export type CircleEntity = {
  id: number;
	route: Routes;
	source: number;
	key: WordingKey;
	desc: WordingKey;
	on: boolean
}

 