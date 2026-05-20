# 🎬 CineGuess

A movie guessing game. Six clues. One film. Can you guess it?

## Pages
- **Game** — guess the movie from sequential clues
- **Submit** — add a movie to the database
- **Archive** — browse all submitted movies

## Stack
| Layer | Tech |
|-------|------|
| Frontend | React.js + Bootstrap |
| Backend | Node.js + Express |
| Database | MongoDB (local) |

## Project Structure
```
cineguess/
├── client/     # React frontend
└── server/     # Express REST API
```

## Getting Started

### Backend
```bash
cd server
npm install
npm run seed    # populate database
npm run dev     # start on port 5000
```

## API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/movies/random` | Random movie for the game |
| GET | `/api/movies/check?title=` | Duplicate check |
| POST | `/api/movies` | Submit a movie |
| GET | `/api/movies` | All movies |

## Environment Variables
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/cineguess
OMDB_API_KEY=your_key_here
```
