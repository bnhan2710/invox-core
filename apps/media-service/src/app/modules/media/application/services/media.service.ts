import { Inject, Injectable } from '@nestjs/common';
import { IMediaService } from '../ports/media.port';
import { UploadFileTcpReq } from '@common/interfaces/tcp/media';
import { UPLOAD_SERVICE } from '../../../upload/upload.di-tokens';
import { IUploadPort } from '../../../upload/application/ports/upload.port';

@Injectable()
export class MediaService implements IMediaService {
  constructor(@Inject(UPLOAD_SERVICE) private readonly uploadService: IUploadPort) {}
  uploadFile(params: UploadFileTcpReq) {
    return this.uploadService.uploadFile(Buffer.from(params.fileBase64, 'base64'), params.fileName);
  }

  deleteFile(fileUrl: string) {
    return this.uploadService.deleteFile(fileUrl);
  }
}
