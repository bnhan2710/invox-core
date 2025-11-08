import { Module } from '@nestjs/common';
import { MediaController } from './presentation/media-tcp.controller';
import { MediaService } from '../application/services/media.service';
import { MEDIA_SERVICE } from './media.tokens';

const dependencies = [
  {
    provide: MEDIA_SERVICE,
    useClass: MediaService,
  },
];

@Module({
  imports: [],
  controllers: [MediaController],
  providers: [...dependencies],
  exports: [],
})
export class MediaModule {}
