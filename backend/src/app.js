const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth');
const buildingRoutes = require('./routes/buildings');
const alertRoutes = require('./routes/alerts');
const savedRoutes = require('./routes/saved');

const app = express();

// CORS — allow requests from the React frontend (hostname match is case-insensitive;
// reflect the request Origin so ACAO matches what the browser sent exactly).
function corsOrigin() {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  let allowed;
  try {
    allowed = new URL(clientUrl);
  } catch {
    allowed = new URL('http://localhost:3000');
  }

  return (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }
    try {
      const request = new URL(origin);
      const defaultPort = (protocol) => (protocol === 'https:' ? '443' : '80');
      const allowedPort = allowed.port || defaultPort(allowed.protocol);
      const requestPort = request.port || defaultPort(request.protocol);
      const hostMatch =
        request.hostname.toLowerCase() === allowed.hostname.toLowerCase();
      const portMatch = requestPort === allowedPort;
      const protocolMatch = request.protocol === allowed.protocol;

      if (hostMatch && portMatch && protocolMatch) {
        return callback(null, origin);
      }
    } catch {
      // fall through
    }
    callback(new Error(`CORS blocked origin: ${origin}`));
  };
}

app.use(
  cors({
    origin: corsOrigin(),
    credentials: true,
  })
);

// Body parser
app.use(express.json());

// Request logging
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/buildings', buildingRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/saved', savedRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;