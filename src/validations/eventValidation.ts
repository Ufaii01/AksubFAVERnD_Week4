import { z } from "zod";

export const eventSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters long").max(150, "Title must be less than 150 characters long"),
    description: z.string().min(20, "Description must be at least 20 characters long"),
    location: z.string().min(1, "Location is required (can be event's city or venue)"),
    date: z.string().min(1, "Date is required").refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format"
    }),
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
