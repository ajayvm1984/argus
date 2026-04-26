import { Router } from 'express';
import { db } from '../services/db.js';
import { eq, and } from 'drizzle-orm';
import { alertRules, alertDeliveries } from '../models/schema.js';

export const alertRoutes = Router();

// List alert rules (filter by tenant_id)
alertRoutes.get('/rules', async (req, res, next) => {
  try {
    const tenantId = req.query.tenant_id as string | undefined;
    if (tenantId) {
      const result = await db.select().from(alertRules).where(eq(alertRules.tenantId, tenantId));
      return res.json({ data: result });
    }
    const result = await db.select().from(alertRules);
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
});

// Get deliveries by alert_rule_id
alertRoutes.get('/deliveries', async (req, res, next) => {
  try {
    const ruleId = req.query.alert_rule_id as string | undefined;
    if (ruleId) {
      const result = await db.select().from(alertDeliveries).where(eq(alertDeliveries.alertRuleId, ruleId));
      return res.json({ data: result });
    }
    const result = await db.select().from(alertDeliveries).limit(100);
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
});

// Create alert rule
alertRoutes.post('/rules', async (req, res, next) => {
  try {
    const { tenant_id, name, zabbix_trigger_id, min_severity, channels, recipients, quiet_hours_start, quiet_hours_end, enabled } = req.body;
    const result = await db.insert(alertRules).values({
      tenantId: tenant_id,
      name,
      zabbixTriggerId: zabbix_trigger_id ?? null,
      minSeverity: min_severity,
      channels,
      recipients,
      quietHoursStart: quiet_hours_start ?? null,
      quietHoursEnd: quiet_hours_end ?? null,
      enabled: enabled ?? true
    }).returning();
    res.status(201).json({ data: result[0] });
  } catch (error) {
    next(error);
  }
});

// Update alert rule
alertRoutes.patch('/rules/:id', async (req, res, next) => {
  try {
    const result = await db.update(alertRules).set(req.body).where(eq(alertRules.id, req.params.id)).returning();
    if (result.length === 0) return res.status(404).json({ error: 'Alert rule not found' });
    res.json({ data: result[0] });
  } catch (error) {
    next(error);
  }
});

// Delete alert rule
alertRoutes.delete('/rules/:id', async (req, res, next) => {
  try {
    await db.delete(alertRules).where(eq(alertRules.id, req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Mark delivery as acknowledged
alertRoutes.post('/deliveries/:id/ack', async (req, res, next) => {
  try {
    const result = await db.update(alertDeliveries).set({ acknowledgedAt: new Date() }).where(eq(alertDeliveries.id, req.params.id)).returning();
    if (result.length === 0) return res.status(404).json({ error: 'Delivery not found' });
    res.json({ data: result[0] });
  } catch (error) {
    next(error);
  }
});