import { UseGuards } from '@nestjs/common';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { User, UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/signUp')
  signUp(@Body() user: User) {
    return this.userService.createUser(user);
  }

  @Post('/login')
  async logIn(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const token = await this.userService.login(email, password);
    return {
      token,
    };
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  async profile(@Body('id') id: string) {
    //@ts-ignore
    const { password, ...rest } = (await this.userService.getUserById(id))._doc;
    return rest;
  }

  @Get('/users')
  @UseGuards(AuthGuard)
  getUsers(
    @Body('id') id: string,
    @Query('search') search: string,
    @Query('page') page: number,
  ) {
    return this.userService.getUsers(id, search, page);
  }
}
