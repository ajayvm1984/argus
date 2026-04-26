import { Router } from 'express';
import { db } from '../services/db.js';
import { alertDeliveries } from '../models/schema.js';

export const reportRoutes = Router();

reportRoutes.get('/availability', async (req, res, next) => {
  try {
    const { tenant_id, period = '7d' } = req.query;
    // Return device availability report
    // TODO: Implement with real Zabbix data
    res.json({ data: { message: 'Availability report - coming soon', period } });
  } catch (error) {
    next(error);
  }
});

reportRoutes.get('/alerts-summary', async (req, res, next) => {
  try {
    const { tenant_id, from, to } = req.query;
    // Return alert summary by severity
    const deliveries = await db.select().from(alertDeliveries).limit(1000);
    const summary = {
      total: deliveries.length,
      by_severity: {},
      by_channel: {},
      delivered: deliveries.filter(d => d.status === 'delivered').length,
      failed: deliveries.filter(d => d.status === 'failed').length
    };
    res.json({ data: summary });
  } catch (error) {
    next(error);
  }
});

reportRoutes.get('/network-traffic', async (req, res, next) => {
  try {
    const { tenant_id, site_id, period = '24h' } = req.query;
    // Return network traffic summary from ntopng
    // TODO: Integrate with ntopng API
    res.json({ data: { message: 'Network traffic report - coming soon', period } });
  } catch (error) {
    next(error);
  }
});
