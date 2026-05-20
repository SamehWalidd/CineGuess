const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      unique: true,
    },

    genre: {
      type: String,
      required: [true, "Genre is required"],
      trim: true,
    },

    decade: {
      type: String,
      required: [true, "Decade is required"],
      enum: ["1950s", "1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
    },

    director: {
      type: String,
      required: [true, "Director is required"],
      trim: true,
    },

    leadActor: {
      type: String,
      required: [true, "Lead actor is required"],
      trim: true,
    },

    plotHint: {
      type: String,
      required: [true, "Plot hint is required"],
      trim: true,
      maxlength: [200, "Plot hint must be 200 characters or fewer"],
    },

    year: {
      type: Number,
      required: [true, "Year is required"],
      min: [1950, "Year must be 1950 or later"],
      max: [new Date().getFullYear(), "Year cannot be in the future"],
    },

    posterUrl: {
      type: String,
      trim: true,
      default: "",
    },

    submittedBy: {
      type: String,
      trim: true,
      default: "seed",
    },
  },
  {
    timestamps: true,
  }
);

MovieSchema.pre("save", function (next) {
  if (this.year) {
    this.decade = `${Math.floor(this.year / 10) * 10}s`;
  }
  next();
});

module.exports = mongoose.model("Movie", MovieSchema);