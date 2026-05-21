import { eventSchema } from "../validations/eventValidation";
import EventRepository from "../repositories/eventRepository";

class EventService {
    static getAllEvents = async (role: string) => {
        if (role === "admin") {
            return EventRepository.findAllEventsForAdmin();
        }
        return EventRepository.findAllEvents();
    };

    static getEventById = async (id: number) => {
        return EventRepository.findById(id);
    };

    static createEvent = async (eventData: any) => {
        const validatedData = eventSchema.safeParse(eventData);
        if (!validatedData.success) {
            throw new Error(validatedData.error.message);
        }
        return EventRepository.create(validatedData);
    };

    static updateEvent = async (id: number, eventData: any) => {
        const existingEvent = await EventRepository.findById(id);
        if (!existingEvent) {
            throw new Error("Event not found");
        }
        const validatedData = eventSchema.safeParse(eventData);
        if (!validatedData.success) {
            throw new Error(validatedData.error.message);
        }
        return EventRepository.update(id, validatedData);
    };

    static deleteEvent = async (id: number) => {
        const existingEvent = await EventRepository.findById(id);
        if (!existingEvent) {
            throw new Error("Event not found");
        }
        return EventRepository.delete(id);
    };

    static getAllUsers = async () => {
        return EventRepository.findAllUsers();
    };

    static getUserByEmail = async (email: string) => {
        return EventRepository.findUserByEmail(email);
    };

    static updateUser = async (email: string, role: string) => {
        return EventRepository.updateUser(email, role);
    };
}

export default EventService;