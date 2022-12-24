import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { ManagerService } from './manager.service';
import { CreateManagerDto } from './dto/create-manager.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';

@WebSocketGateway()
export class ManagerGateway {
  constructor(private readonly managerService: ManagerService) {}

  @SubscribeMessage('createManager')
  create(@MessageBody() createManagerDto: CreateManagerDto) {
    return this.managerService.create(createManagerDto);
  }

  @SubscribeMessage('findAllManager')
  findAll() {
    return this.managerService.findAll();
  }

  @SubscribeMessage('findOneManager')
  findOne(@MessageBody() id: number) {
    return this.managerService.findOne(id);
  }

  @SubscribeMessage('updateManager')
  update(@MessageBody() updateManagerDto: UpdateManagerDto) {
    return this.managerService.update(updateManagerDto.id, updateManagerDto);
  }

  @SubscribeMessage('removeManager')
  remove(@MessageBody() id: number) {
    return this.managerService.remove(id);
  }
}
