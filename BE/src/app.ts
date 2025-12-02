import express from "express";
import router from "./routes/index";

import errorMiddleware from "./middlewares/error.middleware";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(router);

// Error handler cuối cùng
app.use(errorMiddleware);

export default app;
