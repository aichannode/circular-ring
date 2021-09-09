export interface AuthService {
	signUpEmail(email: string, password: string): Promise<void>;
	loginEmail(email: string, password: string): Promise<void>;
	getToken(): Promise<string | undefined>;
	logout(): Promise<void>;
}
