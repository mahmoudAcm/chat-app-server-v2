import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { OnlineModule } from './online/online.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/chat-app-v2'),
    UserModule,
    OnlineModule,
  ],
})
export class AppModule {}
