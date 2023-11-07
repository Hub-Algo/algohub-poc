import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../user.service';
import { User } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UserService) {}
  async use(req: any, res: Response, next: NextFunction) {
    console.log('Middleware activated');
    const { user } = req.session || {};
    console.log(user);

    req.currentUser = user;

    next();
  }
}
