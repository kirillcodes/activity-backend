import {Injectable, InternalServerErrorException, NestMiddleware, UnauthorizedException} from "@nestjs/common";
import {NextFunction, Request, Response} from "express";
import { FirebaseAdminService } from "src/firebase-admin.service";
import * as admin from 'firebase-admin';

declare module 'express' {
  interface Request {
    user?: admin.auth.DecodedIdToken,
  }
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly firebaseAdminService: FirebaseAdminService) {} 
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        throw new UnauthorizedException('Not authorized');
      }

      const decodedToken = await this.firebaseAdminService.verifyIdToken(token);

      if (decodedToken) {
        req.user = decodedToken;
        return true;
      }
      else {
        throw new UnauthorizedException('Invalid token');
      }

      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expired');
      }

      throw new InternalServerErrorException('Internal server error');
    }
  } 
}
