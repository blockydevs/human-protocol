import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwtUserData } from '../interfaces/jwt-token.model';

export const Authorization = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['authorization'];
  },
);
export const JwtPayload = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): any => {
    const request = ctx.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];
    if (!token) return null;

    try {
      const decoded = jwt.decode(token);
      return decoded as JwtUserData;
    } catch (error) {
      return null;
    }
  },
);
