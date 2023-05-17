import { MercadoPagoResult } from '../results/mercadopago.result.model';
import { MercadoPagoPaymentResponse } from '../results/mercdaopago.payment.response';

export interface IMercadoPagoAcl {
  doCreditPayment(
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
  ): Promise<MercadoPagoResult>;

  doPixPayment(
    idPurchase: number,
    transactionAmount: number,
    description: string,
    email: string,
    firstName: string,
    lastName: string,
    docType: string,
    docNumber: string,
    mercadopago_acesso_token: string,
  ): Promise<MercadoPagoResult>;

  getPayment(id: number): Promise<MercadoPagoPaymentResponse>;
}
