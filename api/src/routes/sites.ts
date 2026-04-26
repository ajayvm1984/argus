import { Router } from 'express';
import { db } from '../services/db.js';
import { eq } from 'drizzle-orm';
import { sites } from '../models/schema.js';

export const siteRoutes = Router();

// List sites (filter by tenant_id)
siteRoutes.get('/', async (req, res, next) => {
  try {
    const { tenant_id } = req.query;
    if (tenant_id) {
      const result = await db.select().from(sites).where(eq(sites.tenantId, tenant_id));
      return res.json({ data: result });
    }
    const result = await db.select().from(sites);
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
});

siteRoutes.get('/:id', async (req, res, next) => {
  try {
    const result = await db.select().from(sites).where(eq(sites.id, req.params.id));
    if (result.length === 0) return res.status(404).json({ error: 'Site not found' });
    res.json({ data: result[0] });
  } catch (error) {
    next(error);
  }
});

siteRoutes.post('/', async (req, res, next) => {
  try {
    const { tenant_id, name, address, latitude, longitude, timezone } = req.body;
    const result = await db.insert(sites).values({
      tenantId: tenant_id,
      name,
      address,
      latitude,
      longitude,
      timezone
    }).returning();
    res.status(201).json({ data: result[0] });
  } catch (error) {
    next(error);
  }
});

siteRoutes.patch('/:id', async (req, res, next) => {
  try {
    const result = await db.update(sites).set(req.body).where(eq(sites.id, req.params.id)).returning();
    if (result.length === 0) return res.status(404).json({ error: 'Site not found' });
    res.json({ data: result[0] });
  } catch (error) {
    next(error);
  }
});

siteRoutes.delete('/:id', async (req, res, next) => {
  try {
    await db.delete(sites).where(eq(sites.id, req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
