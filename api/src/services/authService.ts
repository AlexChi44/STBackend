import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/database";
import { User } from "../models/User";
import { AppError } from "../types";

export class AuthService {
  async register(username: string, login: string, password: string) {
    const userRepository = AppDataSource.getRepository(User);
    const existingUser = await userRepository.findOne({ where: { login } });
    if (existingUser) {
      throw new AppError("User already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = userRepository.create({
      username,
      login,
      password: hashedPassword,
    });
    await userRepository.save(user);
    console.log(user, "user");
    return { token: this.generateToken(user.id), id: user.id };
  }

  async login(login: string, password: string) {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { login } });
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new AppError("Invalid credentials", 401);
    }

    return this.generateToken(user.id);
  }

  private generateToken(userId: number) {
    return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "1h" });
  }
}
