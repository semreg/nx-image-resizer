import { Module } from '@nestjs/common';
import { ImagesModule } from './images/images.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ImagesModule
  ]
})
export class AppModule {}
