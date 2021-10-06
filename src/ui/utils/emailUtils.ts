export function isEmail(value: string): boolean {
	// eslint-disable-next-line no-useless-escape
	const pattern =
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return pattern.test(value);
}

export function obfuscateEmail(value: string): string {
	return value[0] + "***" + value.slice(value.indexOf("@") - 1);
}
