export interface IAuthService {
  validJWT(jwt: string): Promise<boolean>;
}
