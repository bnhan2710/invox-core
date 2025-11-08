import { Injectable, Logger } from '@nestjs/common';
import { IMediaService } from '../ports/media.port';
import { UploadFileTcpReq } from '@common/interfaces/tcp/media';

@Injectable()
export class MediaService implements IMediaService {
  uploadFile(params: UploadFileTcpReq) {
    Logger.log('Uploading file with params: ' + JSON.stringify(params));
  }
}
