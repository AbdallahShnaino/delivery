import { Session, UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Client } from 'src/client/entities/client.entity';
import { CurrentUser } from 'src/decorators/current-user-decorator';
import { Deliverer } from 'src/deliverer/entities/deliverer.entity';
import { AuthGard } from 'src/guards/auth.guard';
import { Manager } from 'src/manager/entities/manager.entity';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInUserDto } from './dto/signin-user.dto';

@WebSocketGateway()
export class AuthGateway {
  constructor(private readonly authService: AuthService) {}

  @SubscribeMessage('signup')
  async signup(
    @MessageBody() createUserDto: CreateUserDto,
    @Session() session: Record<string, any>,
  ) {
    const user = await this.authService.signup(createUserDto);
    session.userId = user.id;
    return user;
  }

  @SubscribeMessage('signin')
  async signin(
    @MessageBody() signInUserDto: SignInUserDto,
    @Session() session: Record<string, any>,
  ) {
    const user = await this.authService.signin(signInUserDto);
    session.userId = user.id;
    session.type = signInUserDto.type;
    return user;
  }

  @SubscribeMessage('whoami')
  @UseGuards(AuthGard)
  whoami(@CurrentUser() user: Client | Manager | Deliverer) {
    return user;
  }

  @SubscribeMessage('whoami')
  @UseGuards(AuthGard)
  signOut(@Session() session: Record<string, any>) {
    session.userId = null;
    session.type = null;
  }
}
