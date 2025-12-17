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
          resource_type: 'raw',
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

  async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      const publicId = this.extractPublicIdFromUrl(fileUrl);
      const result = await this.cloudinaryInstance.uploader.destroy(publicId, {
        resource_type: 'raw',
      });
      Logger.log('Delete result:', result);
      return result.result === 'ok';
    } catch (error) {
      Logger.error('Delete error:', error);
      return false;
    }
  }

  private extractPublicIdFromUrl(url: string): string {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[^/.]+$/);
    if (!match) {
      throw new Error('Invalid Cloudinary URL');
    }
    return match[1];
  }
}
