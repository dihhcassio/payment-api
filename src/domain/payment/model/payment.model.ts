
import { PaymentTypeEnum } from "./enums/payment.type.enum";

export class Payment
{
    id: string;
    type: PaymentTypeEnum;
    amount: number;
    status: string;
    status_details: string;
    mercadoPagoId: string;
    purchaseId: number;
    message: string;
    cause: string;
    qr_code: string;
    qr_code_base64: string;
    created_date: Date;
    updated_date: Date;
}