import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
/**
 * @property type { 'connected' | 'disconnect' }
 * @property room { string }
 * @property message { string }
 */
export class discussion {
  type: 'connected' | 'disconnect';
  sender: string;
  room: Array<string>;
  message: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class DiscussionService {
  constructor(
    @InjectModel('discussion') private Discussion: Model<discussion & Document>,
  ) {}

  /**
   * @description creates new message of type connected or disconnected into database
   * @param payload message details
   */
  async discuss(payload: discussion) {
    const message = new this.Discussion(payload);
    return await message.save();
  }
}
