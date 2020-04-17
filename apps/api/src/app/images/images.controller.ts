import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

import { ImagesService } from './images.service';
import { ResizeImageDto } from './dto/resize-image.dto';
import { ImageUploadResult } from './images.interface';

@ApiTags('images')
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('resize')
  @ApiResponse({ status: 201, description: 'The image has been successfully resized'})
  @ApiResponse({ status: 400, description: 'Invalid resizeImageDto provided.'})
  @ApiResponse({ status: 404, description: 'Unable to find image by URL.'})
  @ApiResponse({ status: 505, description: 'An error during image resizing occured.'})
  async resize(@Body() resizeImageDto: ResizeImageDto): Promise<ImageUploadResult> {
    const { url, width, height } = resizeImageDto;

    try {
      const imageBuffer = await this.imagesService.getBufferFromURL(url);
  
      const resizedImageBuffer = await this.imagesService.resize(imageBuffer, width, height);
  
      const uploadResult = await this.imagesService.upload(resizedImageBuffer);
  
      return uploadResult;
    } catch (error) {
      if (error.isAxiosError) {
        throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
      }

      throw new HttpException('Error during image processing', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
