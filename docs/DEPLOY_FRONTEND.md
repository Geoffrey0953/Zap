# Deploy Frontend to AWS Elastic Beanstalk

This guide walks through deploying the Zap React app (`INF124/`) to its own
Elastic Beanstalk environment. The frontend is a small Express server that serves
the production React build and handles SPA routing.

**Deploy the backend first** — see [DEPLOY_BACKEND.md](./DEPLOY_BACKEND.md).
You need the backend EB URL to bake into the React build.

## Architecture

```
Browser (HTTPS)
     │
     ├─► Frontend EB (zap-frontend.elasticbeanstalk.com)
     │        └─ Express serves React static build
     │
     └─► Backend EB (zap-backend.elasticbeanstalk.com)
              └─ Express API → MongoDB Atlas
```

---

## Prerequisites

- AWS account with IAM permissions for Elastic Beanstalk
- Backend already deployed to Elastic Beanstalk
- Node.js 18+ and npm 9+ installed locally

---

## Step 1 – Build the React App

Set `REACT_APP_API_URL` to your **backend** Elastic Beanstalk URL before building.
Create React App bakes this at build time — you must rebuild if the backend URL changes.

**Windows (Command Prompt):**
```cmd
cd INF124
set REACT_APP_API_URL=https://your-backend-env.elasticbeanstalk.com/api
npm run build
```

**Windows (PowerShell):**
```powershell
cd INF124
$env:REACT_APP_API_URL="https://your-backend-env.elasticbeanstalk.com/api"
npm run build
```

**macOS / Linux:**
```bash
cd INF124
REACT_APP_API_URL=https://your-backend-env.elasticbeanstalk.com/api npm run build
```

Verify the build succeeded:
```bash
ls INF124/build/index.html
```

---

## Step 2 – Install Production Dependencies

The EB server needs `express` (already listed in `package.json`). Install locally
so `package-lock.json` is up to date:

```bash
cd INF124
npm install
```

---

## Step 3 – Zip the Frontend for Deployment

> **Windows:** Do **NOT** use `Compress-Archive` — use `tar` or the script below.

From the **repository root** (`d:\uci_projects\Zap`):

**Windows (PowerShell):**
```powershell
.\scripts\build-frontend-zip.ps1
```

Or manually:
```powershell
cd INF124
tar -a -c -f ..\frontend.zip server.js Procfile package.json package-lock.json build
```

**macOS / Linux:**
```bash
cd INF124
zip -r ../frontend.zip server.js Procfile package.json package-lock.json build/ \
  -x "node_modules/*" "src/*" "public/*"
```

The zip must contain these files **at the root** of the archive (not nested inside
an `INF124/` folder):

| File / folder        | Purpose                              |
|----------------------|--------------------------------------|
| `server.js`          | Express static file + SPA fallback   |
| `Procfile`           | `web: node server.js`                |
| `package.json`       | Declares `express` dependency        |
| `package-lock.json`  | Locks dependency versions            |
| `build/`             | React production output              |

**NOT included** (EB installs these automatically):
- `node_modules/`
- `src/` (source code — not needed in production)

**Verify the zip structure:**
```bash
# macOS/Linux
unzip -l frontend.zip | head -20
# Should show: server.js, Procfile, package.json, build/index.html, ...
```

---

## Step 4 – Create the Elastic Beanstalk Application

### Option A: AWS Console (recommended)

