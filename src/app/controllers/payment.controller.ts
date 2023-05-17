import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Inject,
  Logger,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { DoCreditPaymentDtoRequest } from '../../domain/payment/dtos/do-credit-payment.dto.request';
import { IPaymentService } from 'src/domain/payment/services/interfaces/payment.service.interface';
import { DoPixPaymentDtoRequest } from 'src/domain/payment/dtos/do-pix-payment.dto.request';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';

@Controller('payment')
@ApiTags('Payment')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(
    @Inject('IPaymentService') private readonly paymentService: IPaymentService,
  ) {}

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  async findOne(@Param('id') id: string) {
    const payment = await this.paymentService.findById(id);

    if (payment === null || payment === undefined)
      throw new HttpException('Not found payment', 204);

    return payment;
  }

  @Post('do-credit')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  doCredit(@Body() doCreditPaymentDto: DoCreditPaymentDtoRequest) {
    return this.paymentService.createCredit(doCreditPaymentDto);
  }

  @Post('do-pix')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  doPix(@Body() doPixPaymentDto: DoPixPaymentDtoRequest) {
    return this.paymentService.createPix(doPixPaymentDto);
  }
}
