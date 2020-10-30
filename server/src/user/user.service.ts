import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
import { OnlineService } from 'src/online/online.service';

export class User {
  username: string;
  password: string;
  email: string;
  location: string;
  firstname: string;
  lastname: string;
}

@Injectable()
export class UserService {
  private limit = 10;

  constructor(
    @InjectModel('users') private User: Model<User & Document>,
    private onlineService: OnlineService,
  ) {}

  /**
   * @description creates new user and save it to database
   * @param payload
   */
  async createUser(payload: User) {
    const isRegistered = this.User.find({ email: payload.email });
    if (isRegistered) {
      return new BadRequestException('user is registered befor');
    }

    const user = new this.User(payload);
    return await user.save();
  }

  /**
   * @description get a user from database using id
   * @param id
   */
  async getUser(id: string) {
    const user = await this.User.findById(id);
    if (!user) return new NotFoundException("this user isn't found");
    return user;
  }

  /**
   * @description gets users from database using some keys
   * @param search key used to search a user from databese
   * @param page the page number
   */
  async getUsers(search: string, page: number) {
    if (!page) return new BadRequestException('please provide page quwery');
    if (search) search = '';

    //get all users from database
    const users = await this.User.find({});
    let usersMaped = [];
    for (let user of users) {
      const { _id: id, username, ...rest } = (user as any)._doc;
      //if the search key is substr in username
      let match = username.toLocaleLowerCase().includes(search);
      //if search key is empty then we get all data
      if (!search) {
        match = true;
      }

      if (!match) continue;

      usersMaped.push({
        id,
        username,
        ...rest,
      });
    }

    // slicing data into small chunks
    let start = (page - 1) * this.limit;
    let end = start + this.limit;
    const hasNext = end < usersMaped.length;
    const pages = Math.ceil((usersMaped.length * 1.0) / this.limit);

    if (page > pages) return new NotFoundException('this page is not found');

    usersMaped = await new Promise(async resolve => {
      let users = [];
      for (let { id, ...rest } of usersMaped.slice(start, end)) {
        const online = await this.onlineService.isOnline(id);
        users.push({
          id,
          online,
          ...rest,
        });
      }

      resolve(users);
    });

    return {
      users: usersMaped,
      hasNext,
      pages,
    };
  }
}
