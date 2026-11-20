# Cyber Quest frontend

React + Vite + React Router. The responsive interface follows the homepage and
page layouts in `../drafts/`, using the existing artwork and backend API.
The drafts are design references; they are not required at runtime.

## Run and check

```bash
npm ci
npm run dev
```

Open http://localhost:5173. Run the existing backend separately on port 3000.
Vite forwards `/api/*` requests to `http://localhost:3000/*`. For production,
set `VITE_API_URL` before building, or configure your host to proxy `/api`.
The static host must serve `index.html` for client-side routes.

```bash
npm run build
npm test
```

## Screens

| Route | Screen |
| --- | --- |
| `/` | Homepage, mission cards, project introduction, live feedback chart, team placeholders |
| `/mission` | Quiz briefing with five API instructions |
| `/game` | Four sequential questions, API checks, hints, progress |
| `/network` | Redirect to the network briefing |
| `/network/1` | Network briefing with four API instructions |
| `/network/1/build` | Network canvas, device controls, connections, validation |
| `/network/1/challenge` | Eight-wire cable challenge and backend hints |
| `/feedback` | Five ratings submitted directly to the feedback endpoint |

Network devices can be added by clicking or dragging. Move a device by dragging
or using arrow keys. Turn on the cable tool and select two devices to connect
them. Remove individual connections through **Manage connections**.
The cable challenge supports selecting a wire then a slot, as well as dragging;
select a filled slot with no wire selected to return its wire to the tray.

## Backend contracts

| Endpoint | Use |
| --- | --- |
| `GET /step/:id` | Quiz instructions 1–5, from `message` |
| `GET /question/:id` | Questions 1–4 and hints, from `data` |
| `POST /answer` | `{ idAnswer, userAnswer }`; success is `message: "correct"` |
| `GET /mission/:id` | Network instructions 1–4, from `message` |
| `GET /hint/builder/1` | Network hint |
| `GET /hint/cable/:id` | Cable hints 1–4; absent hints display an unavailable message |
| `POST /validate/builder` | `{ userAnswer: [...] }` containing device names |
| `POST /validate/cable` | `{ userAnswer: [...] }` containing full wire color names |
| `GET /drawChart` | Feedback count and average metrics, registered feedback router |
| `POST /feedback` | Five numeric ratings, registered feedback router |

The question endpoint omits `answerId`. The frontend preserves the existing
mapping of question IDs 1–4 to matching answer IDs, preferring an explicit
`answerId` if supplied. If the database relationships differ, the mapping must
be configured; the current endpoint cannot reveal it.

Network validation serializes connected devices in breadth-first order from
Internet, with PC represented by the backend's legacy `SERVER` label. Both
challenge validators recognize `message: "CONGRATULATIONS !!!"` as success.
The builder supports the full network required by the backend, rather than the
draft's simplified four-device demonstration. There is no mock mode in the app.

### Feedback flow

The existing `routes/feedback.ts` router is registered in `backend/src/index.ts`,
exposing `POST /feedback` and `GET /drawChart`.

The checked-in Prisma schema currently omits `Feedback`, although the installed
generated client and existing database migration include it. The schema was
left unchanged as requested. Regenerating the client from that schema will
remove feedback model support; current endpoint verification used the existing
generated client.

The feedback form enables Send after all five categories are rated. It posts
directly to `/feedback`, independently of the chart endpoint. The landing page
fetches `/drawChart` on every visit, including after returning from feedback,
and provides loading, empty, failure/retry, and refresh states.
The form is wired to the controller's actual fields: `satisfaction`, `enjoyment`,
`easeOfUse`, `learning`, and `interest` (each an integer from 1 to 5). The draft's
single score and optional comment are adapted to those supported fields.
No unsupported message/name/age fields are sent. A successful submission is
shown only after the backend confirms it saved the ratings. Returning home then fetches the updated
summary. Empty summaries are supported.

## Implementation and testing

Shared styles are in `src/index.css`; homepage styles are scoped in
`src/pages/home.css`. Native dialogs contain focus, close with Escape and return
focus to their trigger. Mission/question loading failures offer retry controls.
API adapters live in `src/api/client.js` and `src/network/api.js`; topology
serialization is in `src/network/topology.js`.

`npm test` runs Node API-contract and topology tests. Live checks require the
existing backend and its populated PostgreSQL database. Feedback success/error
flows can be checked using fixtures without creating database records.
Team names and roles remain placeholders as in the supplied draft.
