const express = require("express");
const cors = require("cors");
const path = require("path");
const analyzeRoutes = require("./routes/analyzeRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ──
app.use("/api", analyzeRoutes);

// ── Health check ──
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Global error handler ──
app.use((err, _req, res, _next) => {
  console.error("Error:", err.message);

  // Multer file-size error
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "File too large. Maximum size is 5 MB." });
  }

  // Multer / validation errors
  if (err.message && err.message.includes("Invalid file type")) {
    return res.status(400).json({ error: err.message });
  }

  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

// ── Start ──
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
});

module.exports = app;
