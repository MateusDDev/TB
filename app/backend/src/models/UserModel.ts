import { IUserModel } from '../interfaces/users/IUserModel';
import { IUser } from '../interfaces/users/IUser';
import SequelizeUser from '../database/models/SequelizeUser';

export default class UserModel implements IUserModel {
  private model = SequelizeUser;

  async findByEmail(email: string): Promise<IUser | null> {
    const team = await this.model.findOne({ where: { email } });

    return team;
  }

  async findAll(): Promise<IUser[]> {
    const teams = await this.model.findAll();

    return teams;
  }

  async findById(id: number): Promise<IUser | null> {
    const team = await this.model.findByPk(id);

    return team;
  }
}
