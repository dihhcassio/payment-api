import { ManualNotificationDtoRequest } from '../../dtos/manual-notification.dto';
import { WebHookMercdaoPagoDtoRequest } from '../../dtos/web-hook.mercado-pago.dto.request';

export interface INotificationService {
  notificationMercadoPago(dto: WebHookMercdaoPagoDtoRequest);
  manualNotification(dto: ManualNotificationDtoRequest);
}
