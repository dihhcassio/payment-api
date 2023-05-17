import { Injectable, Inject, Logger, HttpException } from '@nestjs/common';
import { IAuthAcl } from '../acls/auth/interfaces/auth.acl.interface';
import { IAuthService } from './interfaces/auth.service.interface';

@Injectable()
export class AuthService implements IAuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(@Inject('IAuthAcl') private authAcl: IAuthAcl) {}

  validJWT(jwt: string): Promise<boolean> {
    return this.authAcl.validJwt(jwt);
  }
}
