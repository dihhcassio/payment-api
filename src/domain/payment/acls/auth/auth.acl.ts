import { HttpService, Logger, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IAuthAcl } from './interfaces/auth.acl.interface';

@Injectable()
export class AuthAcl implements IAuthAcl {
  private readonly logger = new Logger(AuthAcl.name);

  private url: string;

  constructor(configService: ConfigService, private httpService: HttpService) {
    this.url = configService.get('AUTH_URL');
  }

  validJwt(jwt: string): Promise<boolean> {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: jwt,
    };
    return this.httpService
      .get(`${this.url}/authenticate/check`, { headers: headers })
      .toPromise()
      .then((res) => {
        return true;
      })
      .catch((error) => {
        new Logger(AuthAcl.name).error(error);
        return false;
      });
  }
}
