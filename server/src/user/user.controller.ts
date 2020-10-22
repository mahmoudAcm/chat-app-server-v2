import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { User, UserService } from './user.service';

@Controller('')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/user')
  signUp(@Body() user: User) {
    return this.userService.createUser(user);
  }

  @Get('/user/:id')
  getUser(@Param('id') id: string) {
    return this.userService.getUser(id);
  }

  @Get('/users')
  getUsers(@Query('search') search: string, @Query('page') page: number) {
    return this.userService.getUsers(search, page);
  }
}
