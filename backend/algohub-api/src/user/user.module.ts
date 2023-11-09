import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/database/PrismaService';
import { AuthService } from 'src/auth/auth.service';
import { CurrentUserMiddleware } from './middleware/current-user.middleware';

@Module({
  controllers: [UserController],
  providers: [UserService, AuthService, PrismaService],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
