# CineGuess — Backend API

Movie guessing game where players identify a film from sequential clues revealed over 6 attempts.

## Stack

- Node.js + Express
- MongoDB (local) + Mongoose
- OMDb API (seed only)

## Setup

### Prerequisites

- Node.js v18+
- MongoDB running locally

### Install

```bash
git clone https://github.com/YOUR_USERNAME/cineguess-server.git
cd cineguess-server/server
npm install
```

### Environment

```bash
cp .env.example .env
```

```shellscript
PORT=port_number
MONGO_URI=mongodb://localhost:27017/database_name
OMDB_API_KEY=omdb_key
```

### Run

```bash
npm run dev      # development
npm start        # production
```

### Seed Database

```bash
npm run seed
```

## API Endpoints


| Method | Route                      | Description                 |
| ------ | -------------------------- | --------------------------- |
| GET    | `/api/movies/random`       | Random movie — title hidden |
| GET    | `/api/movies/check?title=` | Duplicate title check       |
| POST   | `/api/movies`              | Submit a new movie          |
| GET    | `/api/movies`              | All movies (archive)        |


