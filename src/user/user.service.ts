import { Injectable } from '@nestjs/common';
import {Prisma} from '@prisma/client';
import {PrismaService} from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data,
    })
  }

  async getUserById(userId: string | number) {
    return this.prisma.user.findUnique({where: {id: +userId},});
  }
}
