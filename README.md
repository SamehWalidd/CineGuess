# CineGuess

CineGuess is a movie guessing game built with a React frontend and an Express/MongoDB backend. Players receive progressive clues, submit guesses, add new movies to the database, and view session stats.

## Features

- Game page with sequential clues and answer validation
- Submit page for adding movies to the catalog
- Stats page for session tracking
- Archive page placeholder for future expansion
- Express API backed by MongoDB and seeded from OMDb

## Tech Stack

| Layer | Tech |
| --- | --- |
| Frontend | React 18, React Router, Vite, Bootstrap |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Data Source | OMDb API for seeding |

## Project Structure

```text
CineGuess/
├── client/   # React frontend
└── server/   # Express API and seed script
```

## Getting Started

### 1. Install dependencies

```bash
cd server
npm install

cd ../client
npm install
```

### 2. Configure environment variables

Create a `.env` file in `server/`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/cineguess
OMDB_API_KEY=your_omdb_key_here
```

### 3. Seed the database

```bash
cd server
npm run seed
```

### 4. Run the apps

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend in a second terminal:

```bash
cd client
npm run dev
```

## Production Build

The backend serves the compiled frontend from `client/dist` in production.

```bash
cd client
npm run build

cd ../server
npm start
```

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/movies/random` | Returns a random movie for the game |
| GET | `/api/movies/check?title=` | Checks whether a title already exists |
| POST | `/api/movies/check-title` | Validates a guess against a movie id |
| POST | `/api/movies` | Adds a new movie |
| GET | `/api/movies` | Returns all movies for the archive |

## Frontend Routes

| Path | Page |
| --- | --- |
| `/` | Game |
| `/submit` | Submit |
| `/stats` | Stats |

## Notes

- `server/seed.js` populates the catalog with curated movie data from OMDb.
- `server/server.js` also serves the frontend build in production.
- The repo currently uses local MongoDB.
