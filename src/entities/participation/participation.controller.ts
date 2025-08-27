import tokensService from "../../utils/tokens.service";
import { Request, Response } from "express";
import participationService from "./participation.service";

class ParticipationController {
  async addParticipation(req: Request, res: Response) {
    try {
      const decoded = await tokensService.verifyRefreshToken(
        req.cookies.refreshToken
      );
      const eventId = req.params.id
      const participation = await participationService.addParticipation(
        decoded.id,
        eventId
      );
      return res.json(participation);
    } catch (e) {
      if (e instanceof Error)
        return res.status(500).json({ message: e.message });
    }
  }

  async deleteParticipation(req: Request, res: Response) {
    try {
      const participationId = req.params.id
      const participation = await participationService.deleteParticipation(participationId);
      return res.json({
        message: "Вы больше не участвуете в данном мероприятии!",
        ...participation
      });
    } catch (e) {
      if (e instanceof Error) res.status(500).json({ message: e.message });
    }
  }

  async getParticipantsByEventId(req: Request, res: Response) {
    try {
      const eventId = req.params.eventId
      const participants = await participationService.getParticipantsByEventId(eventId);
      return res.json(participants)
    } catch (e) {
      if (e instanceof Error) res.status(500).json({ message: e.message });
    }
  }

   async getParticipationsByUserId(req: Request, res: Response) {
    try {
      const decoded = await tokensService.verifyRefreshToken(
        req.cookies.refreshToken
      );
      const participations = await participationService.getParticipationsByUserId(decoded.id);
      return res.json(participations)
    } catch (e) {
      if (e instanceof Error) res.status(500).json({ message: e.message });
    }
  }
}

export default new ParticipationController();
