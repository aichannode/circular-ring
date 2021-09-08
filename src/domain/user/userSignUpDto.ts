import { isEmail } from "@ui/utils/emailUtils";
import { isCorrectPassword } from "@ui/utils/passwordUtils";

export interface UserSignUpDto {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	timezone: string;
	country: string;
}

export function isUserSignUpDtoValid(dto: UserSignUpDto) {
	return (
		isEmail(dto.email) &&
		isCorrectPassword(dto.password) &&
		dto.firstName.length > 0 &&
		dto.lastName.length > 0 &&
		dto.timezone.length > 0 &&
		dto.country.length > 0
	);
}
