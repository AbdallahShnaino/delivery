import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { ClientService } from './client.service';
import { UpdateClientDto } from './dto/update-client.dto';

@WebSocketGateway()
export class ClientGateway {
  constructor(private readonly clientService: ClientService) {}

  @SubscribeMessage('findAllClient')
  async findAll() {
    return await this.clientService.findAll();
  }

  @SubscribeMessage('findOneClient')
  async findOne(@MessageBody() id: number) {
    return await this.clientService.findOne(id);
  }

  @SubscribeMessage('updateClient')
  async update(@MessageBody() updateClientDto: UpdateClientDto) {
    return await this.clientService.update(updateClientDto.id, updateClientDto);
  }

  @SubscribeMessage('removeClient')
  async remove(@MessageBody() id: number) {
    return await this.clientService.remove(id);
  }
}
