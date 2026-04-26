import { Router } from 'express';
import { db } from '../services/db.js';
import { eq } from 'drizzle-orm';
import { alertRules, alertDeliveries } from '../models/schema.js';

export const alertRoutes = Router();

alertRoutes.get('/rules', async (req, res, next) => {
  try {
    const { tenant_id } = req.query;
    const result = tenant_id 
      ? await db.select().from(alertRules).where(eq(alertRules.tenantId, tenant_id))
      : await db.select().from(alertRules);
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
});

alertRoutes.post('/rules', async (req, res, next) => {
  try {
    const { tenant_id, name, zabbix_trigger_id, min_severity, channels, recipients, quiet_hours_start, quiet_hours_end, enabled } = req.body;
    const result = await db.insert(alertRules).values({
      tenantId: tenant_id,
      name,
      zabbixTriggerId: zabbix_trigger_id,
      minSeverity: min_severity,
      channels,
      recipients,
      quietHoursStart: quiet_hours_start,
      quietHoursEnd: quiet_hours_end,
      enabled: enabled !== false
    }).returning();
    res.status(201).json({ data: result[0] });
  } catch (error) {
    next(error);
  }
});

alertRoutes.patch('/rules/:id', async (req, res, next) => {
  try {
    const result = await db.update(alertRules).set(req.body).where(eq(alertRules.id, req.params.id)).returning();
    if (result.length === 0) return res.status(404).json({ error: 'Alert rule not found' });
    res.json({ data: result[0] });
  } catch (error) {
    next(error);
  }
});

alertRoutes.delete('/rules/:id', async (req, res, next) => {
  try {
    await db.delete(alertRules).where(eq(alertRules.id, req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Alert deliveries (history)
alertRoutes.get('/deliveries', async (req, res, next) => {
  try {
    const { tenant_id, status, limit = 100 } = req.query;
    let query = db.select().from(alertDeliveries);
    // TODO: Add proper filtering
    const result = await query.limit(Number(limit));
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
});

// Acknowledge alert
alertRoutes.post('/deliveries/:id/acknowledge', async (req, res, next) => {
  try {
    const result = await db.update(alertDeliveries)
      .set({ status: 'acknowledged', acknowledgedAt: new Date() })
      .where(eq(alertDeliveries.id, req.params.id))
      .returning();
    if (result.length === 0) return res.status(404).json({ error: 'Alert delivery not found' });
    res.json({ data: result[0] });
  } catch (error) {
    next(error);
  }
});
