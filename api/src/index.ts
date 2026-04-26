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

// Zabbix proxy routes
app.use('/api/zabbix', zabbixProxyRoutes);

// ntopng proxy routes
app.use('/api/ntopng', ntopngProxyRoutes);

// Error handler
app.use(errorHandler);

// Zabbix proxy middleware
import { Router } from 'express';
const zabbixProxyRoutes = Router();
const NTOPNG_TIMEOUT = 30000;
const zabbixConfig = {
  baseUrl: process.env.ZABBIX_URL || 'http://zabbix:80',
  user: process.env.ZABBIX_USER || 'Admin',
  password: process.env.ZABBIX_PASSWORD || 'zabbix'
};

// ntopng proxy middleware
const ntopngProxyRoutes = Router();
const ntopngConfig = {
  baseUrl: process.env.NTOPNG_URL || 'http://ntopng:3000',
  password: process.env.NTOPNG_PASSWORD || 'admin'
};

// ─────────────────────────────────────────────────────────────
// Zabbix Routes
// ─────────────────────────────────────────────────────────────
zabbixProxyRoutes.post('/api_jsonrpc.php', async (req, res, next) => {
  try {
    const response = await fetch(`${zabbixConfig.baseUrl}/api_jsonrpc.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
      signal: AbortSignal.timeout(NTOPNG_TIMEOUT)
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// ─────────────────────────────────────────────────────────────
// ntopng Routes
// ─────────────────────────────────────────────────────────────
ntopngProxyRoutes.get('/api/lua/*.lua', async (req, res, next) => {
  try {
    const path = req.params[0];
    const queryString = new URLSearchParams(req.query).toString();
    const url = `${ntopngConfig.baseUrl}/ntopng/${path}.lua${queryString ? '?' + queryString : ''}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`admin:${ntopngConfig.password}`).toString('base64')
      },
      signal: AbortSignal.timeout(NTOPNG_TIMEOUT)
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

app.listen(PORT, () => {
  console.log(`Argus API Gateway running on port ${PORT}`);
});

export default app;
