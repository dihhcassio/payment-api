import { Payment } from 'src/domain/payment/model/payment.model';
import { IPaymentRepository } from 'src/domain/payment/repositories/payment.repository.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaymentSchema, PaymentDocument } from '../schamas/payment.schema';
import { Injectable, Logger } from '@nestjs/common';
import { PaymentTypeEnum } from 'src/domain/payment/model/enums/payment.type.enum';
@Injectable()
export class PaymentRepository implements IPaymentRepository {
  private readonly logger = new Logger(PaymentRepository.name);

  constructor(
    @InjectModel(PaymentSchema.name)
    private paymentSchamaModel: Model<PaymentDocument>,
  ) {}

  async update(payment: Payment): Promise<Payment> {
    return this.paymentSchamaModel
      .updateOne(
        { _id: payment.id },
        {
          type: payment.type,
          amount: payment.amount,
          status: payment.status,
          statusDetails: payment.status_details,
          message: payment.message,
          cause: payment.cause,
          mercadoPagoId: payment.mercadoPagoId,
          purchaseId: payment.purchaseId,
          qr_code: payment.qr_code,
          qr_code_base64: payment.qr_code_base64,
          updated_date: new Date(),
        },
      )
      .then(() => {
        return payment;
      });
  }

  async save(payment: Payment): Promise<Payment> {
    let paymentSchema = new this.paymentSchamaModel({
      type: payment.type,
      amount: payment.amount,
      status: payment.status,
      statusDetails: payment.status_details,
      message: payment.message,
      cause: payment.cause,
      mercadoPagoId: payment.mercadoPagoId,
      purchaseId: payment.purchaseId,
      qr_code: payment.qr_code,
      qr_code_base64: payment.qr_code_base64,
      created_date: new Date(),
    });
    return paymentSchema.save().then((paymentSchema) => {
      payment.id = paymentSchema._id;
      return payment;
    });
  }

  findById(id: string): Promise<Payment> {
    return this.paymentSchamaModel
      .findById(id)
      .then((paymentShema) => {
        let payment = new Payment();

        payment.id = paymentShema._id;
        payment.type = PaymentTypeEnum[paymentShema.type];
        payment.amount = paymentShema.amount;
        payment.status = paymentShema.status;
        payment.status_details = paymentShema.statusDetails;
        payment.mercadoPagoId = paymentShema.mercadoPagoId;
        payment.purchaseId = paymentShema.purchaseId;
        payment.message = paymentShema.message;
        payment.cause = paymentShema.cause;
        payment.qr_code = paymentShema.qr_code;
        payment.qr_code_base64 = paymentShema.qr_code_base64;
        payment.created_date = paymentShema.created_date;
        payment.updated_date = paymentShema.updated_date;
        return payment;
      })
      .catch((error) => {
        return null;
      });
  }

  findByIdAP(id: string): Promise<Payment> {
    return this.paymentSchamaModel
      .findOne({ mercadoPagoId: id })
      .then((paymentShema) => {
        let payment = new Payment();

        payment.id = paymentShema._id;
        payment.type = PaymentTypeEnum[paymentShema.type];
        payment.amount = paymentShema.amount;
        payment.status = paymentShema.status;
        payment.status_details = paymentShema.statusDetails;
        payment.mercadoPagoId = paymentShema.mercadoPagoId;
        payment.purchaseId = paymentShema.purchaseId;
        payment.message = paymentShema.message;
        payment.cause = paymentShema.cause;
        payment.qr_code = paymentShema.qr_code;
        payment.qr_code_base64 = paymentShema.qr_code_base64;
        payment.created_date = paymentShema.created_date;
        payment.updated_date = paymentShema.updated_date;
        return payment;
      })
      .catch((error) => {
        return null;
      });
  }
}
