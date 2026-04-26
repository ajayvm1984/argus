import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST || 'argus-db',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'argus',
  user: process.env.DB_USER || 'argus',
  password: process.env.DB_PASSWORD
});

const ZABBIX_URL = process.env.ZABBIX_URL || 'http://zabbix:80';

async function pollAlerts() {
  try {
    // Poll Zabbix for new triggers
    const response = await fetch(`${ZABBIX_URL}/api_jsonrpc.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'trigger.get',
        params: {
          filters: { value: 1 },
          output: 'extend',
          selectHosts: ['hostid', 'name', 'ip']
        },
        id: 1
      })
    });

    const data = await response.json();
    const triggers = data.result || [];

    console.log(`[${new Date().toISOString()}] Polled ${triggers.length} active triggers`);

    // TODO: Compare with previous state, dispatch new alerts via Twilio
    for (const trigger of triggers) {
      await processTrigger(trigger);
    }

  } catch (error) {
    console.error('Error polling alerts:', error.message);
  }
}

async function processTrigger(trigger) {
  // TODO: Look up alert rules, dispatch notifications
  console.log(`Processing trigger: ${trigger.description}`);
}

async function start() {
  console.log('Argus Alert Dispatcher started');
  
  // Poll every 10 seconds
  setInterval(pollAlerts, 10000);
  
  // Initial poll
  await pollAlerts();
}

start().catch(console.error);
