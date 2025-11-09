import { Injectable, Logger } from '@nestjs/common';
import { IUploadPort } from '../../application/ports/upload.port';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryAdapter implements IUploadPort {
  private readonly cloudinaryInstance = cloudinary;

  constructor(private readonly configService: ConfigService) {
    const config = this.configService.get('CONFIGURATION.CLOUDINARY_CONFIG');

    this.cloudinaryInstance.config({
      cloud_name: config?.CLOUD_NAME,
      api_key: config?.API_KEY,
      api_secret: config?.API_SECRET,
    });
  }

  async uploadFile(fileBuffer: Buffer, fileName: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinaryInstance.uploader.upload_stream(
        {
          folder: 'einvoice-app',
          resource_type: 'auto',
          public_id: fileName,
        },
        (error, result) => {
          if (error) {
            Logger.error('Upload error:', error);
            return reject(error);
          }
          Logger.log('Upload successful:', result);
          return resolve(result.secure_url);
        },
      );

      streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
  }
}
