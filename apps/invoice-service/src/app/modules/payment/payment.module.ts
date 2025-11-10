import { Module, Provider } from '@nestjs/common';
import { StripeClient } from './infrastructure/stripe/stripe.client';
import { StripeAdapter } from './infrastructure/stripe/stripe.adapter';
import { PAYMENT_SERVICE } from './payment.di-tokens';

const dependencies: Provider[] = [
  {
    provide: PAYMENT_SERVICE,
    useClass: StripeAdapter,
  },
  StripeClient,
];

@Module({
  imports: [],
  controllers: [],
  providers: [...dependencies],
  exports: [PAYMENT_SERVICE],
})
export class PaymentModule {}
