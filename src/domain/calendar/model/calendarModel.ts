import { Model, mutate } from "@core/model";
import { IObservableArray, makeAutoObservable, observable, ObservableMap, remove } from "mobx";
import { Calendar, CalendarTag, CalendarTagCategory } from "../calendar";
import { CalendarErrorContext, Mutations, Proposal } from "../common/type";

export class CalendarModel implements Model<Proposal> {
	/**
	 * UTC calendar storing the monthly notes
	 */
	public UTCMonthNotes: Calendar[] = [];
	public categoryTags: Map<number, CalendarTag[]> = new Map();
	public tagCategories: Array<CalendarTagCategory> = [];
	public lastAcceptedMutations: Mutations[] = [];
	public errors: Map<CalendarErrorContext, 409> = new Map();

	constructor() {
		// Mark all the collections of object that does not need to be deeply observed
		makeAutoObservable<CalendarModel>(this, {
			UTCMonthNotes: observable.shallow,
			tagCategories: observable.shallow,
		});
	}
	public present = (proposal: Proposal) => {
		// Empty the previous accepted mutations list
		(this.lastAcceptedMutations as IObservableArray).clear();
		proposal.forEach((mutation) => {
			if (mutation.type === "setMonthCalendars") {
				mutate.call(this, mutation, () => (this.UTCMonthNotes as IObservableArray).replace(mutation.payload));
			} else if (mutation.type === "updateNote") {
				// @TODO optimize: ask if the same note could be in multiple day
				mutate.call(this, mutation, () =>
					this.UTCMonthNotes.forEach(({ notes }) =>
						notes.forEach((note) => {
							if (note.id === mutation.payload.id) {
								Object.assign(note, mutation.payload);
							}
						})
					)
				);
			} else if (mutation.type === "deleteNote") {
				// @TODO optimize: ask if the same note could be in multiple day
				mutate.call(this, mutation, () =>
					this.UTCMonthNotes.forEach(({ notes }, index) => {
						const i = notes.findIndex((note) => note.id === mutation.payload.id);
						if (i >= 0) {
							remove(this.UTCMonthNotes[index].notes as IObservableArray, i);
						}
					})
				);
			} else if (mutation.type === "setTags") {
				mutate.call(this, mutation, () => (this.categoryTags as ObservableMap).replace(mutation.payload));
			} else if (mutation.type === "deleteTag") {
				mutate.call(this, mutation, () =>
					this.categoryTags.forEach((tags) => {
						const target = tags.findIndex(({ id }) => id === mutation.payload.id);
						tags.splice(target, 1);
					})
				);
			} else if (mutation.type === "setTagCategories") {
				mutate.call(this, mutation, () => {
					(this.tagCategories as IObservableArray).replace(mutation.payload);
				});
			} else if (mutation.type === "setError") {
				mutate.call(this, mutation, () => {
					if (mutation.payload.code) {
						this.errors.set(mutation.payload.context, mutation.payload.code);
					} else {
						this.errors.delete(mutation.payload.context);
					}
				});
			}
		});
	};
}
