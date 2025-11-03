import { Module } from '@nestjs/common';
import { Provider } from '@nestjs/common';
import { PdfService } from './application/services/pdf.service';
import { PDF_SERVICE } from './pdf.di-tokens';

const dependencies: Provider[] = [{ provide: PDF_SERVICE, useClass: PdfService }];

@Module({
  imports: [],
  controllers: [],
  providers: [...dependencies],
  exports: [PDF_SERVICE],
})
export class PdfModule {}
