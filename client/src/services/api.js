const BASE_URL = '/api';

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) {
    const message = data?.message || `Request failed with status ${res.status}`;
    throw new Error(message);
  }
  return data;
}

export async function getRandomMovie() {
  const res = await fetch(`${BASE_URL}/movies/random`);
  return handleResponse(res);
}

export async function checkTitle(title, movieId, reveal = false) {
  const res = await fetch(`${BASE_URL}/movies/check-title`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, movieId, reveal }),
  });
  return handleResponse(res);
}

export async function checkMovieExists(title) {
  const params = new URLSearchParams({ title });
  const res = await fetch(`${BASE_URL}/movies/check?${params}`);
  return handleResponse(res);
}

export async function createMovie(movieData) {
  const res = await fetch(`${BASE_URL}/movies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(movieData),
  });
  return handleResponse(res);
}

export async function getAllMovies() {
  const res = await fetch(`${BASE_URL}/movies`);
  return handleResponse(res);
}
