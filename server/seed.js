const mongoose = require("mongoose");
const axios = require("axios");
const dotenv = require("dotenv");
const Movie = require("./models/Movie");

dotenv.config();

const IMDB_IDS = [
  "tt0111161", // The Shawshank Redemption
  "tt0068646", // The Godfather
  "tt0071562", // The Godfather Part II
  "tt0468569", // The Dark Knight
  "tt0050083", // 12 Angry Men
  "tt0108052", // Schindler's List
  "tt0167260", // The Lord of the Rings: The Return of the King
  "tt0110912", // Pulp Fiction
  "tt0060196", // The Good, the Bad and the Ugly
  "tt0137523", // Fight Club
  "tt0120737", // The Lord of the Rings: The Fellowship of the Ring
  "tt0109830", // Forrest Gump
  "tt0167261", // The Lord of the Rings: The Two Towers
  "tt0080684", // Star Wars: The Empire Strikes Back
  "tt1375666", // Inception
  "tt0073486", // One Flew Over the Cuckoo's Nest
  "tt0099685", // Goodfellas
  "tt0133093", // The Matrix
  "tt0047478", // Seven Samurai
  "tt0317248", // City of God
  "tt0076759", // Star Wars: A New Hope
  "tt0102926", // The Silence of the Lambs
  "tt0038650", // It's a Wonderful Life
  "tt0118799", // Life Is Beautiful
  "tt0245429", // Spirited Away
  "tt0816692", // Interstellar
  "tt0120586", // American History X
  "tt0114369", // Se7en
  "tt0056058", // Harakiri
  "tt0364569", // Oldboy
];

const fetchMovie = async (imdbId) => {
  const url = `https://www.omdbapi.com/?i=${imdbId}&apikey=${process.env.OMDB_API_KEY}`;
  const { data } = await axios.get(url);

  if (data.Response === "False") {
    console.warn(`  ⚠  OMDb returned no data for ${imdbId}: ${data.Error}`);
    return null;
  }

  return data;
};

const mapToSchema = (data) => {
  const year = parseInt(data.Year);

  if (isNaN(year)) return null;

  return {
    title:       data.Title,
    genre:       data.Genre?.split(",")[0].trim(),   // First genre only
    year,
    director:    data.Director?.split(",")[0].trim(), // First director only
    leadActor:   data.Actors?.split(",")[0].trim(),   // First billed actor
    plotHint:    data.Plot?.substring(0, 200),        // Hard cap at 200 chars
    posterUrl:   data.Poster !== "N/A" ? data.Poster : "",
    submittedBy: "seed",
  };
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected\n");

    let inserted = 0;
    let skipped  = 0;
    let failed   = 0;

    for (const id of IMDB_IDS) {
      try {
        const data = await fetchMovie(id);
        if (!data) { failed++; continue; }

        const mapped = mapToSchema(data);
        if (!mapped) { failed++; continue; }

        const exists = await Movie.findOne({
          title: { $regex: `^${mapped.title}$`, $options: "i" },
        });

        if (exists) {
          console.log(`  ↩  Skipped (already exists): ${mapped.title}`);
          skipped++;
          continue;
        }

        await Movie.create(mapped);
        console.log(`  ✓  Inserted: ${mapped.title} (${mapped.year})`);
        inserted++;

        await new Promise((res) => setTimeout(res, 300));

      } catch (err) {
        console.error(`  ✗  Error on ${id}: ${err.message}`);
        failed++;
      }
    }

    console.log(`
── Seed complete ──────────────────────
  Inserted : ${inserted}
  Skipped  : ${skipped}
  Failed   : ${failed}
  Total    : ${IMDB_IDS.length}
───────────────────────────────────────`);

  } catch (err) {
    console.error("Seed failed:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }
};

seed();
