import { Payment } from './../model/payment.model';
import { Injectable, Inject, Logger } from '@nestjs/common';
import { INotificationService } from './interfaces/notification.service.interface';
import { WebHookMercdaoPagoDtoRequest } from '../dtos/web-hook.mercado-pago.dto.request';
import { IGlorexAcl } from '../acls/glorex/interfaces/glorex.acl.interface';
import { IMercadoPagoAcl } from '../acls/mercadopago/interfaces/mercadopago.acl.interface';
import { IPaymentRepository } from '../repositories/payment.repository.interface';
import { ManualNotificationDtoRequest } from '../dtos/manual-notification.dto';

@Injectable()
export class NotificationService implements INotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @Inject('IPaymentRepository') private paymentRepository: IPaymentRepository,
    @Inject('IMercadoPagoAcl') private mercadoPagoAcl: IMercadoPagoAcl,
    @Inject('IGlorexAcl') private glorexAcl: IGlorexAcl,
  ) {}

  async notificationMercadoPago(dto: WebHookMercdaoPagoDtoRequest) {
    this.logger.log('Recebido Notificação via WebHook Mercado Pago');
    this.logger.debug(JSON.stringify(dto));

    if (dto.type === 'payment' && dto.action === 'payment.updated') {
      const paymentMP = await this.mercadoPagoAcl.getPayment(dto.data.id);
      if (paymentMP === null || paymentMP === undefined) {
        this.logger.log(`Pagamento não achando no MP`);
        return;
      }

      this.logger.debug(JSON.stringify(paymentMP));
      const payment = await this.paymentRepository.findByIdAP(
        String(dto.data.id),
      );
      if (payment === null || payment === undefined) {
        this.logger.log(`Compra não achando`);
        return;
      }

      this.verifyStatusPayments(
        paymentMP.status,
        payment.status,
        payment.purchaseId,
      );
    }
  }

  async manualNotification(dto: ManualNotificationDtoRequest) {
    dto.pruchase_ids.forEach(async (purchase_id) => {
      this.logger.log(`Atualizando Manualmente a compra ${purchase_id}`);
      const paymentMongo = await this.paymentRepository.findById(purchase_id);
      if (paymentMongo === null || paymentMongo === undefined) {
        this.logger.log(`Compra não achando`);
        return;
      }
      const paymentMercadoPago = await this.mercadoPagoAcl.getPayment(
        Number(paymentMongo.mercadoPagoId),
      );
      if (paymentMercadoPago === null || paymentMercadoPago === undefined) {
        this.logger.log(`Pagamento não achando no MP`);
        return;
      }

      this.verifyStatusPayments(
        paymentMercadoPago.status,
        paymentMongo.status,
        paymentMongo.purchaseId,
      );
    });
  }

  verifyStatusPayments(
    mercadoPagoStatus: string,
    paymentStatus: string,
    purchaseId: number,
  ) {
    this.logger.log(`Status atual Mergado Pago: ${mercadoPagoStatus}`);
    this.logger.log(`Status atual da Compra: ${paymentStatus}`);
    if (mercadoPagoStatus === 'approved' && paymentStatus !== 'approved') {
      this.logger.log(`Compra ${purchaseId} Confirmada`);
      this.glorexAcl.confirmPruchase(purchaseId);
    } else if (
      mercadoPagoStatus === 'rejected' ||
      mercadoPagoStatus === 'cancelled'
    ) {
      this.logger.log(`Compra ${purchaseId} Cancleada`);
      this.glorexAcl.errorPruchase(purchaseId);
    } else if (
      mercadoPagoStatus === 'in_process' ||
      mercadoPagoStatus === 'pending'
    ) {
      this.logger.log(`Compra ${purchaseId} Processando`);
      this.glorexAcl.processingPruchase(purchaseId);
    }
  }
}
