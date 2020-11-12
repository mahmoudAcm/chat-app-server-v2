import { Module } from '@nestjs/common';
import { OnlineService } from './online.service';
import { EventsGateway } from './events.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Schema, Types } from 'mongoose';

const onlineSchema = new Schema({
  userId: Types.ObjectId,
  tabId: String,
});

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'online', schema: onlineSchema }]),
  ],
  providers: [OnlineService, EventsGateway],
  exports: [OnlineService],
})
export class OnlineModule {}
