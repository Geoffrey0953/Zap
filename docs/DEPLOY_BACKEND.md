# Deploy Backend to AWS Elastic Beanstalk

This guide walks through deploying the Zap Express API to AWS Elastic Beanstalk
(Node.js 18 on Amazon Linux 2) with MongoDB Atlas and CloudWatch logging.

**After the backend is live**, deploy the React frontend to its own EB environment:
see [DEPLOY_FRONTEND.md](./DEPLOY_FRONTEND.md).

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
- MongoDB Atlas cluster (free tier M0 is fine)
- Node.js 18+ and npm 9+ installed locally
- [EB CLI](https://github.com/aws/aws-elastic-beanstalk-cli-setup) installed
  (optional—you can also zip and upload via the AWS Console)

---

## Step 1 – Configure MongoDB Atlas

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → your cluster → **Network Access**.
2. For a class project, add IP `0.0.0.0/0` (allow from anywhere).  
   *In production you would restrict to EB's outbound IPs, but that's not practical
   for EB since outbound IPs rotate.*
3. Go to **Database Access** → verify you have a user with password.  
   Your connection string will look like:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/zap?retryWrites=true&w=majority
   ```

---

## Step 2 – Prepare Environment Variables

You will set these in the EB console. Keep them secret—never commit `.env`.

| Variable     | Value                                                       |
|--------------|-------------------------------------------------------------|
| `MONGODB_URI`| Your MongoDB Atlas connection string (step 1)               |
| `JWT_SECRET` | A long random string, e.g. output of `openssl rand -hex 32` |
| `CLIENT_URL` | Frontend EB URL (set after frontend deploy) or `http://localhost:3000` for now |

`CLIENT_URL` is used for CORS — it must match the URL where users open the React
app. You will update this to your frontend EB URL after deploying the frontend
(see [DEPLOY_FRONTEND.md](./DEPLOY_FRONTEND.md) Step 6).

---

## Step 3 – Zip the Backend for Deployment

> **Windows users:** Do **NOT** use `Compress-Archive`. It creates backslash paths
> and EB will fail with: *"appears to use backslashes as path separators"*.

From the **repository root** (`d:\uci_projects\Zap`):

**Windows (PowerShell) — use `tar`:**
```powershell
.\scripts\build-backend-zip.ps1
```

Or manually:
```powershell
cd backend
tar -a -c -f ..\backend.zip package.json package-lock.json Procfile src .platform
```

**macOS / Linux:**
```bash
cd backend
zip -r ../backend.zip . -x "node_modules/*" ".env" ".env.example" "../*.zip"
```

The zip must contain `package.json`, `Procfile`, `src/`, and `.platform/` **at the root**
of the archive. (Do NOT nest them inside a folder—EB expects the app root.)

Verify paths use forward slashes (`src/app.js`, not `src\app.js`):
```powershell
tar -tf backend.zip | Select-Object -First 10
```

**What's in the zip:**
- `package.json` + `package-lock.json`
- `Procfile` → `web: node src/index.js`
- `src/` — all application code
- `.platform/nginx/conf.d/proxy.conf` — custom nginx settings

**NOT included** (EB installs these from `package.json`):
- `node_modules/`
- `.env` (set via EB console instead)

---

## Step 4 – Create the Elastic Beanstalk Application

### Option A: AWS Console (recommended)

1. Open [Elastic Beanstalk Console](https://console.aws.amazon.com/elasticbeanstalk).
2. Click **Create Application** → name it `zap-backend`.
3. Platform: **Node.js 18 running on 64bit Amazon Linux 2023** (or AL2).
4. Application code: **Upload your code** → choose `backend.zip`.
5. Click **Configure more options**:

   **Updates, monitoring, and logging** (Edit):
   - Scroll to **Runtime environment variables** → add:
     - `MONGODB_URI` = your connection string
     - `JWT_SECRET` = your secret
     - `CLIENT_URL` = `http://localhost:3000` *(update after frontend deploy)*
   - Under **CloudWatch log streaming**: check **Enable log streaming**.

   **Capacity** (Edit):
   - Environment type: **Single instance** (free tier friendly).

   **Instance traffic and scaling** (Edit, if load-balanced):
   - Health check path: `/api/health`

   **Networking and database** (Edit):
   - For a class project, leave **VPC** at the default (don't pick a custom VPC
     unless you know it has internet access). A misconfigured VPC is the #1 cause
     of "None of the instances are sending data."

6. Click **Create environment**. EB will provision EC2, install dependencies
   (`npm install`), and start the app.

### Option B: EB CLI

```bash
# One-time: choose region
eb init

# Create + deploy in one step
eb create zap-backend-prod \
  --platform "Node.js 18 running on 64bit Amazon Linux 2023" \
  --envvars MONGODB_URI=...,JWT_SECRET=...,CLIENT_URL=http://localhost:3000

# Or deploy an update:
eb deploy
```

---

## Step 5 – Set Environment Variables (if not done above)

1. EB Console → **Zap-backend-env**
2. Left sidebar → **Configuration**
3. Scroll down → **Updates, monitoring, and logging** → **Edit**
4. Expand **Platform software** (click the arrow on the right)
5. Scroll to **Environment properties** (or **Runtime environment variables**)
6. Add each row:

| Name          | Value                                       |
|---------------|---------------------------------------------|
| `MONGODB_URI` | `mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/zap?retryWrites=true&w=majority` |
| `JWT_SECRET`  | `<32+ char random string>`                  |
| `CLIENT_URL`  | `http://localhost:3000` *(update after frontend deploy)* |

7. Click **Apply** at the bottom of the page (not just Continue).

### Redeploy updated code

Go back to the environment dashboard → **Upload and deploy** → choose `backend.zip` → **Deploy**.

> Build the zip with `.\scripts\build-backend-zip.ps1` — never `Compress-Archive`.

---

## Step 6 – Verify the Deployment

After the environment turns green, note your backend URL:
```
https://zap-backend-prod.us-west-2.elasticbeanstalk.com
```

Test it:

```bash
# Health check
curl https://your-backend-env.elasticbeanstalk.com/api/health
# → { "status": "ok" }

# Get buildings (public)
curl https://your-backend-env.elasticbeanstalk.com/api/buildings
# → { "success": true, "count": ..., "data": [...] }
```

---

## Step 7 – Seed the Database

Once the backend is live, seed demo data by calling your deployed API:

```bash
# Register the admin demo account
curl -X POST https://your-backend-env.elasticbeanstalk.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Admin","lastName":"User","email":"admin@uci.edu","password":"admin123"}'

# Login to get a token
curl -X POST https://your-backend-env.elasticbeanstalk.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@uci.edu","password":"admin123"}'
```

Then use the token from the login response and the `POST /api/buildings`,
`POST /api/alerts` endpoints to populate data. Alternatively, temporarily set
`MONGODB_URI` to point to the same Atlas cluster from your local machine, run
`npm run seed` locally, and revert.

---

## Step 8 – CloudWatch Logs

1. EB Console → your environment → **Logs** → **Request logs** (last 100 lines
   or full bundle).
2. Or go to CloudWatch → **Log groups** → `/aws/elasticbeanstalk/<env-name>/var/log/web.stdout.log`.
3. Log stream is already enabled from Step 4.

You'll see Express `morgan` request logs and any `console.log` / `console.error`
output from your application.

---

## Step 9 – Deploy the Frontend

Now deploy the React app to its own EB environment:

1. Build the frontend with `REACT_APP_API_URL` set to your backend URL (see
   [DEPLOY_FRONTEND.md](./DEPLOY_FRONTEND.md) Step 1).
2. Zip and upload to a new EB application named `zap-frontend`.
3. Update `CLIENT_URL` on this backend environment to the frontend EB URL
   ([DEPLOY_FRONTEND.md](./DEPLOY_FRONTEND.md) Step 6).

Your submission URLs:
- **Deployed website** → frontend EB URL
- **API** → backend EB URL

---

## Troubleshooting

### "None of the instances are sending data" (Health: Warning/Severe)

This means EB can't talk to your EC2 instance — the app may never have started.

**Do these in order:**

1. **Events tab** (left sidebar) — read the latest red/yellow events. Look for
   `Command failed`, `npm ERR`, `Instance deployment failed`, or VPC errors.

2. **Logs** (left sidebar) → **Request logs** → **Last 100 Lines** (or Full Log).
   Look for:
   - `MongoDB connection error` → fix `MONGODB_URI` in Runtime environment variables
   - `Error: Cannot find module` → bad zip; redeploy without `node_modules`
   - `npm ERR` → dependency install failed

3. **Health tab** (left sidebar) → click the instance ID → read **Health issues**
   for the specific cause.

4. **Custom VPC** — if you picked a VPC during setup (your env uses
   `vpc-04b99b853ca92d153`), the subnets may have no internet access. Easiest fix:
   **Terminate** this environment and create a new one, leaving VPC at **default**
   during setup.

5. **Redeploy clean zip** — Windows must use `tar`, NOT `Compress-Archive`:
   ```powershell
   .\scripts\build-backend-zip.ps1
   ```
   Then **Upload and deploy** on the environment dashboard.

6. **Set env vars** — Configuration → **Updates, monitoring, and logging** → Edit
   → expand **Platform software** → **Environment properties**.

### "backslashes as path separators" (deployment fails immediately)

PowerShell's `Compress-Archive` creates Windows-style paths. EB runs Linux and
rejects the zip. Fix:

```powershell
.\scripts\build-backend-zip.ps1
```

Then **Upload and deploy** again.

### "502 Bad Gateway" on first request
Check CloudWatch logs → usually means `npm install` failed or the app crashed.
Common causes:
- Missing `MONGODB_URI` env var → EB won't connect to DB.
- `node_modules` included in the zip → conflicts with EB's install.
- Port mismatch → EB proxies port 80 → `process.env.PORT`. Ensure `index.js`
  uses `process.env.PORT || 5000`.

### Health check failing
- Confirm `/api/health` returns 200. Check EB health check path is set to
  `/api/health`.
- If MongoDB isn't connected, the health endpoint still returns 200 (it's a
  static route). But the DB-dependent routes will fail.

### MongoDB connection timeout
- Verify Atlas network access allows `0.0.0.0/0`.
- Verify the connection string uses `mongodb+srv://` (not `mongodb://` with
  wrong port).

### CORS errors from frontend
- Ensure `CLIENT_URL` in EB env vars matches the **frontend** EB URL (including
  `https://`, no trailing slash).
- Deploy the frontend first, then update `CLIENT_URL` on the backend.

---

## Clean Up

To avoid charges:
```bash
eb terminate zap-backend-prod
eb terminate zap-frontend-prod
```
Or delete the environments in the EB Console.
