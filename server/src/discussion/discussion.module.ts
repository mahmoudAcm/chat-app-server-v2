import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Schema, Types } from 'mongoose';
import { DiscussionService } from './discussion.service';
import { EventsGateway } from '../discussion/events.gateway';
import { DiscussionController } from './discussion.controller';
import { UserModule } from '../user/user.module';

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
    forwardRef(() => UserModule),
  ],
  providers: [DiscussionService, EventsGateway],
  exports: [DiscussionService],
  controllers: [DiscussionController],
})
export class DiscussionModule {}
