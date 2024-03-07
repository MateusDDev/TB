import { Request, Response } from 'express';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import LoginService from '../services/LoginService';

export default class LoginController {
  constructor(private service = new LoginService()) {

  }

  async login(req: Request, res: Response): Promise<Response> {
    const loginCredentials = req.body;

    const { status, data } = await this.service.login(loginCredentials);

    return res.status(mapStatusHTTP(status)).json(data);
  }
}
