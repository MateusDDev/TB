import { ICrud } from '../ICrud';
import { IUser } from './IUser';

export interface IUserModel extends ICrud<IUser> {
  findByEmail(email: string): Promise<IUser | null>
}
