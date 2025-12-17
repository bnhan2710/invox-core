export interface IUploadPort {
  uploadFile(fileBuffer: Buffer, fileName: string): Promise<string>;
  deleteFile(fileUrl: string): Promise<boolean>;
}
