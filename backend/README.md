# Zap Backend API

UCI Campus Navigator — Backend REST API built with Node.js, Express, and MongoDB (Mongoose).

## Prerequisites

- **Node.js** v18+ and **npm** v9+
- **MongoDB Atlas** account (or local MongoDB instance)

## Setup

1. **Install dependencies**

   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables**

   Copy the example env file and fill in your values:

   ```bash
   cp .env.example .env
   ```

   Required variables:
   | Variable       | Description                                      |
   |----------------|--------------------------------------------------|
   | `MONGODB_URI`  | MongoDB Atlas connection string                  |
   | `JWT_SECRET`   | Secret key for signing JWT tokens                |
   | `PORT`         | Server port (default: 5000)                      |
   | `CLIENT_URL`   | Frontend URL for CORS (default: http://localhost:3000) |

3. **Run the server**

   ```bash
   # Development (with auto-reload via nodemon)
   npm run dev

   # Production
   npm start
   ```

   The API will be available at `http://localhost:5000`.

## Health Check

```
GET /api/health
```

Response: `{ "status": "ok" }`

## Project Structure

```
backend/
  src/
    index.js              # Entry point — loads env, connects DB, starts server
    app.js                # Express app setup (CORS, JSON, morgan, routes)
    config/
      db.js               # MongoDB connection via Mongoose
    middleware/
      auth.js             # JWT verification & admin guard
      errorHandler.js     # Global error handler
  .env.example            # Template for environment variables
  package.json
```

## API Documentation

### Authentication

All auth endpoints are prefixed with `/api/auth`.

#### POST /api/auth/register
Register a new user. Default role is `student`.

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@uci.edu",
  "password": "mypassword"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "...",
    "email": "jane@uci.edu",
    "name": "Jane Doe",
    "role": "student",
    "year": "",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

| Status | Meaning                              |
|--------|--------------------------------------|
| 201    | User created successfully            |
| 400    | Missing fields or password too short |
| 409    | Email already registered             |

---

#### POST /api/auth/login
Authenticate an existing user.

**Request Body:**
```json
{
  "email": "student@uci.edu",
  "password": "password"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

| Status | Meaning                     |
|--------|-----------------------------|
| 200    | Login successful            |
| 400    | Missing email or password   |
| 401    | Invalid email or password   |

---

#### GET /api/auth/me
Return the currently authenticated user. Requires Bearer token.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "user": { ... }
}
```

| Status | Meaning                    |
|--------|----------------------------|
| 200    | Current user returned      |
| 401    | Missing or invalid token   |
| 404    | User not found             |

---

---

### Buildings

All building endpoints are prefixed with `/api/buildings`.

#### GET /api/buildings
Return all buildings (public).

**curl:**
```bash
curl http://localhost:5000/api/buildings
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "...",
      "id": "ics",
      "name": "Donald Bren Hall",
      "abbr": "DBH",
      "category": "Academic",
      "lat": 33.6430,
      "lng": -117.8418,
      "hours": "Mon–Fri 7am–10pm",
      "description": "Home of the Donald Bren School of Information and Computer Sciences.",
      "departments": ["Computer Science", "Informatics", "Statistics"],
      "image": null,
      "createdAt": "...",
      "updatedAt": "..."
    }
    // ... more buildings
  ]
}
```

---

#### GET /api/buildings/:id
Return a single building by its slug (public).

**curl:**
```bash
curl http://localhost:5000/api/buildings/ics
```

**Success Response (200):**
```json
{
  "success": true,
  "data": { ... }
}
```

| Status | Meaning           |
|--------|-------------------|
| 200    | Building returned |
| 404    | Building not found |

---

#### POST /api/buildings
Create a new building. **Requires admin token.**

**curl:**
```bash
curl -X POST http://localhost:5000/api/buildings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{
    "name": "Engineering Hall",
    "abbr": "EH",
    "category": "Academic",
    "lat": 33.6440,
    "lng": -117.8405,
    "hours": "Mon–Fri 8am–6pm",
    "description": "Engineering building.",
    "departments": ["Engineering"]
  }'
```

**Success Response (201):**
```json
{
  "success": true,
  "data": { ... }
}
```

| Status | Meaning                                      |
|--------|----------------------------------------------|
| 201    | Building created                             |
| 400    | Missing required fields (name, abbr, category, lat, lng) |
| 401    | No token provided                            |
| 403    | Not an admin                                 |
| 409    | Building id already exists                   |

---

#### PUT /api/buildings/:id
Update a building. **Requires admin token.** Only include fields you want to change.

**curl:**
```bash
curl -X PUT http://localhost:5000/api/buildings/ics \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{
    "hours": "Mon–Fri 7am–11pm",
    "description": "Updated description."
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "data": { ... }
}
```

| Status | Meaning              |
|--------|----------------------|
| 200    | Building updated     |
| 400    | Validation error     |
| 401    | No token provided    |
| 403    | Not an admin         |
| 404    | Building not found   |

---

#### DELETE /api/buildings/:id
Delete a building. **Requires admin token.**

**curl:**
```bash
curl -X DELETE http://localhost:5000/api/buildings/parking1 \
  -H "Authorization: Bearer <admin_token>"
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {}
}
```

| Status | Meaning            |
|--------|--------------------|
| 200    | Building deleted   |
| 401    | No token provided  |
| 403    | Not an admin       |
| 404    | Building not found |

---

### Alerts

All alert endpoints are prefixed with `/api/alerts`.

#### GET /api/alerts
Return all alerts (public). Optional query `?active=true` filters to active alerts only.

**curl:**
```bash
curl http://localhost:5000/api/alerts
curl "http://localhost:5000/api/alerts?active=true"
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "...",
      "type": "info",
      "title": "Shuttle Delay",
      "message": "Irvine Connect route is running 5 minutes behind schedule.",
      "active": true,
      "createdAt": "...",
      "updatedAt": "..."
    }
    // ... more alerts
  ]
}
```

---

#### GET /api/alerts/:id
Return a single alert by its MongoDB `_id` (public).

**curl:**
```bash
curl http://localhost:5000/api/alerts/<alert_id>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": { ... }
}
```

| Status | Meaning        |
|--------|----------------|
| 200    | Alert returned |
| 404    | Alert not found |

---

#### POST /api/alerts
Create a new alert. **Requires admin token.**

**curl:**
```bash
curl -X POST http://localhost:5000/api/alerts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{
    "type": "warning",
    "title": "Campus Power Outage",
    "message": "Scheduled maintenance from 10pm to 2am in Engineering area.",
    "active": true
  }'
```

**Success Response (201):**
```json
{
  "success": true,
  "data": { ... }
}
```

| Status | Meaning                                  |
|--------|------------------------------------------|
| 201    | Alert created                            |
| 400    | Missing required fields (type, title, message) |
| 401    | No token provided                        |
| 403    | Not an admin                             |

---

#### PUT /api/alerts/:id
Update or toggle an alert. **Requires admin token.** Only include fields you want to change.

**curl:**
```bash
# Toggle active status
curl -X PUT http://localhost:5000/api/alerts/<alert_id> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{ "active": false }'

# Edit fields
curl -X PUT http://localhost:5000/api/alerts/<alert_id> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{ "title": "Updated Title", "message": "Updated message." }'
```

**Success Response (200):**
```json
{
  "success": true,
  "data": { ... }
}
```

| Status | Meaning            |
|--------|--------------------|
| 200    | Alert updated      |
| 401    | No token provided  |
| 403    | Not an admin       |
| 404    | Alert not found    |

---

#### DELETE /api/alerts/:id
Delete an alert. **Requires admin token.**

**curl:**
```bash
curl -X DELETE http://localhost:5000/api/alerts/<alert_id> \
  -H "Authorization: Bearer <admin_token>"
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {}
}
```

| Status | Meaning           |
|--------|-------------------|
| 200    | Alert deleted     |
| 401    | No token provided |
| 403    | Not an admin      |
| 404    | Alert not found   |

---

### Saved Locations

All saved location endpoints are prefixed with `/api/saved`. **All routes require a Bearer token.**

#### GET /api/saved
Return the current user's saved locations with building details populated.

**Headers:**
```
Authorization: Bearer <token>
```

**curl:**
```bash
curl http://localhost:5000/api/saved \
  -H "Authorization: Bearer <student_token>"
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "...",
      "userId": "...",
      "buildingId": "library",
      "list": "Study",
      "savedAt": "...",
      "updatedAt": "...",
      "building": {
        "_id": "...",
        "id": "library",
        "name": "Langson Library",
        "abbr": "LIB",
        "category": "Study",
        "lat": 33.6472,
        "lng": -117.8398,
        "hours": "Mon–Thu 7:30am–2am, Fri 7:30am–10pm, Sat 10am–10pm, Sun 10am–2am",
        "description": "The main undergraduate and graduate research library at UCI.",
        "departments": [],
        "image": null,
        "createdAt": "...",
        "updatedAt": "..."
      }
    }
    // ... more saved locations
  ]
}
```

| Status | Meaning                  |
|--------|--------------------------|
| 200    | Saved locations returned |
| 401    | Missing or invalid token |

---

#### POST /api/saved
Save a building to a list for the current user.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "buildingId": "ics",
  "list": "Study"
}
```

`list` must be one of: `Study`, `Food`, `Outdoor`, `Other`.

**curl:**
```bash
curl -X POST http://localhost:5000/api/saved \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <student_token>" \
  -d '{
    "buildingId": "ics",
    "list": "Study"
  }'
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "userId": "...",
    "buildingId": "ics",
    "list": "Study",
    "savedAt": "...",
    "updatedAt": "..."
  }
}
```

| Status | Meaning                                 |
|--------|-----------------------------------------|
| 201    | Saved location created                  |
| 400    | Missing buildingId or list              |
| 401    | Missing or invalid token                |
| 404    | Building not found                      |
| 409    | Building already saved to that list     |

---

#### DELETE /api/saved/:id
Remove a saved location. **Only the owner can delete.**

**Headers:**
```
Authorization: Bearer <token>
```

**curl:**
```bash
curl -X DELETE http://localhost:5000/api/saved/<saved_id> \
  -H "Authorization: Bearer <student_token>"
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {}
}
```

| Status | Meaning                          |
|--------|----------------------------------|
| 200    | Saved location deleted           |
| 401    | Missing or invalid token         |
| 403    | Not the owner                    |
| 404    | Saved location not found         |

---

### Health Check

#### GET /api/health

Response: `{ "status": "ok" }`

---

### Seed Data (Development)

Populate the database with demo accounts, buildings, alerts, and saved locations:

```bash
npm run seed
```

This clears the `users`, `buildings`, `alerts`, and `savedlocations` collections and creates:

**Users:**

| Email             | Password   | Role    |
|-------------------|------------|---------|
| admin@uci.edu     | admin123   | admin   |
| student@uci.edu   | password   | student |

**Buildings:** 10 UCI campus buildings (Donald Bren Hall, ARC, Langson Library, Mesa Court Dining, The Anteatery, Social Science Plaza A, Rowland Hall, Student Center, Parking Structure 1, Aldrich Park).

**Alerts:** 3 campus alerts (Shuttle Delay, Parking Structure 4 Nearly Full, Library Hours Extended).

**Saved Locations:** 3 entries for the student user:
- library → Study
- anteatery → Food
- aldrich → Outdoor

## Scripts

| Command          | Description                                    |
|------------------|------------------------------------------------|
| `npm run dev`    | Start server with nodemon hot-reload            |
| `npm start`      | Start server in production mode                |
| `npm run seed`   | Seed database with demo accounts and buildings |
