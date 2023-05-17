import { ApiProperty } from '@nestjs/swagger';
import { PayerDto } from './payer.dto';

export class DoCreditPaymentDtoRequest {
  @ApiProperty()
  readonly purchaseId: number;
  @ApiProperty()
  readonly token: string;
  @ApiProperty()
  readonly issuerId: string;
  @ApiProperty()
  readonly paymentMethodId: string;
  @ApiProperty()
  readonly transactionAmount: number;
  @ApiProperty()
  readonly installments: number;
  @ApiProperty()
  readonly description: string;
  @ApiProperty()
  payer: PayerDto;
  @ApiProperty()
  readonly sellerId: string;
}
