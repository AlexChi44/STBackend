import { DataSource } from "typeorm";
import { User } from "../models/User";
import { Chat } from "../models/Chat";
import { ChatMember } from "../models/ChatMember";
import { Message } from "../models/Message";
import { UserRelationship } from "../models/UserRelationship";
import { MessageStatus } from "../models/MessageStatus";

console.log(
  process.env.MYSQL_HOST,
  process.env.MYSQL_PORT,
  process.env.MYSQL_USER,
  process.env.TEST
);
export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT || "3306"),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [User, Chat, ChatMember, Message, UserRelationship, MessageStatus],
  synchronize: true, // Set to false in production
  // logging: process.env.NODE_ENV !== "production",
});
