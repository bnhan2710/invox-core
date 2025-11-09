import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  private readonly cloudinaryInstance = cloudinary;
  constructor(private readonly configService: ConfigService) {
    this.cloudinaryInstance.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CONFIG.CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_CONFIG.API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_CONFIG.API_SECRET'),
    });
  }
}
