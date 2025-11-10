import { CreateCheckoutSessionRequest } from '@common/interfaces/common';

export interface IPaymentService {
  createCheckoutSession(params: CreateCheckoutSessionRequest);
}
