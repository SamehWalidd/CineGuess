const express = require("express");
const router = express.Router();
const {
  getRandomMovie,
  checkTitle,
  checkGuessTitle,
  createMovie,
  getAllMovies,
} = require("../controllers/movieController");

router.get("/random", getRandomMovie);
router.get("/check", checkTitle);
router.post("/check-title", checkGuessTitle);
router.post("/", createMovie);
router.get("/", getAllMovies);

module.exports = router;