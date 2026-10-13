import "dotenv/config";
import express from "express";
import cors from "cors";
import uploadRouter from "./routes/upload.js";
import chatRouter from "./routes/chat.js";
import inventoryRouter from "./routes/inventory.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "DatasheetIQ API",
    version: "1.0.0",
    groqConfigured: !!process.env.GROQ_API_KEY,
  });
});

// Routes
app.use("/api/upload", uploadRouter);
app.use("/api/chat", chatRouter);
app.use("/api/inventory", inventoryRouter);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n⚡ DatasheetIQ API running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
  console.log(
    `   Groq API: ${process.env.GROQ_API_KEY ? "✅ Configured" : "❌ Missing GROQ_API_KEY"}`
  );
  console.log("");
});

export default app;
