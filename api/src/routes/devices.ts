import { Router } from 'express';
import { db } from '../services/db.js';
import { eq, and } from 'drizzle-orm';
import { devices } from '../models/schema.js';
import { zabbixService } from '../services/zabbix.js';

export const deviceRoutes = Router();

deviceRoutes.get('/', async (req, res, next) => {
  try {
    const { tenant_id, site_id, device_type } = req.query;
    let query = db.select().from(devices);
    
    // TODO: Add filtering based on query params
    const result = await query;
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
});

deviceRoutes.get('/:id', async (req, res, next) => {
  try {
    const result = await db.select().from(devices).where(eq(devices.id, req.params.id));
    if (result.length === 0) return res.status(404).json({ error: 'Device not found' });
    
    // Get Zabbix data for this device
    const zabbixData = await zabbixService.getHostMetrics(result[0].zabbixHostId);
    
    res.json({ data: { ...result[0], zabbix: zabbixData } });
  } catch (error) {
    next(error);
  }
});

deviceRoutes.post('/', async (req, res, next) => {
  try {
    const { tenant_id, site_id, zabbix_host_id, display_name, device_type, vendor, model, primary_ip, serial_number } = req.body;
    
    const result = await db.insert(devices).values({
      tenantId: tenant_id,
      siteId: site_id,
      zabbixHostId: zabbix_host_id,
      displayName: display_name,
      deviceType: device_type,
      vendor,
      model,
      primaryIp: primary_ip,
      serialNumber: serial_number
    }).returning();
    
    res.status(201).json({ data: result[0] });
  } catch (error) {
    next(error);
  }
});

deviceRoutes.patch('/:id', async (req, res, next) => {
  try {
    const result = await db.update(devices).set(req.body).where(eq(devices.id, req.params.id)).returning();
    if (result.length === 0) return res.status(404).json({ error: 'Device not found' });
    res.json({ data: result[0] });
  } catch (error) {
    next(error);
  }
});

deviceRoutes.delete('/:id', async (req, res, next) => {
  try {
    await db.delete(devices).where(eq(devices.id, req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Get device topology position
deviceRoutes.get('/:id/topology', async (req, res, next) => {
  try {
    const result = await db.select().from(devices).where(eq(devices.id, req.params.id));
    if (result.length === 0) return res.status(404).json({ error: 'Device not found' });
    res.json({ data: { x: result[0].topologyX, y: result[0].topologyY } });
  } catch (error) {
    next(error);
  }
});

// Update device topology position
deviceRoutes.patch('/:id/topology', async (req, res, next) => {
  try {
    const { x, y } = req.body;
    const result = await db.update(devices)
      .set({ topologyX: x, topologyY: y })
      .where(eq(devices.id, req.params.id))
      .returning();
    if (result.length === 0) return res.status(404).json({ error: 'Device not found' });
    res.json({ data: result[0] });
  } catch (error) {
    next(error);
  }
});
