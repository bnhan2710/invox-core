import { IPaymentService } from '../../application/ports/payment.port';
import { Injectable } from '@nestjs/common';
import { StripeClient } from './stripe.client';
import { CreateCheckoutSessionRequest } from '@common/interfaces/common';

@Injectable()
export class StripeAdapter implements IPaymentService {
  constructor(private readonly stripeService: StripeClient) {}
  async createCheckoutSession(params: CreateCheckoutSessionRequest) {
    return this.stripeService.createCheckoutSession(params);
  }
}
