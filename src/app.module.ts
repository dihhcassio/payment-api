import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentController } from './app/controllers/payment.controller';
import { AppController } from './app/controllers/app.controller';
import { PaymentRepository } from './infrastructure/mongodb/repositories/payment.repository';
import { PaymentService } from './domain/payment/services/payment.service';
import {
  PaymentSchema,
  PaymentMongoSchema,
} from './infrastructure/mongodb/schamas/payment.schema';
import { GlorexAcl } from './domain/payment/acls/glorex/glorex.acl';
import { MercadoPagoAcl } from './domain/payment/acls/mercadopago/mercadopago.acl';
import { NotificationService } from './domain/payment/services/notification.service';
import { NotificationController } from './app/controllers/notification.controller';
import { AuthService } from './domain/payment/services/auth.service';
import { AuthAcl } from './domain/payment/acls/auth/auth.acl';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb://${configService.get(
          'MONGO_USERNAME',
        )}:${configService.get('MONGO_PASSWORD')}@${configService.get(
          'MONGO_URI',
        )}:${configService.get('MONGO_PORT')}`,
        dbName: configService.get('MONGO_DATABASE'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      {
        name: PaymentSchema.name,
        schema: PaymentMongoSchema,
        collection: 'payments',
      },
    ]),
    HttpModule.register({ timeout: 5000, maxRedirects: 5 }),
  ],
  controllers: [AppController, PaymentController, NotificationController],
  providers: [
    { provide: 'IPaymentService', useClass: PaymentService },
    { provide: 'INotificationService', useClass: NotificationService },
    { provide: 'IPaymentRepository', useClass: PaymentRepository },
    { provide: 'IMercadoPagoAcl', useClass: MercadoPagoAcl },
    { provide: 'IGlorexAcl', useClass: GlorexAcl },
    { provide: 'IAuthService', useClass: AuthService },
    { provide: 'IAuthAcl', useClass: AuthAcl },
  ],
})
export class AppModule {}
