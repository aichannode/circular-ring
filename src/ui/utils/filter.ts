export function isDefined<T>(a: T | undefined): a is T {
	return a !== undefined;
}

export function deduplicate<T extends Record<K, any>, K extends keyof T>(primaryKey: K) {
	return function (el: T, i: number, arr: T[]): boolean {
		return arr.findIndex((e) => e[primaryKey] === el[primaryKey]) === i;
	};
}
