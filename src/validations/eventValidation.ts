import { z } from "zod";

export const eventSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters long").max(150, "Title must be less than 150 characters long").trim(),
    description: z.string().min(20, "Description must be at least 20 characters long").trim(),
    location: z.string().min(1, "Location is required (can be event's city or venue)").trim(),
    date: z.string().min(1, "Date is required")
    .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        "Format must be YYYY-MM-DD"
    )
    .refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date"
    })
    .refine((date) => {
        const inputDate = new Date(date);
        const today = new Date();

        today.setHours(0, 0, 0, 0);

        return inputDate > today;
    }, { message: "Date must be at least 1 day after today" }),
    price: z.number().min(0, "Price must be a positive number"),
    maxAttendees: z.number().min(1, "Max attendees must be at least 1"),  
    category: z.string().transform((val) => val.toLowerCase()).pipe(z.enum([
      "conference",
      "workshop",
      "seminar",
      "concert",
      "sport",
      "charity",
      "cultural",
    ]))
});