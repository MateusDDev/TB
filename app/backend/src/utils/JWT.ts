import { JwtPayload, Secret, SignOptions, sign, verify } from 'jsonwebtoken';

export default class JWT {
  private static secret: Secret = process.env.JWT_SECRET || 'senhaAltamenteSecreta';

  private static jwtConfig: SignOptions = {
    expiresIn: '9d',
    algorithm: 'HS256',
  };

  static sign(payload: JwtPayload): string {
    return sign({ ...payload }, this.secret, this.jwtConfig);
  }

  static verify(token: string): JwtPayload | string {
    return verify(token, this.secret) as JwtPayload;
  }
}
