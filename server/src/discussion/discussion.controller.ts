import { Controller, Get, Param, UseGuards, Body } from '@nestjs/common';
import { DiscussionService } from './discussion.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('')
export class DiscussionController {
  constructor(private discussion: DiscussionService) {}

  @Get('/discussions')
  @UseGuards(AuthGuard)
  async discussions(@Body('id') id: string, @Param('room') room: string) {
    const [userId] = room.split(id);
    const message = await this.discussion.lastMessage(room);
    const { avatar, firstname, username, online } =
      //@ts-ignore
      (await this.discussion.getUserById(userId))._doc;

    return {
      userId,
      message,
      avatar,
      firstname,
      username,
      online,
    };
  }
}
