import express from "express";
import authRouter from "./routes/auth";
import eventRouter from "./routes/event";
import { errorHandler } from "./middleware/error";

const app = express();
const port = 3000;

app.use(express.json());
app.get("/", (req, res) => {
    res.redirect("/events");
});

app.use("/auth", authRouter);
app.use("/events", eventRouter);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});


