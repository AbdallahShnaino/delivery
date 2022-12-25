import { Exclude, Expose } from 'class-transformer';
import { Client } from 'src/client/entities/client.entity';
import { Deliverer } from 'src/deliverer/entities/deliverer.entity';
import { Manager } from 'src/manager/entities/manager.entity';

export class ShowUserDto {
  @Expose()
  id: number;

  @Expose()
  fullName: string;

  @Expose()
  email: string;

  @Expose()
  phone_number: number;

  @Exclude()
  password: string;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;

  constructor(
    partial: Partial<Manager> | Partial<Client> | Partial<Deliverer>,
  ) {
    Object.assign(this, partial);
  }
}
