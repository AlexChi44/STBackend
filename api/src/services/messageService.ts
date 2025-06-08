import { AppDataSource } from "../config/database";
import { Message } from "../models/Message";
import { ChatMember } from "../models/ChatMember";
import { MessageStatus } from "../models/MessageStatus";
import { AppError } from "../types";

export class MessageService {
  async sendMessage(chatId: number, userId: number, content: string) {
    const chatMemberRepository = AppDataSource.getRepository(ChatMember);
    const messageRepository = AppDataSource.getRepository(Message);
    const messageStatusRepository = AppDataSource.getRepository(MessageStatus);

    const isMember = await chatMemberRepository.findOne({
      where: { chat_id: chatId, user_id: userId },
    });

    if (!isMember) {
      throw new AppError("User is not a member of this chat", 403);
    }

    const message = messageRepository.create({
      chat_id: chatId,
      sender_id: userId,
      content,
    });
    await messageRepository.save(message);

    const chatMembers = await chatMemberRepository.find({
      where: { chat_id: chatId },
    });

    const messageStatuses = chatMembers
      .filter((member) => member.user_id !== userId)
      .map((member) =>
        messageStatusRepository.create({
          message_id: message.id,
          user_id: member.user_id,
          status: "sent",
        })
      );
    await messageStatusRepository.save(messageStatuses);

    return message;
  }

  async getChatMessages(userId: number, chatId: number) {
    const chatMemberRepository = AppDataSource.getRepository(ChatMember);
    const messageRepository = AppDataSource.getRepository(Message);

    const isMember = await chatMemberRepository.findOne({
      where: { chat_id: chatId, user_id: userId },
    });
    if (!isMember) {
      throw new AppError("User is not a member of this chat", 403);
    }

    const messages = await messageRepository.find({
      where: { chat_id: chatId },
      relations: ["sender"],
      order: { sent_at: "ASC" },
    });

    return messages;
  }
}
