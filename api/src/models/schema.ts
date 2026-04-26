import { pgTable, uuid, varchar, text, boolean, integer, bigint, timestamp, jsonb, numeric } from 'drizzle-orm/pg-core';

export const tenants = pgTable('tenants', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 64 }).notNull().unique(),
  displayName: varchar('display_name', { length: 128 }).notNull(),
  customDomain: varchar('custom_domain', { length: 255 }).unique(),
  accentColor: varchar('accent_color', { length: 7 }).default('#5B8A00'),
  logoUrl: varchar('logo_url', { length: 512 }),
  supportEmail: varchar('support_email', { length: 255 }).notNull(),
  timezone: varchar('timezone', { length: 64 }).default('Asia/Dubai'),
  status: varchar('status', { length: 16 }).default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
});

export const sites = pgTable('sites', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 128 }).notNull(),
  address: varchar('address', { length: 255 }),
  latitude: numeric('latitude', { precision: 10, scale: 7 }),
  longitude: numeric('longitude', { precision: 10, scale: 7 }),
  timezone: varchar('timezone', { length: 64 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
});

export const devices = pgTable('devices', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }),
  siteId: uuid('site_id').references(() => sites.id, { onDelete: 'set null' }),
  zabbixHostId: bigint('zabbix_host_id', { mode: 'number' }).notNull().unique(),
  displayName: varchar('display_name', { length: 128 }).notNull(),
  deviceType: varchar('device_type', { length: 32 }).notNull(),
  vendor: varchar('vendor', { length: 64 }),
  model: varchar('model', { length: 128 }),
  primaryIp: varchar('primary_ip', { length: 45 }).notNull(),
  serialNumber: varchar('serial_number', { length: 128 }),
  topologyX: integer('topology_x'),
  topologyY: integer('topology_y'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
});

export const alertRules = pgTable('alert_rules', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 128 }).notNull(),
  zabbixTriggerId: bigint('zabbix_trigger_id', { mode: 'number' }),
  minSeverity: integer('min_severity').notNull(),
  channels: text('channels').array().notNull(),
  recipients: jsonb('recipients').notNull(),
  quietHoursStart: varchar('quiet_hours_start', { length: 8 }),
  quietHoursEnd: varchar('quiet_hours_end', { length: 8 }),
  enabled: boolean('enabled').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
});

export const alertDeliveries = pgTable('alert_deliveries', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }),
  alertRuleId: uuid('alert_rule_id').references(() => alertRules.id),
  zabbixEventId: bigint('zabbix_event_id', { mode: 'number' }).notNull(),
  zabbixTriggerId: bigint('zabbix_trigger_id', { mode: 'number' }).notNull(),
  severity: integer('severity').notNull(),
  channel: varchar('channel', { length: 16 }).notNull(),
  recipient: varchar('recipient', { length: 255 }).notNull(),
  status: varchar('status', { length: 16 }).notNull(),
  twilioMessageSid: varchar('twilio_message_sid', { length: 64 }),
  errorMessage: text('error_message'),
  dispatchedAt: timestamp('dispatched_at', { withTimezone: true }),
  deliveredAt: timestamp('delivered_at', { withTimezone: true }),
  acknowledgedAt: timestamp('acknowledged_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

export const licenseState = pgTable('license_state', {
  id: integer('id').primaryKey(),
  licenseKey: varchar('license_key', { length: 64 }).notNull(),
  accountId: varchar('account_id', { length: 64 }).notNull(),
  productToken: varchar('product_token', { length: 64 }).notNull(),
  machineId: varchar('machine_id', { length: 255 }),
  lastHeartbeat: timestamp('last_heartbeat', { withTimezone: true }),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  graceExpiresAt: timestamp('grace_expires_at', { withTimezone: true }),
  status: varchar('status', { length: 16 }).default('active')
});
