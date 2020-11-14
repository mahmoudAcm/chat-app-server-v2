import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { discussion, DiscussionService } from './discussion.service';
import { AuthGuard } from '../auth/auth.guard';

enum DiscussionEvent {
  MESSAGE = 'message',
  TYPING = 'typing',
  CHAT = 'chat',
  DISCUSSIONS = 'discussions',
  REQUEST = 'request'
}

@WebSocketGateway()
export class EventsGateway {
  private limit: number = 10;
  constructor(private discussion: DiscussionService) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage(DiscussionEvent.CHAT)
  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
  isTyping(@ConnectedSocket() client: any, @MessageBody() room: string) {
    const {
      body: { id: sender },
    } = client;
    this.server.to(room).emit(DiscussionEvent.TYPING, sender);
  }

  @SubscribeMessage(DiscussionEvent.MESSAGE)
  @UseGuards(AuthGuard)
  async sendMessage(@MessageBody() payload: discussion) {
    await this.discussion.discuss(payload);
    const room = payload.room;
    this.server.to(room).emit(DiscussionEvent.MESSAGE, payload);
  }

  @SubscribeMessage(DiscussionEvent.DISCUSSIONS)
  @UseGuards(AuthGuard)
  async getDiscussions(@ConnectedSocket() client: any, @MessageBody() page: number){
    const { body: { id } } = client;
    const discussions = await this.discussion.getDiscussionsByUserId(id);
    let start = (page - 1) * this.limit;
    let end = start + this.limit;

    let hasNext = end < discussions.length;

    const data = [];
    for (let discussion of discussions.slice(start, end)) {
      const userId = discussion.room.split(id).join('');
      const {
        online,
        avatar,
        firstname,
        username,
        location,
      } = (await this.discussion.getUserById(userId) as any)._doc;
      const { _id, owner, ...rest } = discussion._doc;
      data.push({
        id: userId,
        online,
        username,
        firstname,
        location,
        avatar,
        ...rest,
      });
    }

    return {
      discussions: data,
      hasNext,
      page
    };
  }

  @SubscribeMessage(DiscussionEvent.REQUEST)
  @UseGuards(AuthGuard)
  async acceptChatRequest(){
    
  }
}
