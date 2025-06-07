import { Request, Response } from "express";
import { ChatService } from "../services/chatService";

export class ChatController {
  private chatService = new ChatService();

  async createPrivateChat(req: Request, res: Response) {
    const { otherUserId } = req.body;
    const chat = await this.chatService.createPrivateChat(
      req.user!.id,
      otherUserId
    );
    res.status(201).json({ status: "success", data: chat });
  }

  async createGroupChat(req: Request, res: Response) {
    const { name, memberIds } = req.body;
    const chat = await this.chatService.createGroupChat(
      req.user!.id,
      name,
      memberIds
    );
    res.status(201).json({ status: "success", data: chat });
  }

  async getUserChats(req: Request, res: Response) {
    const chats = await this.chatService.getUserChats(req.user!.id);
    res.json({ status: "success", data: chats });
  }
}
