import { NextFunction, Request, Response } from "express";
import { MessageService } from "../services/messageService";

export class MessageController {
  private messageService = new MessageService();

  async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { chatId, content } = req.body;
      const message = await this.messageService.sendMessage(
        chatId,
        req.user!.id,
        content
      );
      res.status(201).json({ status: "success", data: message });
    } catch (error) {
      next(error);
    }
  }

  async getChatMessages(req: Request, res: Response) {
    const { chatId } = req.params;
    const messages = await this.messageService.getChatMessages(
      parseInt(chatId),
      req.user!.id
    );
    res.json({ status: "success", data: messages });
  }
}
