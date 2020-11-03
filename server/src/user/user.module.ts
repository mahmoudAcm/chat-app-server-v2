import { Module } from '@nestjs/common';
import { Schema } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { OnlineModule } from '../online/online.module';
import { AuthModule } from '../auth/auth.module';
import { DiscussionModule } from '../discussion/discussion.module';

const userSchema = new Schema(
  {
    username: String,
    password: String,
    email: String,
    location: String,
    firstname: String,
    lastname: String,
    avatar: String
  },
  {
    timestamps: true,
  },
);

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'users', schema: userSchema }]),
    OnlineModule,
    AuthModule,
    DiscussionModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
