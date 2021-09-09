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

export class CognitoAuthService implements AuthService {
	private readonly logger = getLogger("CognitoAuthService");

	private readonly _userPool: CognitoUserPool;

	private _accessToken = observable<CognitoAccessToken | null>(null);
	accessToken = this._accessToken.readOnly();

	private _cognitoUser: CognitoUser | null = null;

	constructor() {
		const poolData = {
			UserPoolId: Config.COGNITO_USER_POOL_ID,
			ClientId: Config.COGNITO_CLIENT_ID,
		};
		this._userPool = new CognitoUserPool(poolData);

		// @ts-ignore
		this._userPool.storage.sync((err, result) => {
			if (!err && result === "SUCCESS") {
				this._cognitoUser = this._userPool.getCurrentUser();
				if (this._cognitoUser) {
					this._cognitoUser.getSession((error: Error | null, session: CognitoUserSession | null) => {
						if (!error && session) {
							this._accessToken.set(session.getAccessToken());
						}
					});
				}
			}
		});
	}

	async signUpEmail(email: string, password: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const attributeList = [];

			attributeList.push(
				new CognitoUserAttribute({
					Name: "email",
					Value: email,
				})
			);

			this._userPool.signUp(email, password, attributeList, [], (err, result) => {
				if (err) {
					this.logger.warn(JSON.stringify(err));
					reject(err);
				} else if (!result) {
					this.logger.warn("signUp error: user is null");
					reject("signUp error: user is null");
				} else {
					this._cognitoUser = result.user;
					this.logger.debug("user name is " + JSON.stringify(this._cognitoUser));
					resolve();
				}
			});
		});
	}

	async loginEmail(email: string, password: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const authenticationDetails = new AuthenticationDetails({
				Username: email,
				Password: password,
			});

			const userData = {
				Username: email,
				Pool: this._userPool,
			};
			const cognitoUser = new CognitoUser(userData);
			cognitoUser.authenticateUser(authenticationDetails, {
				onSuccess: (result) => {
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

	async getToken(): Promise<string | undefined> {
		const token = this.accessToken.get();
		if (token && token.getExpiration() * SEC_TO_MILLISEC > Date.now()) {
			await this.refreshToken();
		}
		return this.accessToken.get()?.getJwtToken();
	}

	private async refreshToken(): Promise<void> {
		return new Promise((resolve, reject) => {
			if (this._cognitoUser) {
				this._cognitoUser.getSession((error: Error | null, session: CognitoUserSession | null) => {
					if (error) {
						this.logger.warn("Error getting user session : " + JSON.stringify(error));
						reject(error);
					} else if (session) {
						const refreshToken = session.getRefreshToken();
						this._cognitoUser?.refreshSession(refreshToken, (error2, newSession) => {
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
		return this._cognitoUser?.signOut();
	}
}
