import { Router } from "express";
import userController from "./entities/user/user.controller";
import eventController from "./entities/event/event.controller";
import participationController from "./entities/participation/participation.controller";

const router = Router();

//user(auth) dependencies
router.post("/auth/register", userController.register);
router.post("/auth/login", userController.login);
router.post("/auth/refresh", userController.refresh);
router.post("/auth/check_auth", userController.checkAuth);
router.post("/auth/logout", userController.logout);


//event dependencies
router.post("/event/add", eventController.addEvent);
router.get("/event/get_user", eventController.getEventsByUser);
router.get("/event/get_all", eventController.getAllEvents);
router.get("/event/get/:id", eventController.getEvent);
router.delete("/event/:id", eventController.deleteEvent);

//participation dependencies
router.get("/participation/get/:eventId", participationController.getParticipantsByEventId);
router.get("/participation/get_user", participationController.getParticipationsByUserId);
router.post("/participation/add/:id", participationController.addParticipation);
router.delete("/participation/:id", participationController.deleteParticipation);

export default router;
