import { Observable } from "micro-observables";

export interface AuthService {
	userEmail: Observable<string | undefined>;
	authToken: Observable<string | undefined>;

	signUpEmail(email: string, password: string): Promise<void>;
	resendSignUpValidationCode(): Promise<void>;
	validateSignUpConfirmationCode(code: string, email: string): Promise<void>;

	loginEmail(email: string, password: string): Promise<void>;
	forgotPassword(email: string): Promise<void>;
	resendResetToken(email: string): Promise<void>;
	newPassword(email: string, resetToken: string, newPassword: string): Promise<void>;
	getToken(): Promise<string | undefined>;
	logout(): Promise<void>;
}
