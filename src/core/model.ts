import { runInAction } from "mobx";

export type Present<P> = (proposal: P) => void;

export interface IModel<P> {
	present: Present<P>;
}

//////////
// Lib API
//////////

/**
 * Internal function used by the model to mutate its data.
 * Do not use directly from the action.
 * Use the Model.present function instead.
 */
export const mutate = runInAction;
