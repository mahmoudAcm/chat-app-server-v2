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
    let token = "";

    try {
      // if their socket connection
      if(req.handshake){
        token = req.handshake.query.key;
      } else {
        token = req.headers['authorization'].split(' ')[1];
      }

      const { id } = jwt.verify(token, jwtKey) as { id: string };
      
      if(!req.body) req.body = {};

      req.body.id = id;

    } catch (error) {
      return false;
    }

    return true;
  }
}
