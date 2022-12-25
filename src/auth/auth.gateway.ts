import {
  ClassSerializerInterceptor,
  Logger,
  Session,
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Client } from 'src/client/entities/client.entity';
import { CurrentUser } from 'src/decorators/current-user-decorator';
import { Deliverer } from 'src/deliverer/entities/deliverer.entity';
import { WSExceptionsFilter } from 'src/errors/ws-exception.fillter';
import { AuthGard } from 'src/guards/auth.guard';
import { Manager } from 'src/manager/entities/manager.entity';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInUserDto } from './dto/signin-user.dto';

@WebSocketGateway()
@UsePipes(new ValidationPipe())
@UseFilters(new WSExceptionsFilter())
export class AuthGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  private readonly logger = new Logger(AuthGateway.name);

  @WebSocketServer()
  server: Server;

  afterInit(): void {
    this.logger.log('Auth Gateway Initialized ');
  }
  handleConnection(client: any, ...args: any[]) {
    this.logger.log(`Client ${client.id} is connected`);
    this.server.emit('hi', `from ${client.id}`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Client ${client.id} disconnected`);
  }

  constructor(private readonly authService: AuthService) {}
  @SubscribeMessage('signup')
  @UseInterceptors(ClassSerializerInterceptor)
  async signup(@MessageBody() createUserDto: CreateUserDto) {
    const user = await this.authService.signup(createUserDto);
    this.server.emit('onUserCreated', {
      message: user,
      time: new Date().toDateString(),
    });
  }

  @SubscribeMessage('signin')
  async signin(
    @MessageBody() signInUserDto: SignInUserDto,
    @Session() session: any,
  ) {
    const user = await this.authService.signin(signInUserDto);
    //session.userId = user.id;

    console.log(session);
    this.server.emit('onSignedIn', {
      'current user': user,
    });
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
