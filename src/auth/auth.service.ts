import { HttpStatus, Injectable } from '@nestjs/common';
import { ClientService } from 'src/client/client.service';
import { Client } from 'src/client/entities/client.entity';
import { DelivererService } from 'src/deliverer/deliverer.service';
import { Deliverer } from 'src/deliverer/entities/deliverer.entity';
import { Message, throwCustomException } from 'src/errors/list.exception';
import { Manager } from 'src/manager/entities/manager.entity';
import { ManagerService } from 'src/manager/manager.service';
import { PasswordService } from 'src/shared/password.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInUserDto } from './dto/signin-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private passwordService: PasswordService,
    private clientService: ClientService,
    private managerService: ManagerService,
    private delivererService: DelivererService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const { email, type, password } = createUserDto;
    let user: Client | Manager | Deliverer = null;
    if (type === 'client') {
      user = await this.clientService.findWithEmail(email);
    }

    if (type === 'deliverer') {
      user = await this.delivererService.findWithEmail(email);
    }

    if (type === 'manager') {
      user = await this.managerService.findWithEmail(email);
    }

    if (user) {
      throwCustomException(Message.UserExist, HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await this.passwordService.toHash(password);
    createUserDto.password = hashedPassword;
    if (type === 'client') {
      user = await this.clientService.create(createUserDto);
    }

    if (type === 'deliverer') {
      user = await this.delivererService.create(createUserDto);
    }

    if (type === 'manager') {
      user = await this.managerService.create(createUserDto);
    }

    return user;
  }

  async signin(SignInUserDto: SignInUserDto) {
    const { type, email, password } = SignInUserDto;
    let user: Client | Manager | Deliverer = null;
    if (type === 'client') {
      user = await this.clientService.findWithEmail(email);
    }

    if (type === 'deliverer') {
      user = await this.delivererService.findWithEmail(email);
    }

    if (type === 'manager') {
      user = await this.managerService.findWithEmail(email);
    }

    if (!user) {
      throwCustomException(Message.UserNotFound, HttpStatus.BAD_REQUEST);
    }
    const res = await this.passwordService.compare(user.password, password);

    if (!res) {
      throwCustomException(Message.BadPassword, HttpStatus.BAD_REQUEST);
    }
    return user;
  }
}
