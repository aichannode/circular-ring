import { Model, mutate } from "@core/model";
import { IObservableArray, makeAutoObservable, observable, ObservableMap, remove } from "mobx";
import { Calendar, CalendarTag, CalendarTagCategory } from "../calendar";
import { Mutations, Proposal } from "../common/type";

export class CalendarModel implements Model<Proposal> {
	public month: Calendar[] = [];
	public categoryTags: Map<number, CalendarTag[]> = new Map();
	public tagCategories: Array<CalendarTagCategory> = [];
	public lastAcceptedMutations: Mutations[] = [];

	constructor() {
		// Mark all the collections of object that does not need to be deeply observed
		makeAutoObservable<CalendarModel, "tags" | "tagCategories">(
			this,
			{
				tags: observable.shallow,
				tagCategories: observable.shallow,
			},
			{ autoBind: true }
		);
	}
	public present(proposal: Proposal) {
		// Empty the previous accepted mutations list
		(this.lastAcceptedMutations as IObservableArray).clear();
		proposal.forEach((mutation) => {
			if (mutation.type === "setMonthCalendars") {
				mutate.call(this, mutation, () => (this.month as IObservableArray).replace(mutation.payload));
			} else if (mutation.type === "updateNote") {
				// @TODO optimize: ask if the same note could be in multiple day
				mutate.call(this, mutation, () =>
					this.month.forEach(({ notes }) =>
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
					this.month.forEach(({ notes }, index) => {
						const i = notes.findIndex((note) => note.id === mutation.payload.id);
						if (i >= 0) {
							remove(this.month[index].notes as IObservableArray, i);
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
			}
		});
	}
}
