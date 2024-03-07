import * as bcrypt from 'bcryptjs';
import { ServiceResponse } from '../interfaces/ServiceResponse';
import { ILogin, IToken } from '../interfaces/ILogin';
import { IUserModel } from '../interfaces/users/IUserModel';
import UserModel from '../models/UserModel';
import JWT from '../utils/JWT';

export default class LoginService {
  constructor(
    private userModel: IUserModel = new UserModel(),
    private jwtService = JWT,
  ) {
  }

  private static validPassword(password: string, hash: string): boolean {
    if (!bcrypt.compareSync(password, hash)) return false;

    return true;
  }

  async login({ email, password }: ILogin): Promise<ServiceResponse<IToken>> {
    const user = await this.userModel.findByEmail(email);

    if (!email || !password) {
      return { status: 'BAD_REQUEST', data: { message: 'All fields must be filled' } };
    }

    if (!user || !LoginService.validPassword(password, user.password)) {
      return { status: 'UNAUTHORIZED', data: { message: 'Invalid user' } };
    }

    const token = this.jwtService.sign({ email });

    return { status: 'SUCCESSFUL', data: { token } };
  }
}
