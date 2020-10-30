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
  private limit = 30;
  private start = 0;

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

  /**
   * @description gets all messages of a specific room from database
   * @param room the chat room Id
   * @param page the page number
   */
  async getChatDiscussions(room: string, page: number) {
    const messages = await this.Discussion.find({ room });
    this.start = (page - 1) * this.limit;
    return {
      messages: messages.slice(this.start, this.start + this.limit),
      hasNext: this.start + this.limit < messages.length,
    };
  }
}
