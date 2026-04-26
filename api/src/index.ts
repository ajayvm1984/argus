import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { tenantRoutes } from './routes/tenants.js';
import { deviceRoutes } from './routes/devices.js';
import { siteRoutes } from './routes/sites.js';
import { alertRoutes } from './routes/alerts.js';
import { reportRoutes } from './routes/reports.js';
import { healthRoutes } from './routes/health.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authMiddleware } from './middleware/auth.js';

const app = express();
const PORT = process.env.PORT || 8080;

// Configuration
const ZABBIX_URL = process.env.ZABBIX_URL || 'http://zabbix-server:80';
const NTOPNG_URL = process.env.NTOPNG_URL || 'http://ntopng:3000';
const NTOPNG_PASSWORD = process.env.NTOPNG_PASSWORD || 'admin';

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check (no auth)
app.use('/health', healthRoutes);

// Auth middleware for all /api routes
app.use('/api', authMiddleware);

// API routes
app.use('/api/tenants', tenantRoutes);
app.use('/api/sites', siteRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/reports', reportRoutes);

// Zabbix JSON-RPC proxy
app.post('/api/zabbix/api_jsonrpc.php', async (req, res, next) => {
  try {
    const response = await fetch(`${ZABBIX_URL}/api_jsonrpc.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// ntopng proxy - skip for now, add later when ntopng API is stable
// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Argus API Gateway running on port ${PORT}`);
});

export default app;