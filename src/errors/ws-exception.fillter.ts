import { ArgumentsHost, Catch, WsExceptionFilter } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Catch()
export class WSExceptionsFilter implements WsExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    const socket = host.switchToWs().getClient();
    socket.emit('exception', {
      status: 'error',
      message: exception.message,
    });
  }
}
