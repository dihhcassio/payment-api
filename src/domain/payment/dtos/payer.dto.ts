import { ApiProperty } from '@nestjs/swagger';
import { IdentificationDto } from './identification-dto';

export class PayerDto {
    @ApiProperty()
    readonly email: string;
    @ApiProperty()
    readonly identification: IdentificationDto;
  }