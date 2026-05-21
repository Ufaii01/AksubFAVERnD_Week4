import { prisma } from "../prisma";

class EventRepository {
    static findAllEvents = async () => {
        return prisma.event.findMany({
            where: {
            isPublished: true
            }
        });
    };

    static findAllEventsForAdmin = async () => {
        return prisma.event.findMany();
    };

    static findById = async (id: number) => {
        return prisma.event.findUnique({
            where: {
                id
            }
        });
    }

    static create = async (eventData: any) => {
        return prisma.event.create({
            data: eventData
        });
    };

    static update = async (id: number, eventData: any) => {
        return prisma.event.update({
            where: {
                id 
            },
            data: eventData
        });
    };

    static delete = async (id: number) => {
        return prisma.event.delete({
            where: {
                id
            }
        });
    }

    static findAllUsers = async () => {
        return prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
            }
        });
    }

    static findUserByEmail = async (email: string) => {
        return prisma.user.findUnique({
            where: {
                email
            }
        });
    }

    static updateUser = async (email: string, role: string) => {
        return prisma.user.update({
            where: {
                email
            },
            data: {
                role
            }
        });
    }
}

export default EventRepository;