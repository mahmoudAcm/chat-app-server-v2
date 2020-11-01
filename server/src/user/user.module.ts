import { Module } from '@nestjs/common';
import { Schema } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { OnlineModule } from 'src/online/online.module';
import { AuthModule } from 'src/auth/auth.module';

const userSchema = new Schema(
  {
    username: String,
    password: String,
    email: String,
    location: String,
    firstname: String,
    lastname: String,
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
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
