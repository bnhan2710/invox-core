import { Module, Provider } from '@nestjs/common';
import { MailService } from './application/services/mail.service';
import { MAIL_SERVICE } from './mail.di-tokens';
import { MailKafkaConsumer } from './presentation/mail.kafka-consumer';

const dependencies: Provider[] = [
  {
    provide: MAIL_SERVICE,
    useClass: MailService,
  },
];

@Module({
  imports: [],
  providers: dependencies,
  controllers: [MailKafkaConsumer],
})
export class MailModule {}
