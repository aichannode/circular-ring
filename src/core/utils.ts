import { Buffer } from "buffer";

export function delay(timeout: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, timeout));
}

export function base64decode(str: string): string {
	return Buffer.from(str, "base64").toString();
}

export function base64encode(str: string): string {
	return Buffer.from(str).toString("base64");
}
