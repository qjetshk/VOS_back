import prisma from "../../utils/prisma";

class ParticipationService {
  async addParticipation(userId: string, eventId: string) {
    const participation = prisma.participation.create({
      data: { userId, eventId },
    });
    return participation;
  }

  async deleteParticipation(partId: string) {
    const participation = prisma.participation.delete({
      where: { id: partId },
    });
    return participation;
  }

  async getParticipantsByEventId(eventId: string) {
    const participants = await prisma.user.findMany({
      where: {
        participations: {
          some: {
            eventId,
          },
        },
      },
      select: {
        id: true,
        name: true,
      },
    });
    return participants;
  }

  async getParticipationsByUserId(userId: string) {
    const participations = await prisma.participation.findMany({
      where: { userId },
      include: {
        event: true
      }
    });

    return participations;
  }
}

export default new ParticipationService();
