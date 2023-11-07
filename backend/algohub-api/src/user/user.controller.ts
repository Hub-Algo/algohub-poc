import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { SigninUserDto } from './dtos/SigninUserDto';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'prisma/prisma-client';

@Controller('/auth')
export class UserController {
  constructor(
    private readonly usersService: UserService,
    private readonly authServices: AuthService,
  ) {}

  @Get()
  getUsers() {
    const users = this.usersService.findAll();
    return users;
  }

  @Post('/signup')
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @Session() session: any,
  ) {
    console.log('dto:', createUserDto);

    const user = await this.authServices.signup(createUserDto.wallet_address);

    session.user = user;

    return user;
  }

  @Post('/signin')
  async signinUser(
    @Body() signinUserDto: SigninUserDto,
    @Session() session: any,
  ) {
    console.log('signin in user');
    const user = await this.authServices.signin(signinUserDto.wallet_address);

    session.user = user;

    console.log(session);

    console.log('signing', user);
    return user;
  }

  @Post('/signout')
  signoutUser(@Session() session: any) {
    console.log('Signing out user');
    session.user = null;
    return session;
  }

  @UseGuards(AuthGuard)
  @Get('/session')
  async getUserSession(@CurrentUser() currentUser: User) {
    console.log('Session current user', currentUser);
    return currentUser;
  }

  @Get('/:wallet_address')
  async getUserByWalletAddress(
    @Param('wallet_address') wallet_address: string,
  ) {
    const user = await this.usersService.findOne(wallet_address);
    return user;
  }
}
