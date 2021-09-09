export function isCorrectPassword(value: string): boolean {
	// at least : 8 characters with 1 uppercase + 1 lowercase + 1 number + 1 special character
	const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
	return pattern.test(value);
}
