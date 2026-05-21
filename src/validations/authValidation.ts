import { z } from "zod";

const registerSchema = z.object({
    name: z.string().min(3, "Name must be greater than 3 characters long").max(100, "Name must be less than 100 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long").regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
    role : z.enum(["admin", "attendee", "organizer"]).default("attendee")
});

export { registerSchema };