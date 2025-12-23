import cors from "cors";
import express from "express";
import router from "./routes/index";
import errorMiddleware from "./middlewares/error.middleware";

import sellerUploadRoutes from "./routes/seller.upload.route";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use("/seller", sellerUploadRoutes);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", router);

// Error handler cuối cùng
app.use(errorMiddleware);

export default app;
