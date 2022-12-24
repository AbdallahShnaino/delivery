import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { DelivererService } from './deliverer.service';
import { CreateDelivererDto } from './dto/create-deliverer.dto';
import { UpdateDelivererDto } from './dto/update-deliverer.dto';

@WebSocketGateway()
export class DelivererGateway {
  constructor(private readonly delivererService: DelivererService) {}

  @SubscribeMessage('createDeliverer')
  async create(@MessageBody() createDelivererDto: CreateDelivererDto) {
    return await this.delivererService.create(createDelivererDto);
  }

  @SubscribeMessage('findAllDeliverer')
  async findAll() {
    return await this.delivererService.findAll();
  }

  @SubscribeMessage('findOneDeliverer')
  async findOne(@MessageBody() id: number) {
    return await this.delivererService.findOne(id);
  }

  @SubscribeMessage('updateDeliverer')
  async update(@MessageBody() updateDelivererDto: UpdateDelivererDto) {
    return await this.delivererService.update(
      updateDelivererDto.id,
      updateDelivererDto,
    );
  }

  @SubscribeMessage('removeDeliverer')
  async remove(@MessageBody() id: number) {
    return await this.delivererService.remove(id);
  }
}
