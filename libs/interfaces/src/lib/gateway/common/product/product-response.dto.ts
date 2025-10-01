import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../base-response.dto';

export class ProductResponseDto extends BaseResponseDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  sku: string;

  @ApiProperty()
  unit: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  vatRate: number;
}
