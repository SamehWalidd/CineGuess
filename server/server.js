const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoSanitize = require("express-mongo-sanitize");
const connectDB = require("./config/db");
const movieRoutes = require("./routes/movieRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(mongoSanitize());

app.use("/api/movies", movieRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;  
app.listen(PORT, () => {
  console.log(`CineGuess server running on port ${PORT}`);
});