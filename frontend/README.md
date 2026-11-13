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
| `getQuestion(id)`         | `GET /question/:id`  | Reads `{ data: { id, question, hint, type } }`; hints are included |
| `checkAnswer(answerId, answer)` | `POST /answer` | Sends `{ idAnswer, userAnswer }`; maps `{ message: "correct" }` to `{ correct: true } |
| `sendFeedback(...)`       | `POST /feedback`     | **Assumed**, not in the notes             |

Question and answer calls match the backend controllers. The feedback endpoint still
needs backend support. API response handling lives in `src/api/client.js`.

The remote question endpoint does not return `answerId`. The current database has
matching question and answer IDs (1–4), so the frontend uses the question ID for
`idAnswer`. If those relationships change, the frontend mapping must be updated
unless the API supplies an explicit `answerId`.

Network Builder and cable validation send `{ userAnswer: [...] }` and recognize
the remote backend's `{ message: "CONGRATULATIONS !!!" }` response as success.
These adapters live in `src/network/api.js`; backend source stays unchanged.

## Text and images

Placeholder text (lorem ipsum, "Sample Name Here") lives in `src/data/content.js`.
Images are in `src/assets/`.
