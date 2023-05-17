import { ApiProperty } from "@nestjs/swagger";
import { Payment } from "../model/payment.model";

export class DoPixDtoResponse {

    constructor(payment?: Payment) {
        if (payment !== null) {
            this.id = payment.id;
            this.status = payment.status;
            this.status_details = payment.status_details; 
            this.qr_code = payment.qr_code;
            this.qr_code_base64 = payment.qr_code_base64;
            this.cause = payment.cause;
            this.message = payment.message;
        }
    }

    @ApiProperty()
    id: string;

    @ApiProperty()
    status: string;

    @ApiProperty()
    status_details: string;

    @ApiProperty()
    message: string;
 
    @ApiProperty()
    cause: string;

    @ApiProperty()
    qr_code: string;

    @ApiProperty()
    qr_code_base64: string;

}