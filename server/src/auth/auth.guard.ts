import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { jwtKey } from '../config';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const [, token] = req.headers['authorization'].split(' ');

    try {
      const decoded = jwt.verify(token, jwtKey) as { id: string };
      req.body.id = decoded.id;
    } catch (error) {
      return false;
    }

    return true;
  }
}
