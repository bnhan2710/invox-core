import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ClientRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;
}

class ItemRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty()
  @IsPositive()
  quantity: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  unitPrice: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  vatRate: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  total: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreateInvoiceRequestDto {
  @ApiProperty({ type: ClientRequestDto })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ClientRequestDto)
  client: ClientRequestDto;

  @ApiProperty({ type: [ItemRequestDto] })
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => ItemRequestDto)
  items: ItemRequestDto[];
}
