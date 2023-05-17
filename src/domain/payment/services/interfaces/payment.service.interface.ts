import { DoCreditPaymentDtoRequest } from "../../dtos/do-credit-payment.dto.request";
import { DoPixPaymentDtoRequest } from "../../dtos/do-pix-payment.dto.request";
import { DoPixDtoResponse } from "../../dtos/do-pix-payment.dto.response";
import { DoCreditPaymentDtoResponse } from "../../dtos/do-credit-payment.dto.response";
import { Payment } from "../../model/payment.model";

export interface IPaymentService
{
    createCredit(doCreditPaymentDto: DoCreditPaymentDtoRequest): Promise<DoCreditPaymentDtoResponse>
    createPix(doPixPaymentDto: DoPixPaymentDtoRequest): Promise<DoPixDtoResponse>
    findById(id: string): Promise<Payment>;
}



