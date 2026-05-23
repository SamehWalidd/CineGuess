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
  "tt0147800", // 10 Things I Hate About You
  "tt19770238", // Aftersun
  "tt2209418", // Before Midnight
  "tt0112471", // Before Sunrise
  "tt0381681", // Before Sunset
  "tt0087182", // Dune
  "tt0432283", // Fantastic Mr. Fox
  "tt14905854", // Hamnet
  "tt8946378", // Knives Out
  "tt0250494", // Legally Blonde
  "tt0414387", // Pride & Prejudice
  "tt1041829", // The Proposal
  "tt0253474", // The Pianist
  "tt0050083", // 12 Angry Men
  "tt12042730", // Project Hail Mary
  "tt0064107", // A Boy Named Charlie Brown
  "tt1980929", // Begin Again
  "tt2278388", // The Grand Budapest Hotel
  "tt1285016", // The Social Network
  "tt32916440", // Marty Supreme
  "tt0816692", // Interstellar
  "tt2582802", // Whiplash
  "tt0361748", // Inglourious Basterds
  "tt0892769", // How to Train Your Dragon
  "tt14849194", // The Holdovers
  "tt7286456", // Joker
  "tt1485796", // The Greatest Showman
  "tt3783958", // La La Land
  "tt2674426", // Me Before You
  "tt2361509", // The Intern
  "tt2194499", // About Time
  "tt1670345", // Now You See Me
  "tt1375666", // Inception
  "tt1572162", // (500) Days of Summer
  "tt0458352", // The Devil Wears Prada
  "tt0338013", // Eternal Sunshine of the Spotless Mind
  "tt0251127", // How to Lose a Guy in 10 Days
  "tt0097165", // Dead Poets Society
  "tt6751668", // Parasite
  "tt0137523", // Fight Club
  "tt1517268", // Barbie
  "tt0110912", // Pulp Fiction
  "tt1877830", // The Batman
  "tt9362722", // Spider-Man: Across the Spider-Verse
  "tt0109830", // Forrest Gump
  "tt16426418", // Challengers
  "tt0111161", // The Shawshank Redemption
  "tt0120338", // Titanic
  "tt0119217", // Good Will Hunting
  "tt0993846", // The Wolf of Wall Street
  "tt1798709", // Her
  "tt0337563", // 13 Going on 30
  "tt4034228", // Manchester by the Sea
  "tt2119532", // Hacksaw Ridge
  "tt2380307", // Coco
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
  const year = parseInt(data.Year, 10);

  if (Number.isNaN(year)) return null;
  if (year < 1950) return null;

  return {
    title:       data.Title,
    genre:       data.Genre?.split(",")[0].trim(),   
    year,
    director:    data.Director?.split(",")[0].trim(), 
    leadActor:   data.Actors?.split(",")[0].trim(),   
    plotHint:    data.Plot?.substring(0, 200),        
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
