import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsEnum,
  IsNumber,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  fullName: string;

  @IsEmail()
  @MinLength(5)
  @MaxLength(50)
  email: string;

  @IsString()
  @MinLength(5)
  @MaxLength(50)
  password: string;

  @IsNumber()
  phone_number: number;

  @IsString()
  @IsEnum(['client', 'manager', 'deliverer'])
  type: string;
}
