const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const subRoutes = require("./routes/sub");
const userRoutes = require("./routes/user");

dotenv.config();

const app = express();


const cors = require("cors");
app.use(cors({
  origin: "*"
}));

app.use(express.json());

app.get("/api/health", (req, res) => {
  return res.status(200).json({ ok: true });
});

app.use("/api/auth", userRoutes);
app.use("/api/subs", subRoutes);

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const status = err.statusCode || 500;
  const message = err.message || "Something went wrong.";

  if (status >= 500) {
    console.error(err);
  }

  return res.status(status).json({ message });
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  });
