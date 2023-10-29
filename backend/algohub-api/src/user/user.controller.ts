import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('/users')
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

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    const user = this.authServices.signup(createUserDto.wallet_address);
    return user;
  }
}
