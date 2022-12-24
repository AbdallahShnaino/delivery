import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@WebSocketGateway()
export class OrderGateway {
  constructor(private readonly orderService: OrderService) {}

  @SubscribeMessage('createOrder')
  async create(@MessageBody() createOrderDto: CreateOrderDto) {
    const clientId = 1;
    return await this.orderService.create(clientId, createOrderDto);
  }

  @SubscribeMessage('findAllOrder')
  async findAll() {
    const clientId = 1;
    return await this.orderService.findAll(clientId);
  }

  @SubscribeMessage('findOneOrder')
  async findOne(@MessageBody() id: number) {
    return await this.orderService.findOne(id);
  }

  @SubscribeMessage('updateOrder')
  async update(@MessageBody() updateOrderDto: UpdateOrderDto) {
    return await this.orderService.update(updateOrderDto.id, updateOrderDto);
  }

  @SubscribeMessage('removeOrder')
  async remove(@MessageBody() id: number) {
    return await this.orderService.remove(id);
  }
}
