import cors from "cors";
import express from "express";
import router from "./routes/index";
import errorMiddleware from "./middlewares/error.middleware";

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", router);

// Error handler cuối cùng
app.use(errorMiddleware);

export default app;
