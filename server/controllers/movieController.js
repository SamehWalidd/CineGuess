const Movie = require("../models/Movie");

const getRandomMovie = async (req, res) => {
  try {
    const count = await Movie.countDocuments();

    if (count === 0) {
      return res.status(404).json({ message: "No movies in database yet" });
    }

    const randomIndex = Math.floor(Math.random() * count);

    const movie = await Movie.findOne().skip(randomIndex).select("-title -submittedBy -createdAt -updatedAt -__v");

    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch random movie", error: error.message });
  }
};

const checkTitle = async (req, res) => {
  try {
    const { title } = req.query;

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title query parameter is required" });
    }

   
    const existing = await Movie.findOne({
      title: { $regex: `^${title.trim()}$`, $options: "i" },
    });

    if (existing) {
      return res.status(200).json({ exists: true, message: "This movie is already in the database" });
    }

    res.status(200).json({ exists: false, message: "Title is available" });
  } catch (error) {
    res.status(500).json({ message: "Failed to check title", error: error.message });
  }
};

const createMovie = async (req, res) => {
  try {
    const { title, genre, year, director, leadActor, plotHint, posterUrl, submittedBy } = req.body;

    if (!title || !genre || !year || !director || !leadActor || !plotHint) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["title", "genre", "year", "director", "leadActor", "plotHint"],
      });
    }

    const duplicate = await Movie.findOne({
      title: { $regex: `^${title.trim()}$`, $options: "i" },
    });

    if (duplicate) {
      return res.status(409).json({ message: "A movie with this title already exists" });
    }

    const movie = await Movie.create({
      title: title.trim(),
      genre: genre.trim(),
      year: Number(year),
      director: director.trim(),
      leadActor: leadActor.trim(),
      plotHint: plotHint.trim(),
      posterUrl: posterUrl?.trim() || "",
      submittedBy: submittedBy?.trim() || "anonymous",
    });

    res.status(201).json({ message: "Movie added successfully", movie });
  } catch (error) {
    // Mongoose validation error
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: "Validation failed", errors: messages });
    }

    res.status(500).json({ message: "Failed to create movie", error: error.message });
  }
};


const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find()
      .select("-__v")
      .sort({ createdAt: -1 });   // Newest first

    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch movies", error: error.message });
  }
};

module.exports = {
  getRandomMovie,
  checkTitle,
  createMovie,
  getAllMovies,
};