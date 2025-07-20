// imports //
import "dotenv/config";
import express from "express";
import cors from "cors";

// routes imports //
import authRoutes from "./routes/authRoutes.js";

const app = express();

// middleware //

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
// routes
app.use("/api/auth", authRoutes);
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}.`);
});
