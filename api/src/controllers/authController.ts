import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/authService";

export class AuthController {
  private authService = new AuthService();

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, email, password } = req.body;
      const { token, id } = await this.authService.register(
        username,
        email,
        password
      );

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 3600 * 1000,
        path: "/",
      });

      res.status(201).json({
        status: "success",
        data: { user: { id, username, email } },
      });
    } catch (error) {
      console.log(`Registration error: ${error}`); // Debug
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const { username, token, id } = await this.authService.login(
        email,
        password
      );

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 3600 * 1000,
        path: "/",
      });

      res.json({
        status: "success",
        data: { user: { id, username, email } },
      });
    } catch (error) {
      console.log(`Login error: ${error}`); // Debug
      next(error);
    }
  }
}

// async logout(req: Request, res: Response) {
//   res.clearCookie("jwt", {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "lax",
//     path: "/",
//   });
//   res.json({ status: "success", message: "Logged out" });
// }
