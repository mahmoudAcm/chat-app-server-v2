import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Schema, Types } from 'mongoose';
import { DiscussionService } from './discussion.service';
import { EventsGateway } from '../discussion/events.gateway';

export const discussionSchema = new Schema(
  {
    type: String,
    sender: Types.ObjectId,
    room: String,
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
  exports: [DiscussionService],
})
export class DiscussionModule {}
