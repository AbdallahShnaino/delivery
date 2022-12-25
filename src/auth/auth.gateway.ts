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
import { Manager } from 'src/manager/entities/manager.entity';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInUserDto } from './dto/signin-user.dto';
import { AuthSocket, WSAuthMiddleware } from './auth.middleware';
import { ClientService } from 'src/client/client.service';
import { DelivererService } from 'src/deliverer/deliverer.service';
import { ManagerService } from 'src/manager/manager.service';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
  namespace: '/',
})
@UsePipes(new ValidationPipe())
@UseFilters(new WSExceptionsFilter())
export class AuthGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(
    private readonly authService: AuthService,
    private readonly clientService: ClientService,
    private readonly delivererService: DelivererService,
    private readonly managerService: ManagerService,
    private jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(AuthGateway.name);

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    const middle = WSAuthMiddleware(
      this.jwtService,
      this.clientService,
      this.delivererService,
      this.managerService,
    );
    server.use(middle);
    this.logger.log('Auth Gateway Initialized ');
  }

  handleConnection(client: AuthSocket, ...args: any[]) {
    console.log('client connect', client.id, client.user);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Client ${client.id} disconnected`);
  }

  @SubscribeMessage('signup')
  // @UseInterceptors(ClassSerializerInterceptor)
  async signup(@MessageBody() createUserDto: CreateUserDto) {
    const user = await this.authService.signup(createUserDto);
    const payload = { userId: user.id, type: createUserDto.type };

    this.server.emit('onUserCreated', {
      message: user,
      time: new Date().toDateString(),
      access_token: this.jwtService.sign(payload),
    });
  }

  @SubscribeMessage('signin')
  async signin(@MessageBody() signInUserDto: SignInUserDto) {
    const user = await this.authService.signin(signInUserDto);
    const payload = { userId: user.id, type: signInUserDto.type };

    this.server.emit('onSignedIn', {
      user,
      access_token: this.jwtService.sign(payload),
    });
  }

  @SubscribeMessage('whoami')
  // @UseGuards(AuthGard)
  whoami(@CurrentUser() user: Client | Manager | Deliverer) {
    return user;
  }

  @SubscribeMessage('whoami')
  //  @UseGuards(AuthGard)
  signOut(@Session() session: Record<string, any>) {
    session.userId = null;
    session.type = null;
  }
}
