import { JwtPayload } from 'jsonwebtoken';

export interface ILogin {
  email: string,
  password: string
}

export interface IToken {
  token: string,
}

export interface ILoginPayload extends JwtPayload {
  email: string,
}
