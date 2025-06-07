import { Request, Response } from "express";
import { AuthService } from "../services/authService";

export class AuthController {
  private authService = new AuthService();

  async register(req: Request, res: Response) {
    const { username, login, password } = req.body;
    const token = await this.authService.register(username, login, password);
    res.status(201).json({ status: "success", data: { token } });
  }

  async login(req: Request, res: Response) {
    const { login, password } = req.body;
    const token = await this.authService.login(login, password);
    res.json({ status: "success", data: { token } });
  }
}
