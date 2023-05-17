import { Injectable, Inject, Logger, HttpException } from '@nestjs/common';
import { DoCreditPaymentDtoRequest } from '../dtos/do-credit-payment.dto.request';
import { DoPixPaymentDtoRequest } from '../dtos/do-pix-payment.dto.request';
import { DoCreditPaymentDtoResponse } from '../dtos/do-credit-payment.dto.response';
import { Payment } from '../model/payment.model';
import { IPaymentRepository } from '../repositories/payment.repository.interface';
import { IPaymentService } from './interfaces/payment.service.interface';
import { PaymentTypeEnum } from 'src/domain/payment/model/enums/payment.type.enum';
import { IGlorexAcl } from '../acls/glorex/interfaces/glorex.acl.interface';
import { IMercadoPagoAcl } from '../acls/mercadopago/interfaces/mercadopago.acl.interface';
import { DoPixDtoResponse } from '../dtos/do-pix-payment.dto.response';

@Injectable()
export class PaymentService implements IPaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @Inject('IPaymentRepository') private paymentRepository: IPaymentRepository,
    @Inject('IMercadoPagoAcl') private mercadoPagoAcl: IMercadoPagoAcl,
    @Inject('IGlorexAcl') private glorexAcl: IGlorexAcl,
  ) {}

  async findById(id: string): Promise<Payment> {
    return this.paymentRepository.findById(id);
  }

  async createCredit(
    doCreditPaymentDto: DoCreditPaymentDtoRequest,
  ): Promise<DoCreditPaymentDtoResponse> {
    const purchase = await this.glorexAcl.getPruchase(
      doCreditPaymentDto.purchaseId,
    );

    const seller = await this.glorexAcl.getSeller(doCreditPaymentDto.sellerId);

    if (seller === null || purchase === undefined)
      throw new HttpException('seller_not_exist', 502);

    if (purchase === null || purchase === undefined)
      throw new HttpException('purchase_not_exist', 502);

    if (
      purchase.status === 'pagamento_confirmado' ||
      purchase.status === 'venda_sem_pagamento_online'
    )
      throw new HttpException('payment_already_made', 501);

    let payment = new Payment();
    payment.type = PaymentTypeEnum.CREDIT;
    payment.amount = purchase.amount;
    payment.status = 'not_send';
    payment.purchaseId = purchase.id;

    payment = await this.paymentRepository.save(payment);

    const mercadoPagoResult = await this.mercadoPagoAcl.doCreditPayment(
      purchase.id,
      purchase.amount,
      doCreditPaymentDto.token,
      doCreditPaymentDto.description,
      doCreditPaymentDto.installments,
      doCreditPaymentDto.paymentMethodId,
      doCreditPaymentDto.issuerId,
      doCreditPaymentDto.payer.email,
      doCreditPaymentDto.payer.identification.type,
      doCreditPaymentDto.payer.identification.number,
      seller.api_token,
    );

    this.processResultMercadoPago(mercadoPagoResult.status, purchase.id);

    payment.status = mercadoPagoResult.status;
    payment.status_details = mercadoPagoResult.statusDetails;
    payment.message = mercadoPagoResult.message;
    payment.cause = mercadoPagoResult.cause;
    payment.mercadoPagoId = mercadoPagoResult.id;

    return this.paymentRepository.update(payment).then((payment) => {
      if (payment.status === 'error')
        throw new HttpException(payment.message, 503);

      return new DoCreditPaymentDtoResponse(payment);
    });
  }

  async createPix(
    doPixPaymentDto: DoPixPaymentDtoRequest,
  ): Promise<DoPixDtoResponse> {
    const purchase = await this.glorexAcl.getPruchase(
      doPixPaymentDto.purchaseId,
    );
    const seller = await this.glorexAcl.getSeller(doPixPaymentDto.sellerId);

    this.logger.debug(JSON.stringify(seller));

    if (seller === null || purchase === undefined)
      throw new HttpException('seller_not_exist', 502);

    this.logger.debug(JSON.stringify(purchase));

    if (purchase === null || purchase === undefined)
      throw new HttpException('purchase_not_exist', 502);

    if (
      purchase.status === 'pagamento_confirmado' ||
      purchase.status === 'venda_sem_pagamento_online'
    )
      throw new HttpException('payment_already_made', 501);

    let payment = new Payment();
    payment.type = PaymentTypeEnum.PIX;
    payment.amount = purchase.amount;
    payment.status = 'not_send';
    payment.purchaseId = purchase.id;

    payment = await this.paymentRepository.save(payment);

    const mercadoPagoResult = await this.mercadoPagoAcl.doPixPayment(
      purchase.id,
      purchase.amount,
      `Pix para venda nº: ${payment.purchaseId}`,
      doPixPaymentDto.payerEmail,
      doPixPaymentDto.payerFirstName,
      doPixPaymentDto.payerLastName,
      doPixPaymentDto.docType,
      doPixPaymentDto.docNumber,
      seller.api_token,
    );

    this.processResultMercadoPago(mercadoPagoResult.status, purchase.id);

    payment.status = mercadoPagoResult.status;
    payment.status_details = mercadoPagoResult.statusDetails;
    payment.message = mercadoPagoResult.message;
    payment.cause = mercadoPagoResult.cause;
    payment.qr_code = mercadoPagoResult.qr_code;
    payment.qr_code_base64 = mercadoPagoResult.qr_code_base64;
    payment.mercadoPagoId = mercadoPagoResult.id;

    return this.paymentRepository.update(payment).then((payment) => {
      if (payment.status === 'error')
        throw new HttpException(payment.message, 503);

      return new DoPixDtoResponse(payment);
    });
  }

  private processResultMercadoPago(status: string, purchaseId: number) {
    if (status === 'approved') this.glorexAcl.confirmPruchase(purchaseId);
    else if (status === 'in_process' || status === 'pending')
      this.glorexAcl.processingPruchase(purchaseId);
    else if (status === 'rejected' || status === 'error')
      this.glorexAcl.errorPruchase(purchaseId);
  }
}
