import { Request, Response, NextFunction } from "express";
import { forbidden } from "../utils/response";
import EventRepository from "../repositories/eventRepository";

export const isEventOwner = async (req: Request, res: Response, next: NextFunction) => {
  const eventId = req.params.id;
  const userId = req.user?.id;

  const event = await EventRepository.findById(Number(eventId));

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  if (req.user?.role === "admin") {
    return next();
  }

  if (event.organizerId !== userId) {
    return forbidden(res, "Access denied: not the event owner");
  }

  next();
};