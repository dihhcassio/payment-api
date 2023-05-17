import { DataWebHookMercadoPago } from './data-web-hook-mercado-pago.dto';
import { ApiProperty } from '@nestjs/swagger';

export class WebHookMercdaoPagoDtoRequest {
  @ApiProperty()
  id: number;
  @ApiProperty()
  live_mode: boolean;
  @ApiProperty()
  type: string;
  @ApiProperty()
  data_created: Date;
  @ApiProperty()
  application_id: number;
  @ApiProperty()
  user_id: number;
  @ApiProperty()
  version: number;
  @ApiProperty()
  api_version: string;
  @ApiProperty()
  action: string;
  @ApiProperty()
  data: DataWebHookMercadoPago;
}