import { Buffer } from "buffer";
import dayjs from "dayjs";
import { Observable } from "micro-observables";

export function delay(timeout: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, timeout));
}

export function base64decode(str: string): string {
	return Buffer.from(str, "base64").toString();
}

export function base64encode(str: string): string {
	return Buffer.from(str).toString("base64");
}

export function timedPromise<T>(promise: Promise<T>, timeout: number) {
	const timeoutPromise = delay(timeout).then(() => {
		throw Error("Timeout");
	});

	return Promise.race([promise, timeoutPromise]);
}

export function observableToPromise<T>(obs: Observable<T>): Promise<T> {
	return new Promise((resolve) => {
		const unsubscribe = obs.subscribe((val) => {
			resolve(val);
			unsubscribe();
		});
	});
}

export function replaceInArray<T>(array: readonly T[], index: number, newValue: T): readonly T[] {
	return [...array.slice(0, index), newValue, ...array.slice(index + 1)];
}

export function arrayFromRange(start: number, end: number, increment: number | undefined = 1): number[] {
	return Array.from({ length: (end + increment - start) / increment }, (_, i) => {
		return round2Digits(i * increment + start);
	});
}

// Correctly rounded at 0.01 precision
export function round2Digits(value: number): number {
	return +value.toFixed(2);
}

export function toServerDate(date: Date) {
	return dayjs(date).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
}
