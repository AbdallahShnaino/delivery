import { Expose } from 'class-transformer';

export class ShowUserDto {
  @Expose()
  id: number;

  @Expose()
  fullName: string;

  @Expose()
  email: string;

  @Expose()
  phone_number: number;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
}
