import request from "supertest";
import EventRepository from "../src/repositories/eventRepository";
import app from "../src/index";
import jwt from "jsonwebtoken";

jest.mock("../src/repositories/eventRepository");

jest.mock("../src/middleware/rateLimiter", () => ({
    rateLimiter: (_req: any, _res: any, next: any) => next(),
}));

const mockRepo = EventRepository as jest.Mocked<typeof EventRepository>;

const makeToken = (payload: object) => jwt.sign(payload, "test-secret", { expiresIn: "1h" });

let attendeeToken: string;
let organizerToken: string;
let organizer2Token: string;
let adminToken: string;

beforeAll(() => {
    process.env.JWT_SECRET = "test-secret";
    attendeeToken   = makeToken({ id: 1, role: "attendee",  email: "attendee@example.com" });
    organizerToken  = makeToken({ id: 2, role: "organizer", email: "organizer@example.com" });
    organizer2Token = makeToken({ id: 3, role: "organizer", email: "organizer2@example.com" });
    adminToken      = makeToken({ id: 4, role: "admin",     email: "admin@evently.com" });
});

const publishedEvent = {
    id: 1,
    title: "Tech Conference 2025",
    description: "Annual tech conference with amazing speakers and workshops",
    location: "Jakarta",
    date: "2025-12-01",
    price: 100000,
    maxAttendees: 200,
    category: "conference",
    isPublished: true,
    organizerId: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
};

const unpublishedEvent = {
    ...publishedEvent,
    id: 2,
    isPublished: false,
};

const validEventBody = {
    title: "Tech Conference 2025",
    description: "Annual tech conference with amazing speakers and workshops",
    location: "Jakarta",
    date: "2099-12-01",
    price: 100000,
    maxAttendees: 200,
    category: "conference",
};

describe("GET /events", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("no 7: harus return 200 dan array event yang sudah dipublish", async () => {
        mockRepo.findAllEvents.mockResolvedValue([publishedEvent] as any);

        const response = await request(app)
            .get("/events")
            .set("Authorization", `Bearer ${attendeeToken}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data[0]).toHaveProperty("isPublished", true);
    });
});

describe("GET /events/:id", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("no 8: harus return 200 dan detail event jika event ditemukan", async () => {
        mockRepo.findById.mockResolvedValue(publishedEvent as any);

        const response = await request(app)
            .get("/events/1")
            .set("Authorization", `Bearer ${attendeeToken}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty("id", 1);
        expect(response.body.data).toHaveProperty("title", "Tech Conference 2025");
    });

    it("no 9: harus return 404 jika event tidak ditemukan", async () => {
        mockRepo.findById.mockResolvedValue(null);

        const response = await request(app)
            .get("/events/999")
            .set("Authorization", `Bearer ${attendeeToken}`);

        expect(response.status).toBe(404);
    });
});

describe("POST /events", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("no 10: harus return 201 jika organizer membuat event baru dengan data valid", async () => {
        mockRepo.create.mockResolvedValue({
            ...publishedEvent,
            isPublished: false,
            organizerId: 2,
        } as any);

        const response = await request(app)
            .post("/events")
            .set("Authorization", `Bearer ${organizerToken}`)
            .send(validEventBody);

        expect(response.status).toBe(201);
        expect(response.body.data).toHaveProperty("title", validEventBody.title);
    });

    it("no 11: harus return 401 jika request tanpa JWT token", async () => {
        const response = await request(app)
            .post("/events")
            .send(validEventBody);

        expect(response.status).toBe(401);
    });

    it("no 12: harus return 403 jika role bukan organizer", async () => {
        const response = await request(app)
            .post("/events")
            .set("Authorization", `Bearer ${attendeeToken}`)
            .send(validEventBody);

        expect(response.status).toBe(403);
    });

    it("no 13: harus return 400 jika validasi Zod gagal (misal: tanggal lampau)", async () => {
        const response = await request(app)
            .post("/events")
            .set("Authorization", `Bearer ${organizerToken}`)
            .send({
                ...validEventBody,
                date: "2000-01-01", 
            });

        expect(response.status).toBe(400);
    });
});

describe("PUT /events/:id", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("no 14: harus return 200 jika organizer mengedit event miliknya", async () => {
        mockRepo.findById.mockResolvedValue(publishedEvent as any); 
        mockRepo.update.mockResolvedValue({
            ...publishedEvent,
            title: "Updated Conference 2025",
        } as any);

        const response = await request(app)
            .put("/events/1")
            .set("Authorization", `Bearer ${organizerToken}`) 
            .send({ ...validEventBody, title: "Updated Conference 2025" });

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty("title", "Updated Conference 2025");
    });

    it("no 15: harus return 403 jika organizer mengedit event milik organizer lain", async () => {
        mockRepo.findById.mockResolvedValue(publishedEvent as any);

        const response = await request(app)
            .put("/events/1")
            .set("Authorization", `Bearer ${organizer2Token}`) 
            .send(validEventBody);

        expect(response.status).toBe(403);
    });
});

