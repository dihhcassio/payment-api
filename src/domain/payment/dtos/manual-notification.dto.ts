import { ApiProperty } from '@nestjs/swagger';

export class ManualNotificationDtoRequest {
  @ApiProperty()
  pruchase_ids: string[];
}
