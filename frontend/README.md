# Cyber Quest (frontend)

React + Vite + Tailwind CSS v4 + React Router.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:5173. The backend should be running on http://localhost:3000.

In development every request to `/api/...` is proxied to `http://localhost:3000/...`
(see `vite.config.js`), so there are no CORS problems. For a production build, copy
`.env.example` to `.env` and set `VITE_API_URL`.

## Pages

| Route       | Page                                   |
| ----------- | -------------------------------------- |
| `/`         | Home (hero, purpose/target, team)      |
| `/mission`  | Boxes A/B + steps 1-5 (from the API)   |
| `/game`     | 4 questions, hints, submit, congrats   |
| `/feedback` | Rate & Feedback form                   |

## API endpoints (`src/api/client.js`)

| Call                      | Route                | Status                                    |
| ------------------------- | -------------------- | ----------------------------------------- |
| `getStep(id)`             | `GET /step/:id`      | Confirmed from the backend code           |
| `getQuestion(id)`         | `GET /question/:id`  | **Assumed** from the notes, please confirm |
| `getHint(id)`             | `GET /hint/:id`      | **Assumed** from the notes, please confirm |
| `checkAnswer(id, answer)` | `POST /answer`       | **Assumed** body `{ id, answer }`, response `{ correct }` |
| `sendFeedback(...)`       | `POST /feedback`     | **Assumed**, not in the notes             |

When the backend developer confirms the real routes/shapes, only `src/api/client.js`
(and the small response handling in `pages/Game.jsx`) needs to change.

## Text and images

Placeholder text (lorem ipsum, "Sample Name Here") lives in `src/data/content.js`.
Images are in `src/assets/`.
