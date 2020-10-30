import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { discussion, DiscussionService } from './discussion.service';

enum DiscussionEvent {
  MESSAGE = 'message',
  TYPING = 'typing',
  CHAT = 'chat',
}

@WebSocketGateway()
export class EventsGateway {
  constructor(private discussion: DiscussionService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage(DiscussionEvent.CHAT)
  startChatingRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() { room, page }: { room: string; page: number },
  ) {
    client.join(room, async () => {
      client.emit(
        DiscussionEvent.CHAT,
        await this.discussion.getChatDiscussions(room, page),
      );
    });
  }

  @SubscribeMessage(DiscussionEvent.TYPING)
  isTyping(@MessageBody() { room, sender }: { room: string; sender: string }) {
    this.server.to(room).emit(DiscussionEvent.TYPING, sender);
  }

  @SubscribeMessage(DiscussionEvent.MESSAGE)
  async sendMessage(@MessageBody() payload: discussion) {
    await this.discussion.discuss(payload);
    const room = payload.room.join();
    this.server.to(room).emit(DiscussionEvent.MESSAGE, payload);
  }
}
