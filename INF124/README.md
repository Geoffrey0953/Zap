# Zap — UCI Campus Navigator

A web app for navigating the UCI campus: interactive map, building and department directory, walking directions, shuttle tracking, parking, class schedule, saved locations, emergency services, and an admin portal for managing campus data.

## Tech Stack

- React 18
- React Router 6
- React-Leaflet / Leaflet (interactive map)
- Create React App (react-scripts 5)

## Features

**Map & Navigation**
- Interactive UCI campus map (`/map`)
- Walking directions (`/directions`)
- Shuttle tracker (`/shuttle`)
- Parking assistant (`/parking`)

**Campus Directory**
- Campus directory hub (`/directory`)
- Building directory and detail pages (`/directory/buildings`, `/directory/buildings/:id`)
- Department search (`/directory/departments`)

**User (requires login)**
- Dashboard (`/dashboard`)
- Saved locations (`/saved`)
- Class schedule (`/schedule`)

**Safety & Support**
- Help center (`/help`)
- Emergency services (`/emergency`)

**Admin (requires admin role)**
- Admin portal (`/admin`)
- Manage building data (`/admin/buildings`)
- Dispatch alerts (`/admin/alerts`)

## Getting Started

```bash
cd INF124
npm install
npm start
```

The dev server runs at http://localhost:3000.

## Available Scripts

- `npm start` — start the development server
- `npm run build` — create a production build in `build/`
- `npm test` — run the Jest test runner

## Project Structure

```
INF124/
├── public/
└── src/
    ├── App.js              # Route definitions
    ├── index.js
    ├── components/         # Layout, SearchBar, ProtectedRoute
    ├── context/            # AuthContext (login + role state)
    ├── data/               # mockData.js (buildings, departments, etc.)
    ├── pages/              # One folder-equivalent per route
    └── styles/
```

## Auth Notes

Authentication state is provided by `AuthProvider` in `src/context/AuthContext.js`. Routes under `ProtectedRoute` require a logged-in user; routes under `ProtectedRoute requireAdmin` additionally require admin role. Sample users and campus data live in `src/data/mockData.js`.
