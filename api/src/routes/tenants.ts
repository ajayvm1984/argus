import { Router } from 'express';
import { db } from '../services/db.js';
import { eq } from 'drizzle-orm';
import { tenants } from '../models/schema.js';

export const tenantRoutes = Router();

// List all tenants
tenantRoutes.get('/', async (req, res, next) => {
  try {
    const all = await db.select().from(tenants);
    res.json({ data: all });
  } catch (error) {
    next(error);
  }
});

// Get tenant by ID
tenantRoutes.get('/:id', async (req, res, next) => {
  try {
    const result = await db.select().from(tenants).where(eq(tenants.id, req.params.id));
    if (result.length === 0) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    res.json({ data: result[0] });
  } catch (error) {
    next(error);
  }
});

// Create tenant
tenantRoutes.post('/', async (req, res, next) => {
  try {
    const { slug, display_name, custom_domain, accent_color, support_email, timezone } = req.body;
    const result = await db.insert(tenants).values({
      slug,
      displayName: display_name,
      customDomain: custom_domain,
      accentColor: accent_color || '#5B8A00',
      supportEmail: support_email,
      timezone: timezone || 'Asia/Dubai'
    }).returning();
    res.status(201).json({ data: result[0] });
  } catch (error) {
    next(error);
  }
});

// Update tenant
tenantRoutes.patch('/:id', async (req, res, next) => {
  try {
    const result = await db.update(tenants)
      .set(req.body)
      .where(eq(tenants.id, req.params.id))
      .returning();
    if (result.length === 0) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    res.json({ data: result[0] });
  } catch (error) {
    next(error);
  }
});

// Delete tenant
tenantRoutes.delete('/:id', async (req, res, next) => {
  try {
    await db.delete(tenants).where(eq(tenants.id, req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
