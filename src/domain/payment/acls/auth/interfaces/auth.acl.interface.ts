
export interface IAuthAcl {

    validJwt(jwt: string): Promise<boolean>;
    
}