import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/authService";

export class AuthController {
  private authService = new AuthService();

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, login, password } = req.body;
      console.log(`Registering user: ${login}`); // Debug
      const { token, id } = await this.authService.register(
        username,
        login,
        password
      );
      console.log(`Token generated: ${token}`); // Debug

      // Set token in httpOnly cookie
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 3600 * 1000,
        path: "/",
      });
      console.log("Cookie set: jwt"); // Debug

      res.status(201).json({
        status: "success",
        data: { user: { id, username, login } },
      });
    } catch (error) {
      console.log(`Registration error: ${error}`); // Debug
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { login, password } = req.body;
      console.log(`Logging in user: ${login}`); // Debug
      const token = await this.authService.login(login, password);
      console.log(`Token generated: ${token}`); // Debug

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 3600 * 1000,
        path: "/",
      });
      console.log("Cookie set: jwt"); // Debug

      res.json({
        status: "success",
        data: { user: { login } },
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
