import { Optional } from '@nestjs/common';
import {
  IsLatitude,
  IsLongitude,
  IsString,
  MaxLength,
  MinLength,
  IsInt,
} from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  name: string;

  @MinLength(5)
  @MaxLength(150)
  description: string;

  @IsLongitude()
  pickupLocLongitude: number;

  @IsLatitude()
  pickupLocLatitude: number;

  @IsLongitude()
  dropoffLocLongitude: number;

  @IsLatitude()
  dropoffLocLatitude: number;

  @Optional()
  @IsInt()
  quantity: number;
}
