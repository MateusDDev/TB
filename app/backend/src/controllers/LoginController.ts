import { Request, Response } from 'express';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import LoginService from '../services/LoginService';
import UserService from '../services/UserService';

export default class LoginController {
  constructor(
    private service = new LoginService(),
    private userService = new UserService(),
  ) {

  }

  async login(req: Request, res: Response): Promise<Response> {
    const loginCredentials = req.body;

    const { status, data } = await this.service.login(loginCredentials);

    return res.status(mapStatusHTTP(status)).json(data);
  }

  async findRole(_req: Request, res: Response): Promise<Response> {
    const { email } = res.locals.user;

    const { status, data } = await this.userService.findRole(email);

    return res.status(mapStatusHTTP(status)).json({ role: data });
  }
}
