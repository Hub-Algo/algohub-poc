import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'prisma/prisma-client';
import { PrismaService } from 'src/database/PrismaService';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly prismaService: PrismaService,
  ) {}

  async signup(wallet_address: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { wallet_address },
    });

    console.log(user);

    const userAlreadyExists = user;

    if (userAlreadyExists) {
      throw new BadRequestException('Wallet Address in use');
    }

    const newUser = await this.usersService.create(wallet_address);

    return newUser;
  }

  async signin(wallet_address: string): Promise<User> {
    console.log('signing in user');
    const user = await this.prismaService.user.findUnique({
      where: { wallet_address },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
