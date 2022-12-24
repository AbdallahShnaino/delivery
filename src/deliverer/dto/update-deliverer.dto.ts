import { PartialType } from '@nestjs/mapped-types';
import { CreateDelivererDto } from './create-deliverer.dto';

export class UpdateDelivererDto extends PartialType(CreateDelivererDto) {
  id: number;
}