describe("DELETE /events/:id", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("no 16: harus return 200 jika organizer menghapus event miliknya", async () => {
        mockRepo.findById.mockResolvedValue(publishedEvent as any); 
        mockRepo.delete.mockResolvedValue(publishedEvent as any);

        const response = await request(app)
            .delete("/events/1")
            .set("Authorization", `Bearer ${organizerToken}`);

        expect(response.status).toBe(200);
    });

    it("no 17: harus return 404 jika event tidak ditemukan", async () => {
        mockRepo.findById.mockResolvedValue(null);

        const response = await request(app)
            .delete("/events/999")
            .set("Authorization", `Bearer ${organizerToken}`);

        expect(response.status).toBe(404);
    });
});

describe("PATCH /events/:id/publish", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("no 18: harus return 200 dan isPublished = true jika organizer mempublish event miliknya", async () => {
        mockRepo.findById.mockResolvedValue(unpublishedEvent as any); 
        mockRepo.update.mockResolvedValue({
            ...unpublishedEvent,
            isPublished: true,
        } as any);

        const response = await request(app)
            .patch("/events/2/publish")
            .set("Authorization", `Bearer ${organizerToken}`); 

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty("isPublished", true);
    });

    it("no 19: harus return 401 jika request tanpa JWT token", async () => {
        const response = await request(app).patch("/events/2/publish");

        expect(response.status).toBe(401);
    });
});

describe("GET /admin/events", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("no 20: harus return 200 dan semua event (termasuk unpublished) jika admin", async () => {
        mockRepo.findAllEventsForAdmin.mockResolvedValue([
            publishedEvent,
            unpublishedEvent,
        ] as any);

        const response = await request(app)
            .get("/admin/events")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBe(2);
    });

    it("no 21: harus return 403 jika role bukan admin", async () => {
        const response = await request(app)
            .get("/admin/events")
            .set("Authorization", `Bearer ${organizerToken}`);

        expect(response.status).toBe(403);
    });
});

describe("PUT /admin/events/:id", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("no 22: harus return 200 jika admin mengedit event milik organizer lain", async () => {
        mockRepo.findById.mockResolvedValue(publishedEvent as any);
        mockRepo.update.mockResolvedValue({
            ...publishedEvent,
            title: "Admin Edited Event",
        } as any);

        const response = await request(app)
            .put("/admin/events/1")
            .set("Authorization", `Bearer ${adminToken}`) 
            .send({ ...validEventBody, title: "Admin Edited Event" });

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty("title", "Admin Edited Event");
    });
});

describe("DELETE /admin/events/:id", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("no 23: harus return 200 jika admin menghapus event milik organizer lain", async () => {
        mockRepo.findById.mockResolvedValue(publishedEvent as any);
        mockRepo.delete.mockResolvedValue(publishedEvent as any);

        const response = await request(app)
            .delete("/admin/events/1")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
    });

    it("no 24: harus return 403 jika role bukan admin", async () => {
        const response = await request(app)
            .delete("/admin/events/1")
            .set("Authorization", `Bearer ${organizerToken}`);

        expect(response.status).toBe(403);
    });
});

describe("GET /admin/users", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("no 25: harus return 200 dan daftar semua user jika admin", async () => {
        mockRepo.findAllUsers.mockResolvedValue([
            { id: 1, name: "John Doe",  email: "john@example.com" },
            { id: 2, name: "Organizer", email: "organizer@example.com" },
        ] as any);

        const response = await request(app)
            .get("/admin/users")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data)).toBe(true);
    });

    it("no 26: harus return 403 jika role bukan admin", async () => {
        const response = await request(app)
            .get("/admin/users")
            .set("Authorization", `Bearer ${attendeeToken}`);

        expect(response.status).toBe(403);
    });
});

describe("PATCH /admin/users/:email", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("no 27: harus return 200 jika admin mengubah role user berdasarkan email", async () => {
        mockRepo.findUserByEmail.mockResolvedValue({
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            role: "attendee",
        } as any);
        mockRepo.updateUser.mockResolvedValue({
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            role: "organizer",
        } as any);

        const response = await request(app)
            .patch("/admin/users/john@example.com")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ role: "organizer" });

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty("role", "organizer");
    });

    it("no 28: harus return 404 jika email user tidak ditemukan", async () => {
        mockRepo.findUserByEmail.mockResolvedValue(null);

        const response = await request(app)
            .patch("/admin/users/tidakada@example.com")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ role: "organizer" });

        expect(response.status).toBe(404);
    });
});