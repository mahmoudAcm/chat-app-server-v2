import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DiscussionService } from './discussion.service';
import { Schema } from 'mongoose';
import { EventsGateway } from '../discussion/events.gateway';

const discussionSchema = new Schema(
  {
    type: String,
    sender: String,
    room: [{ type: String }],
    message: String,
  },
  { timestamps: true },
);

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'discussion', schema: discussionSchema },
    ]),
  ],
  providers: [DiscussionService, EventsGateway],
})
export class DiscussionModule {}
