export function isCorrectPassword(value: string): boolean {
	const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,}$/;
	return pattern.test(value);
}
