import { Buffer } from "buffer";
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
