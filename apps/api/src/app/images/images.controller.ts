import { Controller, Post, Body } from '@nestjs/common';

import { ImagesService } from './images.service';
import { ResizeImageDto } from './dto/resize-image.dto';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('resize')
  async resize(@Body() resizeImageDto: ResizeImageDto) {
    const { url, width, height } = resizeImageDto;

    const imageBuffer = await this.imagesService.getBufferFromURL(url);

    const resizedImageBuffer = await this.imagesService.resizeImage(imageBuffer, width, height);

    const uploadResult = await this.imagesService.uploadImage(resizedImageBuffer)

    return {
      url: uploadResult.url,
      createdAt: uploadResult.created_at,
      bytes: uploadResult.bytes
    };
  }
}
