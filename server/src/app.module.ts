import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UserModule } from './user/user.module';
import { OnlineModule } from './online/online.module';
import { join } from 'path';
import { DiscussionModule } from './discussion/discussion.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/chat-app-v2'),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    UserModule,
    OnlineModule,
    DiscussionModule,
  ],
})
export class AppModule {}
