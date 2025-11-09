import { Module } from '@nestjs/common';
import { MediaController } from './presentation/media-tcp.controller';
import { MediaService } from './application/services/media.service';
import { MEDIA_SERVICE } from './media.di-tokens';
import { UploadModule } from '../upload/upload.module';

const dependencies = [
  {
    provide: MEDIA_SERVICE,
    useClass: MediaService,
  },
];

@Module({
  imports: [UploadModule],
  controllers: [MediaController],
  providers: [...dependencies],
  exports: [MEDIA_SERVICE],
})
export class MediaModule {}
