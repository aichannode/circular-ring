export type Present<P> = (proposal: P) => void;

export interface Model<P> {
	present: Present<P>;
	readonly lastAcceptedMutations: any[];
}

//////////
// Lib API
//////////

/**
 * Internal function used by the model to mutate its data.
 * Do not use directly from the action.
 * Use the Model.present function instead.
 */
export function mutate<M>(this: Model<any>, mutation: M, transaction: (mutation: M) => void) {
	transaction(mutation);
	this.lastAcceptedMutations.push(mutation);
}
