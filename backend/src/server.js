require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const pool = require("./db");
const adminRoutes = require("./routes/admin");
const inquiryRoutes = require("./routes/inquiries");

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must be set to a random value of at least 32 characters.");
}

const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
}));
app.use(express.json({ limit: "20kb" }));

app.get("/api/health", (request, response) => {
  response.json({ status: "ok" });
});
app.use("/api/admin", adminRoutes);
app.use("/api/inquiries", inquiryRoutes);

const frontendDirectory = path.resolve(__dirname, "../../frontend/dist");
app.use(express.static(frontendDirectory));

app.get("*", (request, response, next) => {
  if (request.path.startsWith("/api/")) {
    return next();
  }

  return response.sendFile(path.join(frontendDirectory, "index.html"));
});

app.use((request, response) => {
  response.status(404).json({ error: "The requested endpoint was not found." });
});

app.use((error, request, response, next) => {
  if (response.headersSent) {
    return next(error);
  }

  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return response.status(400).json({ error: "Request body must contain valid JSON." });
  }

  console.error("Request failed:", error);
  return response.status(500).json({ error: "The server could not complete your request." });
});

async function startServer() {
  await pool.query("SELECT 1");
  app.listen(port, () => {
    console.log(`Inquiry API is listening on port ${port}.`);
  });
}

startServer().catch((error) => {
  console.error("The server could not connect to the database:", error.message);
  process.exitCode = 1;
});
