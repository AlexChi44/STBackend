import { AppDataSource } from "../config/database";
import { Chat } from "../models/Chat";
import { ChatMember } from "../models/ChatMember";
import { AppError } from "../types";

export class ChatService {
  async createPrivateChat(userId: number, otherUserId: number) {
    const chatRepository = AppDataSource.getRepository(Chat);
    const chatMemberRepository = AppDataSource.getRepository(ChatMember);

    const existingChat = await chatRepository
      .createQueryBuilder("chat")
      .innerJoin("chat_members", "cm1", "cm1.chat_id = chat.id")
      .innerJoin(
        "chat_members",
        "cm2",
        "cm2.chat_id = chat.id AND cm2.user_id != cm1.user_id"
      )
      .where("chat.chat_type = :type", { type: "private" })
      .andWhere("cm1.user_id = :user1 AND cm2.user_id = :user2", {
        user1: userId,
        user2: otherUserId,
      })
      .getOne();

    if (existingChat) {
      return existingChat;
    }

    const chat = chatRepository.create({
      chat_type: "private",
      created_by: { id: userId },
    });
    await chatRepository.save(chat);

    const member1 = chatMemberRepository.create({
      chat_id: chat.id,
      user_id: userId,
    });
    const member2 = chatMemberRepository.create({
      chat_id: chat.id,
      user_id: otherUserId,
    });
    await chatMemberRepository.save([member1, member2]);

    return chat;
  }

  async createGroupChat(userId: number, name: string, memberIds: number[]) {
    const chatRepository = AppDataSource.getRepository(Chat);
    const chatMemberRepository = AppDataSource.getRepository(ChatMember);

    const chat = chatRepository.create({
      chat_type: "group",
      name,
      created_by: { id: userId },
    });
    await chatRepository.save(chat);

    const members = memberIds.map((id) =>
      chatMemberRepository.create({ chat_id: chat.id, user_id: id })
    );
    members.push(
      chatMemberRepository.create({
        chat_id: chat.id,
        user_id: userId,
        role: "admin",
      })
    );
    await chatMemberRepository.save(members);

    return chat;
  }

  async getUserChats(userId: number) {
    const chatRepository = AppDataSource.getRepository(Chat);
    return chatRepository
      .createQueryBuilder("chat")
      .innerJoin("chat_members", "cm", "cm.chat_id = chat.id")
      .where("cm.user_id = :userId", { userId })
      .getMany();
  }
}
