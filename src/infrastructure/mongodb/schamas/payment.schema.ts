import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PaymentTypeEnum } from '../../../domain/payment/model/enums/payment.type.enum';

export type PaymentDocument = PaymentSchema & Document;

@Schema()
export class PaymentSchema  {

  @Prop({
    type: String,
    required: true,
    enum:  [PaymentTypeEnum.CREDIT, PaymentTypeEnum.PIX],
  })
  type: string;

  @Prop({required: true})
  amount: number;

  @Prop({required: true})
  status: string;

  @Prop({required: false})
  statusDetails: string;

  @Prop({required: false})
  message: string;

  @Prop({required: false})
  cause: string;

  @Prop({required: false})
  mercadoPagoId: string;

  @Prop({required: true})
  purchaseId: number;

  @Prop({required: false})
  qr_code: string;
  
  @Prop({required: false})
  qr_code_base64: string;

  @Prop({required: true})
  created_date: Date;

  @Prop({required: false})
  updated_date: Date;
}

export const PaymentMongoSchema = SchemaFactory.createForClass(PaymentSchema);