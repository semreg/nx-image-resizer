import { ApiProperty } from '@nestjs/swagger';
import { IsUrl, Min } from 'class-validator';

export class ResizeImageDto {
  @ApiProperty()
  @IsUrl()
  url: string;

  @ApiProperty()
  @Min(1)
  height: number;

  @ApiProperty()
  @Min(1)
  width: number;
}
