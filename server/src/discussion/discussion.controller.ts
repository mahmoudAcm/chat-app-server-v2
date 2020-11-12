import { Controller, Get, Param, UseGuards, Body } from '@nestjs/common';
import { DiscussionService } from './discussion.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('')
export class DiscussionController {
  constructor(private discussion: DiscussionService) {}
  private limit = 10;

  @Get('/discussions')
  @UseGuards(AuthGuard)
  async discussions(@Body('id') id: string, @Param('page') page: number) {
    const discussions = await this.discussion.getDiscussionsByUserId(id);
    let start = (page - 1) * this.limit;
    let end = start + this.limit;

    let hasNext = end < discussions.length;
    const pages = Math.ceil((discussions.length * 1.0) / this.limit);

    const data = [];
    for (let discussion of discussions.slice(start, end)) {
      const { online, avatar, firstname } = ((await this.discussion.getUserById(
        discussion.sender,
      )) as any)._doc;
      data.push({
        ...discussion,
        online,
        avatar,
        firstname,
      });
    }

    return {
      discussions: data,
      hasNext,
      pages,
    };
  }
}
