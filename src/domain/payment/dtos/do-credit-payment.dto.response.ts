import { ApiProperty } from '@nestjs/swagger';
import { Payment } from '../model/payment.model';

export class DoCreditPaymentDtoResponse{

    constructor(payment?: Payment){
        if (payment !== null){
            this.id = payment.id;
            this.status = payment.status;
            this.cause = payment.cause;
            this.message = payment.message;
            this.status_details = payment.status_details; 
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
}