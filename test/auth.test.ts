import request from "supertest";
import AuthRepository from "../src/repositories/authRepository";
import bcrypt from "bcrypt";
import app from "../src";

jest.mock("../src/repositories/authRepository");

jest.mock("bcrypt");

jest.mock("../src/middleware/rateLimiter", () => ({
    rateLimiter: (_req: any, _res: any, next: any) => next(),
}));

const mockRepo   = AuthRepository as jest.Mocked<typeof AuthRepository>;
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe("POST /auth/Register", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("no 1: harus return 201 jika data valid", async () => {
        mockRepo.findByEmail.mockResolvedValue(null);
        (mockBcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword123");
        mockRepo.register.mockResolvedValue({
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            password: "hashedPassword123",
            role: "attendee",
            createdAt: new Date(),
            updatedAt: new Date(),
        } as any);

        const response = await request(app)
            .post("/auth/Register")
            .send({
                name: "John Doe",
                email: "john@example.com",
                password: "Password1",
            });

        expect(response.status).toBe(201);

        expect(response.body.data).toHaveProperty("name", "John Doe");
        expect(response.body.data).toHaveProperty("email", "john@example.com");
    });

    it("no 2: harus return 409 jika email sudah terdaftar", async () => {
        mockRepo.findByEmail.mockResolvedValue({
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            password: "hashedPassword123",
            role: "attendee",
            createdAt: new Date(),
            updatedAt: new Date(),
        } as any);

        const response = await request(app)
            .post("/auth/Register")
            .send({
                name: "John Doe",
                email: "john@example.com",
                password: "Password1",
            });
        expect(response.status).toBe(409);
    });

    it("no 3: harus return 400 jika password tidak memenuhi syarat", async () => {
        const response = await request(app)
            .post("/auth/Register")
            .send({
                name: "John Doe",
                email: "john@example.com",
                password: "weak",  
            });

        expect(response.status).toBe(400);
    });

});

describe("POST /auth/Login", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.JWT_SECRET = "test-secret";
    });

    const existingUser = {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        password: "hashedPassword123",
        role: "attendee",
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    it("no 4: harus return 200 dan JWT token jika kredensial benar", async () => {
        mockRepo.findByEmail.mockResolvedValue(existingUser as any);
        (mockBcrypt.compare as jest.Mock).mockResolvedValue(true);

        const response = await request(app)
            .post("/auth/Login")
            .send({
                email: "john@example.com",
                password: "Password1",
            });

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty("token");
        expect(typeof response.body.data.token).toBe("string");
    });

    it("no 5: harus return 401 jika password salah", async () => {
        mockRepo.findByEmail.mockResolvedValue(existingUser as any);
        (mockBcrypt.compare as jest.Mock).mockResolvedValue(false);

        const response = await request(app)
            .post("/auth/Login")
            .send({
                email: "john@example.com",
                password: "SalahPassword1",
            });
        expect(response.status).toBe(401);
    });

    it("no 6: harus return 401 jika email tidak ditemukan", async () => {
        mockRepo.findByEmail.mockResolvedValue(null);

        const response = await request(app)
            .post("/auth/Login")
            .send({
                email: "tidakada@example.com",
                password: "Password1",
            });
        expect(response.status).toBe(401);
    });

});