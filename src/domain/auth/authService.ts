import { Observable } from "micro-observables";

export interface AuthService {
	userEmail: Observable<string | undefined>;
	authToken: Observable<string | undefined>;

	signUpEmail(email: string, password: string): Promise<void>;

	resendSignUpValidationCode(email: string): Promise<void>;
	validateSignUpConfirmationCode(code: string, email: string): Promise<void>;

	loginEmail(email: string, password: string): Promise<void>;
	forgotPassword(email: string): Promise<void>;
	isConnectedByEmail(): Promise<boolean>;
	newPassword(email: string, resetToken: string, newPassword: string): Promise<void>;
	changePassword(currentPassword: string, newPassword: string): Promise<void>;
	getToken(): Promise<string | undefined>;
	logout(): Promise<void>;
}
