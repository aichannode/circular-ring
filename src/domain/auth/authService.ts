import { Observable } from "micro-observables";

export interface AuthService {
	userEmail: Observable<string | undefined>;
	authToken: Observable<string | undefined>;

	signUpEmail(email: string, password: string): Promise<void>;
	resendSignUpValidationCode(): Promise<void>;
	validateSignUpConfirmationCode(code: string): Promise<void>;

	loginEmail(email: string, password: string): Promise<void>;
	getToken(): Promise<string | undefined>;
	logout(): Promise<void>;
}
