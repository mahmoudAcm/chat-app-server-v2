import {
  BadRequestException,
  Injectable,
  Module,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';

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
  private limit = 5;
  private page = 1;
  constructor(@InjectModel('users') private User: Model<User & Document>) {}

  /**
   * @description creates new user and save it to database
   * @param payload
   */
  async createUser(payload: User) {
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
   * @description slice users array to a page
   * @param result
   */
  private slicedUserArray(result: Array<any>) {
    const start = (this.page - 1) * this.limit;
    return result.slice(start, start + this.limit);
  }

  /**
   * @description gets users from database using some keys
   * @param search key used to search a user from databese
   * @param page
   */
  async getUsers(search: string, page: number) {
    if (!page) page = 1;

    this.page = page;

    /* tmp array used to do some operations on it search and spliting*/
    const tmpUsers = await this.User.find({});

    /* total number of pages if no search key used */
    let pages = Math.ceil((tmpUsers.length * 1.0) / this.limit);

    if (!search) {
      if (page > pages) {
        return new BadRequestException(`page ${page} not found.`);
      }

      const users = await new Promise<any[]>(async resolve => {
        const result = [];
        for (let user of tmpUsers) {
          // @ts-ignore
          const { password, ...rest } = user._doc;
          result.push(rest);
        }

        resolve(this.slicedUserArray(result));
      });

      return {
        users,
        pages,
      };
    }

    const result = [];
    for (let user of tmpUsers) {
      //we see if search key is a substring in username field
      if (
        user.username.toLocaleLowerCase().includes(search.toLocaleLowerCase())
      ) {
        // @ts-ignore
        const { password, ...rest } = user._doc;
        result.push(rest);
      }
    }

    /* total number of pages if search key is applied */
    pages = Math.ceil((result.length * 1.0) / this.limit);
    if (page > pages) {
      return new BadRequestException(
        `their is no page ${page} for users with search key -> ${search}.`,
      );
    }

    return {
      users: this.slicedUserArray(result),
      pages,
    };
  }
}
