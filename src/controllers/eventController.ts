import { Request, Response, NextFunction } from "express";
import EventService from "../services/eventService";
import { ok, created, fail } from "../utils/response";

class EventController {
    static getAllEvents = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const events = await EventService.getAllEvents(req.user!.role);
            return ok(res, events, "Events retrieved successfully");
        } catch (error) {
            next(error);
        }
    };

    static getEventDetailById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id); 
            const existingEvent = await EventService.getEventById(id);
            if (!existingEvent) {
                return fail(res, "Event not found", 404);
            }
            return ok(res, existingEvent, "Event detail retrieved successfully");
        } catch (error) {
            next(error);
        }
    };

    static createEvent = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const eventData = {
                ...req.body,
                organizerId: req.user!.id  
            };
            const newEvent = await EventService.createEvent(eventData);
            return created(res, newEvent, "Event created successfully");
        } catch (error) {
            next(error);
        }
    };

    static updateEvent = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id);
            const updatedEvent = await EventService.updateEvent(id, req.body);
            return ok(res, updatedEvent, "Event updated successfully");
        } catch (error) {
            next(error); 
        }
    };

    static deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id); 
            await EventService.deleteEvent(id);
            return ok(res, null, "Event deleted successfully");
        } catch (error) {
            next(error); 
        }
    };

    static getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const users = await EventService.getAllUsers();
            return ok(res, users, "Users retrieved successfully");
        } catch (error) {
            next(error);
        }
    };

    static updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userEmail = req.params.email as string;
        const { role: userRole } = req.body;

        if (!userEmail) {
            return fail(res, "Email is required", 400);
        }

        if (!userRole) {
            return fail(res, "Role is required", 400);
        }

        const existingUser = await EventService.getUserByEmail(userEmail);
        if (!existingUser) {
            return fail(res, "User not found", 404);
        }

        const updatedUser = await EventService.updateUser(userEmail, userRole);
        return ok(res, updatedUser, "User updated successfully");

        } catch (error) {
            next(error);
        }
    };

    static publishEvent = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id);
            const updatedEvent = await EventService.publishEvent(id);
            return ok(res, updatedEvent, "Event published successfully");
        } catch (error) {
            next(error);
        }
    };
}

export default EventController;