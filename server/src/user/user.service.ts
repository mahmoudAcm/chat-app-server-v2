import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
import * as jwt from 'jsonwebtoken';
import { AuthService } from '../auth/auth.service';
import { OnlineService } from '../online/online.service';
import { DiscussionService } from '../discussion/discussion.service';
import { jwtKey } from '../config';

export class User {
  username: string;
  password: string;
  email: string;
  location: string;
  firstname: string;
  lastname: string;
  avatar: Buffer;
}

@Injectable()
export class UserService {
  private limit = 20;

  constructor(
    @InjectModel('users') private User: Model<User & Document>,
    private onlineService: OnlineService,
    private authService: AuthService,
    private discussion: DiscussionService,
  ) {}

  /**
   * @description get a user data from database using id
   * @param id
   */
  async getUserById(id: string) {
    const user = await this.User.findById(id);
    if (!user) return new NotFoundException("this user isn't found");
    return user;
  }

  /**
   * @description creates new user and save it to database
   * @param payload
   */
  async createUser(payload: User) {
    const isRegistered = await this.User.findOne({ email: payload.email });
    if (isRegistered) {
      return new BadRequestException('user is registered before');
    }

    payload.password = await this.authService.hashPassword(payload.password);

    const user = new this.User(payload);
    return await user.save();
  }

  /**
   * @description ceartes jwt token if the user is verified
   * @param email the user email
   * @param password the user palin-text password
   */
  async login(email: string, password: string) {
    const isEmailFound = await this.User.findOne({ email });
    if (!isEmailFound)
      return new BadRequestException('provided wrong credentials');

    if (
      !(await this.authService.verifyPassword(password, isEmailFound.password))
    ) {
      return new BadRequestException('provided wrong credentials');
    }

    const token = jwt.sign({ id: isEmailFound.id }, jwtKey, {
      expiresIn: (Date.now() / 1000 + 30 * 24 * 60 * 60).toString(),
    });
    return token;
  }

  /**
   * @description checks if first and second user are a contact or not
   * @param firstUser the user who is searching for contacts
   * @param secondUser the userId wich we will check if it is a contact with the firstUser
   * @returns boolean if they have friend relation chip
   */
  async checkContact(firstUser: string, secondUser: string) {
    return this.discussion.isConnected([firstUser, secondUser].join());
  }

  /**
   * @description gets users from database using some keys
   * @param id the id of the user who is searching
   * @param search key used to search a user from databese
   * @param page the page number
   */
  async getUsers(id: string, search: string, page: number) {
    if (!page) return new BadRequestException('please provide page query');
    if (!search) search = '';

    //get all users from database
    const users = await this.User.find({ _id: { $ne: id } });
    let usersMaped = [];
    for (let user of users) {
      const { _id: id, username, ...rest } = (user as any)._doc;
      //if the search key is substr in username
      let match = username
        .toLocaleLowerCase()
        .includes(search.toLocaleLowerCase());
      //if search key is empty then we get all data
      if (search === '') {
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
      for (let { id: userId, ...rest } of usersMaped.slice(start, end)) {
        //check if the user whith id is not a contact with userId
        const isConnected = await this.checkContact(id, userId);
        if (isConnected) continue;

        const online = await this.onlineService.isOnline(userId);
        users.push({
          id: userId,
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
