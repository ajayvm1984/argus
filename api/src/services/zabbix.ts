const ZABBIX_URL = process.env.ZABBIX_URL || 'http://zabbix:80';
const ZABBIX_USER = process.env.ZABBIX_USER || 'Admin';
const ZABBIX_PASSWORD = process.env.ZABBIX_PASSWORD || 'zabbix';

interface ZabbixAuth {
  jsonrpc: '2.0';
  method: string;
  params: any;
  id: number;
}

interface ZabbixResponse<T = any> {
  jsonrpc: '2.0';
  result: T;
  id: number;
}

class ZabbixService {
  private authToken: string | null = null;

  async authenticate(): Promise<string> {
    const body: ZabbixAuth = {
      jsonrpc: '2.0',
      method: 'user.login',
      params: { user: ZABBIX_USER, password: ZABBIX_PASSWORD },
      id: 1
    };

    const response = await fetch(`${ZABBIX_URL}/api_jsonrpc.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data: ZabbixResponse<string> = await response.json();
    this.authToken = data.result;
    return data.result;
  }

  async call<T = any>(method: string, params: any): Promise<T> {
    if (!this.authToken) {
      await this.authenticate();
    }

    const body: ZabbixAuth = {
      jsonrpc: '2.0',
      method,
      params,
      id: 1
    };

    const response = await fetch(`${ZABBIX_URL}/api_jsonrpc.php`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authToken}`
      },
      body: JSON.stringify(body)
    });

    const data: ZabbixResponse<T> = await response.json();
    return data.result;
  }

  async getHostMetrics(hostId: number) {
    return {
      hostId,
      status: await this.call('host.get', { hostids: hostId }),
      items: await this.call('item.get', { hostids: hostId }),
      triggers: await this.call('trigger.get', { hostids: hostId })
    };
  }

  async getActiveTriggers(severity: number[] = [1, 2, 3, 4, 5]) {
    return this.call('trigger.get', {
      filters: { value: 1 },
      severity,
      output: 'extend',
      selectItems: ['name', 'key_'],
      selectHosts: ['hostid', 'name', 'ip']
    });
  }

  async getHosts() {
    return this.call('host.get', {
      output: ['hostid', 'name', 'status', 'ip'],
      selectInterfaces: ['ip', 'type']
    });
  }
}

export const zabbixService = new ZabbixService();
