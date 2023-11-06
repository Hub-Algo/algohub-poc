import { Body, Controller, Get, Post, Session } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { SigninUserDto } from './dtos/SigninUserDto';

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
    const user = await this.authServices.signup(createUserDto.wallet_address);

    session.user = user;

    console.log(session);

    return user;
  }

  @Post('/signin')
  async signinUser(
    @Body() signinUserDto: SigninUserDto,
    @Session() session: any,
  ) {
    const user = await this.authServices.signin(signinUserDto.wallet_address);

    session.user = user;

    console.log('signing', user);
    return user;
  }

  @Get('/session')
  async getUserSession() {}
}
