import { OnlineService } from './online.service';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Socket, Server } from 'socket.io';

enum onlineMessageEvent {
  ONLINE = 'online',
  ONLINE_STATUS = 'onlineStatus',
}

@WebSocketGateway()
export class EventsGateway implements OnGatewayDisconnect {
  constructor(private onlineService: OnlineService) {}

  @WebSocketServer() server: Server;

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    try {
      const { userId } = await this.onlineService.offline(client.id);
      const isHere = await this.onlineService.isOnline(userId);
      if (!isHere) {
        this.server.to(userId).emit(onlineMessageEvent.ONLINE, false);
      }
    } catch (e) {}
  }

  @SubscribeMessage(onlineMessageEvent.ONLINE)
  isOnline(@ConnectedSocket() client: Socket, @MessageBody() userId: string) {
    client.join(userId, async () => {
      await this.onlineService.online(client.id, userId);
      this.server.to(userId).emit(onlineMessageEvent.ONLINE_STATUS, true);
    });
  }

  @SubscribeMessage(onlineMessageEvent.ONLINE_STATUS)
  onlineStatus(
    @ConnectedSocket() client: Socket,
    @MessageBody() userId: string,
  ) {
    client.join(userId, async () => {
      const isHere = await this.onlineService.isOnline(userId);
      client.emit(onlineMessageEvent.ONLINE_STATUS, isHere);
    });
  }
}
