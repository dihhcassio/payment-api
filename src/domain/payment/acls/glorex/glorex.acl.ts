import { HttpService, Logger, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IGlorexAcl } from './interfaces/glorex.acl.interface';
import { Pruchase } from './model/purchase.model';
import { PruchaseResponse } from './model/purchase.response';
import { Seller } from './model/seller.model';

@Injectable()
export class GlorexAcl implements IGlorexAcl {
  private url: string;
  private token: string;
  private headersRequest: any;

  constructor(configService: ConfigService, private httpService: HttpService) {
    this.url = configService.get('GLOREX_URL');
    this.token = configService.get('GLOREX_TOKEN');
    this.headersRequest = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    };
  }
  getSeller(id: string): Promise<Seller> {
    return this.httpService
      .get(`${this.url}/seller/get-by-id/${id}`, {
        headers: this.headersRequest,
      })
      .toPromise()
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        new Logger(GlorexAcl.name + '- getSeller').error(error);
      });
  }

  async getPruchase(id: number): Promise<Pruchase> {
    return this.httpService
      .get(`${this.url}/purchase/get-by-id/${id}`, {
        headers: this.headersRequest,
      })
      .toPromise()
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        new Logger(GlorexAcl.name + '- getPruchase').error(error);
      });
  }

  async confirmPruchase(id: number): Promise<PruchaseResponse> {
    const data = {
      id: id,
    };

    return this.httpService
      .post(`${this.url}/purchase/confirm`, data, {
        headers: this.headersRequest,
      })
      .toPromise()
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        new Logger(GlorexAcl.name + '- confirmPruchase').error(error);
      });
  }

  async errorPruchase(id: number): Promise<PruchaseResponse> {
    const data = {
      id: id,
    };

    return this.httpService
      .post(`${this.url}/purchase/error`, data, {
        headers: this.headersRequest,
      })
      .toPromise()
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        new Logger(GlorexAcl.name + '- errorPruchase').error(error);
      });
  }

  async processingPruchase(id: number): Promise<PruchaseResponse> {
    const data = {
      id: id,
    };

    return this.httpService
      .post(`${this.url}/purchase/processing`, data, {
        headers: this.headersRequest,
      })
      .toPromise()
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        new Logger(GlorexAcl.name + '- processingPruchase').error(error);
      });
  }
}
