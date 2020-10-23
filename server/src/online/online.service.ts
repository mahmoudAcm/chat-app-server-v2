import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';

class online {
  userId: string;
  tabId: string;
}

@Injectable()
export class OnlineService {
  constructor(
    @InjectModel('online') private Online: Model<online & Document>,
  ) {}

  /**
   * @description store that the user is online into the database
   * @param { string } tabId the browser tab id
   * @param { string } useId the user Id in the database
   */
  async online(tabId: string, userId?: string) {
    const onlineStatus = new this.Online({
      userId,
      tabId,
    });

    return await onlineStatus.save();
  }

  /**
   * @description removes a device or tab browser from online list database
   * @param { string } tabId the browser tab id
   */
  async offline(tabId: string) {
    return await this.Online.findOneAndDelete({ tabId });
  }

  /**
   * @description gives us true/false for the user onlineStatus
   * @param userId user id in the database
   */
  async isOnline(userId: string) {
    const user = await this.Online.findOne({ userId });
    return user ? true : false;
  }
}
