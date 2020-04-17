/* eslint-disable @typescript-eslint/camelcase */
import { ImageUploadResult } from './images.interface';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import sharp from 'sharp';
import { v2 } from 'cloudinary';
import Datauri from 'datauri';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImagesService {
  cloudinary = v2;

  constructor(private configService: ConfigService) {
    this.cloudinary.config({ 
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'), 
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'), 
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    })
  }

  async getBufferFromURL(url: string): Promise<Buffer> {
    const res = await axios(url, { responseType: 'arraybuffer' });

    const imageBuffer = Buffer.from(res.data, 'binary');

    return imageBuffer;
  }

  async resize(imageBuffer: Buffer, width: number, height: number): Promise<Buffer> {
    const resultBuffer = await sharp(imageBuffer)
      .resize(width, height)
      .toBuffer();

    return resultBuffer;
  }

  async upload(imageBuffer: Buffer): Promise<ImageUploadResult> {
    const dUri = new Datauri();

    const uri = dUri.format(`${Date.now()}`, imageBuffer);
    
    const res = await this.cloudinary.uploader.upload(uri.content);

    return {
      url: res.url,
      createdAt: new Date(res.created_at),
      bytes: res.bytes
    };
  }
}
