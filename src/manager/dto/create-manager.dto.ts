import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsNumber,
} from 'class-validator';

export class CreateManagerDto {
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  fullName: string;

  @IsEmail()
  @MinLength(5)
  @MaxLength(50)
  email: string;

  @IsNumber()
  phone_number: number;

  @IsString()
  @MinLength(5)
  @MaxLength(50)
  password: string;
}
