import { getLogger } from "@core/logger/logger";
import { AuthService } from "@domain/auth/authService";
import {
	AuthenticationDetails,
	CognitoAccessToken,
	CognitoUser,
	CognitoUserAttribute,
	CognitoUserPool,
	CognitoUserSession,
} from "amazon-cognito-identity-js";
import { observable } from "micro-observables";
import Config from "react-native-config";

const SEC_TO_MILLISEC = 1000;

export class CognitoAuthService<
	P = {
		[id: string]: unknown;
	}
> implements AuthService
{
	private readonly logger = getLogger("CognitoAuthService");

	private readonly _userPool: CognitoUserPool;

	private _accessToken = observable<CognitoAccessToken | null>(null);
	private _cognitoUser = observable<CognitoUser | null>(null);

	/**
	 * Access to the token payload as a reactive source.
	 */
	payload = this._accessToken.readOnly().select<P | undefined>((token) => token?.decodePayload() as P);
	authToken = this._accessToken.readOnly().select((token) => token?.getJwtToken());
	userEmail = this._cognitoUser.readOnly().select((user) => user?.getUsername());

	constructor() {
		const poolData = {
			UserPoolId: Config.COGNITO_USER_POOL_ID,
			ClientId: Config.COGNITO_CLIENT_ID,
		};
		this._userPool = new CognitoUserPool(poolData);
	}

	async init(): Promise<void> {
		return new Promise((resolve) => {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			this._userPool.storage.sync((err, result) => {
				if (!err && result === "SUCCESS") {
					const currentUser = this._userPool.getCurrentUser();
					this._cognitoUser.set(currentUser);
					if (currentUser) {
						currentUser.getSession((error: Error | null, session: CognitoUserSession | null) => {
							if (!error && session) {
								this._accessToken.set(session.getAccessToken());
								console.log("Auth Token", session.getAccessToken().getJwtToken());
								resolve();
							} else {
								this.logger.warn("Refresh user failed", error);
							}
						});
					} else {
						resolve();
					}
				} else {
					resolve();
				}
			});
		});
	}

	async signUpEmail(email: string, password: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const attributeList = [new CognitoUserAttribute({ Name: "email", Value: email })];

			this._userPool.signUp(email, password, attributeList, [], (err, result) => {
				if (err) {
					this.logger.warn("Signup Error : " + JSON.stringify(err));
					reject(err);
				} else if (!result) {
					this.logger.warn("signUp error: user is null");
					reject("signUp error: user is null");
				} else {
					this._cognitoUser.set(result.user);
					this.logger.debug("user is " + JSON.stringify(result.user));
					resolve();
				}
			});
		});
	}

	async resendSignUpValidationCode(email: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const currentUser = new CognitoUser({ Username: email, Pool: this._userPool });
			if (currentUser) {
				currentUser.resendConfirmationCode((err) => {
					if (err) {
						this.logger.warn("Error resending confirmation code", err);
						reject(err);
					} else {
						this._cognitoUser.set(currentUser);
						resolve();
					}
				});
			} else {
				reject("No user defined");
			}
		});
	}

	async validateSignUpConfirmationCode(code: string, email: string): Promise<void> {
		this.logger.debug("Cognito validation");
		return new Promise((resolve, reject) => {
			this.logger.debug(" - start validation");
			const currentUser = new CognitoUser({ Username: email, Pool: this._userPool });
			if (!!currentUser) {
				this.logger.debug(" - validation process has user : perform validation");
				currentUser.confirmRegistration(code, true, async (err, result) => {
					if (err) {
						this.logger.warn("Error confirming user", err);
						reject(err);
					} else {
						this.logger.debug("User confirmation succeeded", result);
						resolve();
					}
				});
			} else {
				reject("No user defined");
			}
		});
	}

	async loginEmail(email: string, password: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const authenticationDetails = new AuthenticationDetails({ Username: email, Password: password });
			const cognitoUser = new CognitoUser({ Username: email, Pool: this._userPool });

			cognitoUser.authenticateUser(authenticationDetails, {
				onSuccess: (result) => {
					this._cognitoUser.set(cognitoUser);
					this._accessToken.set(result.getAccessToken());
					resolve();
				},

				onFailure: (err) => {
					this.logger.warn("Authentication failed : " + (err.message || JSON.stringify(err)));
					reject(err);
				},
			});
		});
	}

	async forgotPassword(email: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const userData = {
				Username: email,
				Pool: this._userPool,
			};
			const cognitoUser = new CognitoUser(userData);
			cognitoUser.forgotPassword({
				onSuccess: () => {
					resolve();
				},
				onFailure: (err) => {
					this.logger.debug("Authentication failed");
					this.logger.warn(err.message || JSON.stringify(err));
					reject(err);
				},
			});
		});
	}

	async newPassword(email: string, resetToken: string, newPassword: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const userData = {
				Username: email,
				Pool: this._userPool,
			};
			const cognitoUser = new CognitoUser(userData);
			cognitoUser.confirmPassword(resetToken, newPassword, {
				onSuccess: () => {
					resolve();
				},
				onFailure: (err) => {
					this.logger.debug("Authentication failed");
					this.logger.warn(err.message || JSON.stringify(err));
					reject(err);
				},
			});
		});
	}

	async changePassword(currentPassword: string, newPassword: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const cognitoUser = this._cognitoUser.get();
			if (cognitoUser)
				cognitoUser.changePassword(currentPassword, newPassword, (err) => {
					if (err) {
						this.logger.debug("Updating password failed");
						this.logger.warn(err.message || JSON.stringify(err));
						reject(err);
					}
					resolve();
				});
		});
	}

	async isConnectedByEmail(): Promise<boolean> {
		return new Promise((resolve, reject) => {
			if (this._cognitoUser !== null)
				this._cognitoUser.get()?.getSession((error: Error | null, session: CognitoUserSession | null) => {
					if (error) reject(error);
					else {
						//console.log("session", session);
						if (session) {
							const idToken = session.getIdToken();
							console.log("idToken", idToken);
							if (idToken.payload.email && idToken.payload.email_verified) {
								resolve(true);
							}
						}
					}
					resolve(false);
				});
		});
	}

	async getToken(): Promise<string | undefined> {
		const token = this._accessToken.get();
		if (token && token.getExpiration() * SEC_TO_MILLISEC > Date.now()) {
			await this.refreshToken();
		}
		return this.authToken.get();
	}

	private refreshToken(): Promise<void> {
		return new Promise((resolve, reject) => {
			const currentUser = this._cognitoUser.get();
			if (currentUser) {
				currentUser.getSession((error: Error | null, session: CognitoUserSession | null) => {
					if (error) {
						this.logger.warn("Error getting user session : " + JSON.stringify(error));
						reject(error);
					} else if (session) {
						const refreshToken = session.getRefreshToken();
						currentUser?.refreshSession(refreshToken, (error2, newSession) => {
							if (error2) {
								this.logger.warn("Error refreshing session : " + JSON.stringify(error2));
								reject(error2);
							} else {
								this._accessToken.set(newSession.getIdToken());
								resolve();
							}
						});
					}
				});
			}
		});
	}

	async logout(): Promise<void> {
		try {
			this._cognitoUser.get()?.signOut();
		} catch (e) {
			console.error(e);
		} finally {
			this._cognitoUser.set(null);
			this._accessToken.set(null);
		}
	}
}
