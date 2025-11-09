import { Module, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UPLOAD_SERVICE } from './upload.di-tokens';
import { CloudinaryAdapter } from './infrastructure/cloudinary/cloudinary.adapter';

const dependencies: Provider[] = [
  {
    provide: UPLOAD_SERVICE,
    useClass: CloudinaryAdapter,
  },
];

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [...dependencies],
  exports: [UPLOAD_SERVICE],
})
export class UploadModule {}
