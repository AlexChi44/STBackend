import { AppDataSource } from "../config/database";
import { User } from "../models/User";

export class UsersService {
  async getUsers(userId: number) {
    const usersRepository = AppDataSource.getRepository(User);

    const user = await usersRepository.find({
      // where: { id: userId },
      select: ["id", "username", "email"],
    });

    return user;
  }
}
