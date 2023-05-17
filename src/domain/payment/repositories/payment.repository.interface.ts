import { Payment } from '../model/payment.model';

export interface IPaymentRepository {
  save(payment: Payment): Promise<Payment>;
  update(payment: Payment): Promise<Payment>;
  findById(id: string): Promise<Payment>;
  findByIdAP(id: string): Promise<Payment>;
}
