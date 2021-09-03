
export class UserService {

  // private _user = observable<User | undefined>(undefined)

  constructor(/*private readonly circularAuthService: CircularAuthService*/) {}

  async loginWithEmail(email: string, password: string): Promise<void> {
    try {
      // await this.circularAuthService.loginWithEmail(email, password);
      this.retrieveUser();
    } catch (e) {

    }
  }

  private retrieveUser() {

  }
}
