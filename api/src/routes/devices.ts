import { Router } from 'express';
import { db } from '../services/db.js';
import { eq } from 'drizzle-orm';
import { devices } from '../models/schema.js';

export const deviceRoutes = Router();

// List devices
deviceRoutes.get('/', async (req, res, next) => {
  try {
    const tenantId = req.query.tenant_id as string | undefined;
    const siteId = req.query.site_id as string | undefined;
    if (tenantId) {
      const result = await db.select().from(devices).where(eq(devices.tenantId, tenantId));
      return res.json({ data: result });
    }
    if (siteId) {
      const result = await db.select().from(devices).where(eq(devices.siteId, siteId));
      return res.json({ data: result });
    }
    const result = await db.select().from(devices).limit(100);
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
});

// Get single device
deviceRoutes.get('/:id', async (req, res, next) => {
  try {
    const result = await db.select().from(devices).where(eq(devices.id, req.params.id));
    if (result.length === 0) return res.status(404).json({ error: 'Device not found' });
    res.json({ data: result[0] });
  } catch (error) {
    next(error);
  }
});

// Create device
deviceRoutes.post('/', async (req, res, next) => {
  try {
    const result = await db.insert(devices).values(req.body).returning();
    res.status(201).json({ data: result[0] });
  } catch (error) {
    next(error);
  }
});

// Update device
deviceRoutes.patch('/:id', async (req, res, next) => {
  try {
    const result = await db.update(devices).set(req.body).where(eq(devices.id, req.params.id)).returning();
    if (result.length === 0) return res.status(404).json({ error: 'Device not found' });
    res.json({ data: result[0] });
  } catch (error) {
    next(error);
  }
});

// Delete device
deviceRoutes.delete('/:id', async (req, res, next) => {
  try {
    await db.delete(devices).where(eq(devices.id, req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Get device by Zabbix host ID
deviceRoutes.get('/zabbix/:hostId', async (req, res, next) => {
  try {
    const result = await db.select().from(devices).where(eq(devices.zabbixHostId, Number(req.params.hostId)));
    if (result.length === 0) return res.status(404).json({ error: 'Device not found' });
    res.json({ data: result[0] });
  } catch (error) {
    next(error);
  }
});