import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IMercadoPagoAcl } from './interfaces/mercadopago.acl.interface';
import { MercadoPagoResult } from './results/mercadopago.result.model';
import { MercadoPagoPaymentResponse } from './results/mercdaopago.payment.response';

@Injectable()
export class MercadoPagoAcl implements IMercadoPagoAcl {
  private readonly logger = new Logger(MercadoPagoAcl.name);

  private webhookURL: string;

  constructor(configService: ConfigService) {
    this.webhookURL = configService.get('WEBHOOK_URL');
  }

  async doCreditPayment(
    idPurchase: number,
    transactionAmount: number,
    token: string,
    description: string,
    installments: number,
    paymentMethodId: string,
    issuer: string,
    email: string,
    docType: string,
    docNumber: string,
    mercadopago_acesso_token: string,
  ): Promise<MercadoPagoResult> {
    const mercadopago = require('mercadopago');
    mercadopago.configurations.setAccessToken(mercadopago_acesso_token);
    const payment_data = {
      transaction_amount: Number(transactionAmount),
      token: token,
      description: description,
      installments: Number(installments),
      payment_method_id: paymentMethodId,
      issuer_id: issuer,
      payer: {
        email: email,
        identification: {
          type: docType,
          number: docNumber,
        },
      },
      notification_url: this.webhookURL,
    };

    return mercadopago.payment
      .save(payment_data)
      .then(function (response) {
        const result = new MercadoPagoResult();
        result.id = response.body.id;
        result.status = response.body.status;
        result.statusDetails = response.body.status_detail;
        return result;
      })
      .catch(function (error) {
        const result = new MercadoPagoResult();
        result.status = 'error';
        result.message = error.message;
        result.cause = JSON.stringify(error.cause);
        new Logger(MercadoPagoAcl.name).error(error);
        return result;
      });
  }

  async doPixPayment(
    idPurchase: number,
    transactionAmount: number,
    description: string,
    email: string,
    firstName: string,
    lastName: string,
    docType: string,
    docNumber: string,
    mercadopago_acesso_token: string,
  ): Promise<MercadoPagoResult> {
    const mercadopago = require('mercadopago');
    mercadopago.configurations.setAccessToken(mercadopago_acesso_token);

    const payment_data = {
      transaction_amount: Number(transactionAmount),
      description: description,
      payment_method_id: 'pix',
      payer: {
        first_name: firstName,
        last_name: lastName,
        email: email,
        identification: {
          type: docType,
          number: docNumber,
        },
      },
      notification_url: this.webhookURL,
    };

    return mercadopago.payment
      .save(payment_data)
      .then(function (response) {
        const result = new MercadoPagoResult();
        result.id = response.body.id;
        result.status = response.body.status;
        result.statusDetails = response.body.status_detail;
        result.qr_code =
          response.body.point_of_interaction.transaction_data.qr_code;
        result.qr_code_base64 =
          response.body.point_of_interaction.transaction_data.qr_code_base64;

        return result;
      })
      .catch(function (error) {
        const result = new MercadoPagoResult();
        result.status = 'error';
        result.message = error.message;
        result.cause = JSON.stringify(error.cause);
        new Logger(MercadoPagoAcl.name).error(error);
        return result;
      });
  }

  getPayment(id: number): Promise<MercadoPagoPaymentResponse> {
    const mercadopago = require('mercadopago');
    return mercadopago.payment
      .get(id)
      .then(function (response) {
        const payment = new MercadoPagoPaymentResponse();
        payment.id = response.response.id;
        payment.status = response.response.status;
        return payment;
      })
      .catch(function (error) {
        new Logger(MercadoPagoAcl.name).error(error);
      });
  }
}
