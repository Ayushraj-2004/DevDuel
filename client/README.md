# DevDuel client

React and Vite frontend for the DevDuel real-time quiz battle platform.

## Run locally

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` if the API is not at `http://localhost:3000`.
3. Start the frontend with `npm run dev`.

The backend must be running with a configured MongoDB connection for sign-in,
profiles, matchmaking, and live battles. `VITE_API_URL` sets the shared HTTP and
Socket.IO server origin; it defaults to `http://localhost:3000`.

## Verify

- `npm run build` creates the production frontend in `dist`.
- `npm run lint` checks the client source.