1. Open [Elastic Beanstalk Console](https://console.aws.amazon.com/elasticbeanstalk).
2. Click **Create Application** → name it `zap-frontend`.
3. Platform: **Node.js 18 running on 64bit Amazon Linux 2023** (or AL2).
4. Application code: **Upload your code** → choose `frontend.zip`.
5. Click **Configure more options**:

   **Software** (Edit):
   - No environment variables are required for the frontend.
   - Under **CloudWatch log streaming**: check **Enable log streaming**.

   **Capacity**:
   - Environment type: **Single instance** (free tier friendly).

   **Load Balancer** (if load-balanced):
   - Health check path: `/health`
   - Healthy threshold: 2, Unhealthy threshold: 5, Interval: 15s.

6. Click **Create environment**. EB will provision EC2, run `npm install`, and
   start the server.

### Option B: EB CLI

```bash
cd INF124
eb init -p "Node.js 18 running on 64bit Amazon Linux 2023" zap-frontend
eb create zap-frontend-prod
```

---

## Step 5 – Verify the Frontend Deployment

After the environment turns green, note your frontend URL:
```
https://zap-frontend-prod.us-west-2.elasticbeanstalk.com
```

Test it:

```bash
# Health check
curl https://your-frontend-env.elasticbeanstalk.com/health
# → { "status": "ok" }

# React app loads
curl -I https://your-frontend-env.elasticbeanstalk.com/
# → HTTP/1.1 200, content-type: text/html

# SPA routing (returns index.html, not 404)
curl -I https://your-frontend-env.elasticbeanstalk.com/buildings
# → HTTP/1.1 200, content-type: text/html
```

Open the URL in a browser — you should see the Zap app.

---

## Step 6 – Update Backend CORS (`CLIENT_URL`)

The backend whitelists the frontend origin for CORS. Update it now that you know
the frontend EB URL.

1. Open the [Elastic Beanstalk Console](https://console.aws.amazon.com/elasticbeanstalk/).
2. Select your **backend** environment (`zap-backend`) → **Configuration** →
   **Software** → **Environment properties**.
3. Set `CLIENT_URL` to your frontend EB URL (**`http://`**, all-lowercase hostname,
   no trailing slash). EB environments often only serve HTTP unless you configured HTTPS:
   ```
   http://your-frontend-env.elasticbeanstalk.com
   ```
4. Click **Apply**. EB restarts the backend (takes 1–2 minutes).

---

## Step 7 – Verify the Full Deployment

Open the frontend in a browser and check DevTools (**F12** → **Console** + **Network**):

- [ ] **Home page loads** — no blank screen or JS errors
- [ ] **Buildings list loads** — `GET /api/buildings` returns 200
- [ ] **Login works** — `POST /api/auth/login` returns 200 with a token
- [ ] **Building detail works** — click a building, data loads
- [ ] **Saved locations work** — log in as `student@uci.edu` / `password`
- [ ] **Admin CRUD works** — log in as `admin@uci.edu` / `admin123`, manage buildings
- [ ] **No CORS errors** — Console is free of CORS policy errors

**If CORS errors appear:**

1. Verify `CLIENT_URL` uses **`http://`** (not `https://` unless HTTPS is enabled) and a
   **lowercase** hostname (browsers send lowercase in the `Origin` header).
2. Hard-refresh the browser (Ctrl+Shift+R).

---

## Redeploying Frontend Updates

Any time you change React code:

1. Rebuild with the backend API URL:
   ```powershell
   cd INF124
   $env:REACT_APP_API_URL="https://your-backend-env.elasticbeanstalk.com/api"
   npm run build
   ```
2. Recreate the zip (Step 3).
3. In EB Console → your **frontend** environment → **Upload and deploy** →
   choose the new `frontend.zip`.

Or with EB CLI:
```bash
eb deploy
```

---

## Troubleshooting

### "502 Bad Gateway" on first request
Check CloudWatch logs on the frontend EB environment. Common causes:
- `build/` folder missing from the zip → run `npm run build` first.
- `node_modules` included in the zip → delete and recreate without it.
- Zip has files nested inside an `INF124/` folder instead of at the root.

### Blank page / JS errors in browser
- Confirm you set `REACT_APP_API_URL` **before** `npm run build`.
- Open DevTools → Network → check that JS/CSS files under `/static/` return 200.

### API calls fail / CORS errors
- Update `CLIENT_URL` on the **backend** EB to match the frontend EB URL exactly.
- Confirm `REACT_APP_API_URL` ends with `/api` (e.g.
  `https://zap-backend.elasticbeanstalk.com/api`).

### SPA routes 404 on refresh
- The catch-all route in `server.js` should serve `index.html` for all non-file
  paths. Verify `server.js` is at the root of the zip.

---

## Clean Up

To avoid charges, terminate the frontend EB environment:

```bash
eb terminate zap-frontend-prod
```

Or delete the environment in the EB Console.
