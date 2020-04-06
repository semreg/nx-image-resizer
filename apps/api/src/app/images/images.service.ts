/* eslint-disable @typescript-eslint/camelcase */
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary'
import Datauri from 'datauri'

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
})

@Injectable()
export class ImagesService {
  async getBufferFromURL(url: string): Promise<Buffer> {
    const res = await axios.get(url, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(res.data, 'binary');

    return imageBuffer;
  }

  async resizeImage(imageBuffer: Buffer, width: number, height: number): Promise<Buffer> {
    const resultBuffer = await sharp(imageBuffer)
      .resize(width, height)
      .toBuffer();

    return resultBuffer;
  }

  async uploadImage(imageBuffer: Buffer) {
    const dUri = new Datauri()

    const uri = dUri.format(`${Date.now()}`, imageBuffer)
    
    const res = await cloudinary.uploader.upload(uri.content)

    return res
  }
}
