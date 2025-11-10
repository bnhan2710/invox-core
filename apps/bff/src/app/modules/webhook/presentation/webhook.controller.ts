import { HTTP_MESSAGE } from '@common/constants/enum/http-message.enum';
import { ProcessId } from '@common/decorators/processId.decorator';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { Controller, Headers, Post, RawBodyRequest, Req } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StripeWebhookService } from '../infrastructure/stripe-webhook.service';

@ApiTags('Webhook')
@Controller('webhook')
export class WebhookController {
  constructor(private readonly stripeWebhookService: StripeWebhookService) {}

  @Post('stripe')
  @ApiOperation({ summary: 'Stripe Webhook' })
  @ApiOkResponse({
    type: ResponseDto<string>,
  })
  async handleStripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
    @ProcessId() processId: string,
  ) {
    await this.stripeWebhookService.processWebhook({
      rawBody: req.rawBody,
      signature,
      processId,
    });
    return Response.success<string>(HTTP_MESSAGE.OK);
  }
}
