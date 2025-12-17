import { UploadFileTcpReq } from '@common/interfaces/tcp/media';

export interface IMediaService {
  uploadFile(data: UploadFileTcpReq);
  deleteFile(fileUrl: string);
}
