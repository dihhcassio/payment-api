import { ManualNotificationDtoRequest } from './../../domain/payment/dtos/manual-notification.dto';
import { Controller, Post, Body, Inject, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WebHookMercdaoPagoDtoRequest } from 'src/domain/payment/dtos/web-hook.mercado-pago.dto.request';
import { INotificationService } from 'src/domain/payment/services/interfaces/notification.service.interface';
import { DoCreditPaymentDtoRequest } from '../../domain/payment/dtos/do-credit-payment.dto.request';

@Controller('notification')
@ApiTags('Notification')
export class NotificationController {
  private readonly logger = new Logger(NotificationController.name);

  constructor(
    @Inject('INotificationService')
    private readonly notificationService: INotificationService,
  ) {}

  @Post('webhook-mercadopago')
  doCredit(@Body() dto: WebHookMercdaoPagoDtoRequest) {
    return this.notificationService.notificationMercadoPago(dto);
  }

  @Post('manual-notification-mercadopago')
  manualNotification(@Body() dto: ManualNotificationDtoRequest) {
    return this.notificationService.manualNotification(dto);
  }
}
