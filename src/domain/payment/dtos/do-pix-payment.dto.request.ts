import { ApiProperty } from '@nestjs/swagger';

export class DoPixPaymentDtoRequest {
  @ApiProperty()
  readonly purchaseId: number;
  @ApiProperty()
  readonly payerFirstName: string;
  @ApiProperty()
  readonly payerLastName: string;
  @ApiProperty()
  readonly docType: string;
  @ApiProperty()
  readonly docNumber: string;
  @ApiProperty()
  readonly payerEmail: string;
  @ApiProperty()
  readonly sellerId: string;
}
