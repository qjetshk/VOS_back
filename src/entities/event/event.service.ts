import prisma from "../../utils/prisma";
import { EventInput } from "./event.types";

class EventService {
  async addEvent(eventData: EventInput, userId: string) {
    try {
      const event = await prisma.event.create({
        data: { ...eventData, creatorId: userId },
      });
      if (event) return true;
    } catch {
      throw new Error("Не получилось создать новое мероприятие!");
    }
  }

  async deleteEvent(eventId: string) {
    try {
      const event = await prisma.event.delete({
        where: { id: eventId },
      });
      if (event) return true;
    } catch (e) {
      throw new Error("Не получилось удалить мероприятие!");
    }
  }

  async getEventsByUser(userId: string) {
    try {
      const events = await prisma.event.findMany({
        where: { creatorId: userId },
      });
      return events;
    } catch {
      throw new Error("Что-то пошло не так!");
    }
  }

  async getAllEvents() {
    try {
      const events = await prisma.event.findMany();
      return events;
    } catch {
      throw new Error("Что-то пошло не так!");
    }
  }

  async getEvent(eventId: string) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });
    const creator = await prisma.user.findUnique({
      where: { id: event?.creatorId },
      select: {
        id: true,
        name: true,
        surname: true,
        phone: true,
        email: true,
      },
    });

    return {
      event,
      creator,
    };
  }
}

export default new EventService();
