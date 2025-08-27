import tokensService from "@/utils/tokens.service";
import { Request, Response } from "express";
import eventService from "./event.service";

class EventController {
  async addEvent(req: Request, res: Response) {
    try {
      const decoded = await tokensService.verifyRefreshToken(
        req.cookies.refreshToken
      );
      await eventService.addEvent(req.body, decoded.id);
      return res.json({ message: "Новое мероприятие создано!" });
    } catch (e) {
      if (e instanceof Error)
        return res.status(500).json({ message: e.message });
    }
  }

  async deleteEvent(req: Request, res: Response) {
    try {
      await eventService.deleteEvent(req.params.id);
      return res.json({ message: "Мероприятие успешно удалено!" });
    } catch (e) {
      if (e instanceof Error)
        return res.status(500).json({ message: e.message });
    }
  }

  async getEventsByUser(req: Request, res: Response) {
    try {
      const decoded = await tokensService.verifyRefreshToken(
        req.cookies.refreshToken
      );
      const events = await eventService.getEventsByUser(decoded.id);
      return res.json(events);
    } catch (e) {
      if (e instanceof Error)
        return res.status(500).json({ message: e.message });
    }
  }

  async getAllEvents(req: Request, res: Response) {
    try {
      const events = await eventService.getAllEvents();
      return res.json(events);
    } catch (e) {
      if (e instanceof Error)
        return res.status(500).json({ message: e.message });
    }
  }

  async getEvent(req: Request, res: Response) {
    try {
      const eventId = req.params.id;
      const event = await eventService.getEvent(eventId);
      return res.json(event);
    } catch (e) {
      if (e instanceof Error)
        return res.status(500).json({ message: e.message });
    }
  }
}

export default new EventController();
