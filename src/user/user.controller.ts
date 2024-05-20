import { Controller, Get, Req } from '@nestjs/common';
import {UserService} from './user.service';
import {Request} from 'express';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  async getProfile(@Req() req: Request) {
    const user = await this.userService.getUserById(req.user.uid);
    return user;
  }
}
