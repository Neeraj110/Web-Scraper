# Hacker News Story Hub

Production-ready MERN app for scraping the top Hacker News stories, authenticating users with JWT, and bookmarking stories from a responsive React UI.

## Tech Stack

Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, Axios, Cheerio

Frontend: React, Vite, Tailwind CSS, React Context API, Axios, react-hot-toast

## Project Structure

```text
backend/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    services/
    utils/
    app.js
    server.js
frontend/
  src/
    api/
    components/
    context/
    pages/
    routes/
```

## Environment Variables

Backend example: [backend/.env.example](backend/.env.example)

Frontend example: [frontend/.env.example](frontend/.env.example)

## Setup

1. Install backend dependencies.

   ```bash
   cd backend
   npm install
   ```

2. Install frontend dependencies.

   ```bash
   cd frontend
   npm install
   ```

3. Copy the example env files and set your own values.

4. Start the backend.

   ```bash
   cd backend
   npm start
   ```

5. Start the frontend.

   ```bash
   cd frontend
   npm run dev
   ```

## Backend Scripts

- `npm start` runs the API server.
- `npm run dev` runs the API server with file watching.

## Frontend Scripts

- `npm run dev` starts the Vite dev server.
- `npm run build` creates a production build.
- `npm run preview` previews the built app.

## API Documentation

### Health

- `GET /api/health`

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

Request body:

```json
{
  "name": "Jane Reader",
  "email": "jane@example.com",
  "password": "secure-password"
}
```

Response includes a JWT token and a password-free user payload.

### Stories

- `GET /api/stories?page=1&limit=10`
- `GET /api/stories/:id`
- `POST /api/stories/:id/bookmark`

The list endpoint sorts by points descending and supports pagination.

The bookmark endpoint is protected and toggles the story ID in the current user’s bookmarks array.

### Scraper

- `POST /api/scrape`

This fetches the top 10 Hacker News stories, clears the old story collection, and stores the fresh scrape.

## Scraper Behavior

- Scrapes from `https://news.ycombinator.com`
- Uses `.athing`, `.titleline a`, `.score`, `.hnuser`, and `.age`
- Handles missing points with `parseInt(pointsText) || 0`
- Prevents duplicates by clearing old stories before insert
- Runs automatically when the server starts

## Frontend Behavior

- Home page with responsive story cards
- Login and register pages
- Protected bookmarks page
- JWT stored in `localStorage`
- Context-driven persisted auth state
- Bookmark toggling synced with the backend
- Loading states, error states, skeleton loaders, pagination, and toast notifications

## Deployment Notes

- Set `NODE_ENV=production` in the backend environment.
- Set `CLIENT_URL` to the deployed frontend origin.
- Build the frontend with `npm run build` and serve the generated `dist` folder from your host of choice.
- Provide secure production values for `MONGO_URI` and `JWT_SECRET`.

## Commit History

The assignment notes in `test.txt` map to the intended feature-by-feature commit sequence:

- setup backend structure
- implement authentication APIs
- add scraper service
- implement story APIs
- setup frontend routing
- implement auth context
- add bookmark functionality
- add protected routes
- improve UI and loading states
- prepare deployment and README

Use those messages as the commit titles when pushing the completed work to GitHub.
