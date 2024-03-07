import { NextFunction, Request, Response } from 'express';
import JWT from '../utils/JWT';

export default class Validations {
  private static extractToken(token: string) {
    return token.split(' ')[1];
  }

  static async validateLogin(
    req: Request,
    res: Response,
    next: NextFunction,
  ):
    Promise<Response | void> {
    const bearer = req.headers.authorization;

    if (!bearer) {
      return res.status(401).json({ message: 'Token not found' });
    }

    const token = Validations.extractToken(bearer);
    const validToken = JWT.verify(token);
    if (validToken === 'Token must be a valid token') {
      return res.status(401).json({ message: validToken });
    }

    res.locals.user = validToken;

    next();
  }
}
