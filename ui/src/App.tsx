export function App() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem', background: '#0a0a0a', minHeight: '100vh', color: '#e0e0e0' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 700, color: '#5B8A00', marginBottom: '1rem' }}>
        ⚡ Argus
      </h1>
      <p style={{ fontSize: '1.2rem', color: '#888', marginBottom: '2rem' }}>
        Network Monitoring Platform for MSPs
      </p>
      <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.2rem', color: '#5B8A00', marginBottom: '1rem' }}>System Status</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'left' }}>
          <StatusItem label="API Gateway" status="operational" />
          <StatusItem label="Database" status="operational" />
          <StatusItem label="Zabbix" status="pending" />
          <StatusItem label="ntopng" status="pending" />
          <StatusItem label="Keycloak" status="pending" />
          <StatusItem label="Alert Dispatcher" status="pending" />
        </div>
      </div>
      <p style={{ marginTop: '2rem', color: '#555', fontSize: '0.8rem' }}>
        Meridian Cyber — Proprietary Software
      </p>
    </div>
  );
}

function StatusItem({ label, status }: { label: string; status: 'operational' | 'pending' | 'error' }) {
  const colors = { operational: '#5B8A00', pending: '#f59e0b', error: '#ef4444' };
  return (
    <div style={{ background: '#222', padding: '0.75rem 1rem', borderRadius: '8px' }}>
      <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.25rem' }}>{label}</div>
      <div style={{ fontSize: '0.85rem', color: colors[status], fontWeight: 600, textTransform: 'capitalize' }}>
        ● {status}
      </div>
    </div>
  );
}

export default App;