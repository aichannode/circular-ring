import { isDefined } from "@domain/common/business";

export function hasAttributesDefined<T extends object, U extends keyof T>(
	obj: T,
	attributes: U[]
): obj is { [P in keyof T]-?: P extends U ? Exclude<T[P], undefined> : T[P] } {
	return attributes.every((attribute) => isDefined(obj[attribute]));
}

const a = {} as { a?: number };
hasAttributesDefined(a, ["a"]);

export function deduplicate<T extends Record<K, any>, K extends keyof T>(primaryKey: K) {
	return function (el: T, i: number, arr: T[]): boolean {
		return arr.findIndex((e) => e[primaryKey] === el[primaryKey]) === i;
	};
}
