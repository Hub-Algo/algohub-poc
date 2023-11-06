import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from 'prisma/prisma-client';
import { PrismaService } from 'src/database/PrismaService';
import { userUtils } from './userUtils';

@Injectable()
export class UserService {
  private userUtils;

  constructor(private prismaService: PrismaService) {
    this.userUtils = new userUtils();
  }

  async findAll(): Promise<User[]> {
    const users = await this.prismaService.user.findMany();
    return users;
  }

  async create(wallet_address: string): Promise<User> {
    const foundUser = await this.prismaService.user.findUnique({
      where: { wallet_address },
    });

    const userAlreadyExists = foundUser;

    if (userAlreadyExists) {
      return foundUser;
    }

    try {
      const nfdUsername = await this.userUtils.getNfd(wallet_address);

      const userName =
        nfdUsername === ''
          ? this.userUtils.formatWalletAddress(wallet_address)
          : nfdUsername;

      const user = await this.prismaService.user.create({
        data: {
          wallet_address: wallet_address,
          username: userName,
        },
      });

      return user;
    } catch (error) {}

    throw new InternalServerErrorException();
  }
}
