import { Module } from '@nestjs/common';
import { Schema } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';

const userSchema = new Schema({
  username: String,
  password: String,
  email: {
    type: String,
    unique: true
  },
  location: String,
  firstname: String,
  lastname: String
}, {
  timestamps: true
});

@Module({
  imports: [MongooseModule.forFeature([{ name: 'users', schema: userSchema }])],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
