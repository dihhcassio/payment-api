import { ApiProperty } from '@nestjs/swagger';

export class IdentificationDto {
    @ApiProperty()
    readonly type: string;
    @ApiProperty()
    readonly number: string;
  }