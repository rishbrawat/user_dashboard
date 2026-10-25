import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const INITIAL_MEMBERS = [
  { id: 'usr_1', name: 'Elena Rostova', email: 'elena@userdashboard.io', role: 'Engineering Lead', status: 'active', joined: '2025-01-12' },
  { id: 'usr_2', name: 'Marcus Chen', email: 'marcus@userdashboard.io', role: 'Product Architect', status: 'active', joined: '2025-02-03' },
  { id: 'usr_3', name: 'Sophia Patel', email: 'sophia@userdashboard.io', role: 'Security Analyst', status: 'pending', joined: '2025-03-18' },
  { id: 'usr_4', name: 'David Kim', email: 'david@userdashboard.io', role: 'Data Operations', status: 'active', joined: '2025-04-02' },
  { id: 'usr_5', name: 'Amara Okafor', email: 'amara@userdashboard.io', role: 'Systems QA', status: 'inactive', joined: '2025-05-10' }
];

const INITIAL_LOGS = [
  { id: 'l1', event: 'SLA verification passed', actor: 'system', delta: 'Nominal', time: '10m ago' },
  { id: 'l2', event: 'Authentication token refreshed', actor: 'alex.morgan', delta: 'OK', time: '35m ago' },
  { id: 'l3', event: 'Database index optimized', actor: 'marcus.chen', delta: 'Fast', time: '2h ago' },
  { id: 'l4', event: 'Role policy evaluated', actor: 'elena.rostova', delta: 'Audited', time: '5h ago' }
];

export default function Dashboard() {
  const { currentUser, logout, theme, toggleTheme } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [members, setMembers] = useState(INITIAL_MEMBERS);

  const toggleStatus = (id) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const next = m.status === 'active' ? 'inactive' : 'active';
          return { ...m, status: next };
        }
        return m;
      })
    );
  };

  const removeMember = (id) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="app-container">
      {/* Slim Top Navigation */}
      <header className="app-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="app-brand">
            <span className="brand-dot" aria-hidden="true" />
            <span>user_dashboard</span>
          </div>

          <nav className="nav-links">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('members')}
              className={`nav-tab ${activeTab === 'members' ? 'active' : ''}`}
            >
              Members ({members.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('logs')}
              className={`nav-tab ${activeTab === 'logs' ? 'active' : ''}`}
            >
              Logs
            </button>
          </nav>
        </div>

        <div className="nav-user">
          <button
            type="button"
            onClick={toggleTheme}
            className="theme-toggle-btn"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <span>{theme === 'dark' ? '○ Light' : '● Dark'}</span>
          </button>
          <span className="user-email-text">{currentUser?.email || 'alex.morgan@example.com'}</span>
          <button
            type="button"
            onClick={logout}
            className="btn btn-danger"
            style={{ height: '26px', padding: '0 8px', fontSize: '11px' }}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="dashboard-body">
        {/* Minimal Header */}
        <div className="dash-header">
          <div>
            <h1 className="dash-heading">
              {activeTab === 'overview' && 'System Overview'}
              {activeTab === 'members' && 'Member Directory'}
              {activeTab === 'logs' && 'Audit Log'}
            </h1>
          </div>
          <span className="dash-meta tabular-nums">
            Session: {currentUser?.name || 'User'} • Active
          </span>
        </div>

        {/* 4 Compact Metric Cards with Red, Green, Gold Accents */}
        <section className="metrics-row" aria-label="Key performance indicators">
          <div className="metric-card">
            <div className="metric-label">Gross Revenue</div>
            <div className="metric-val tabular-nums">$128,430</div>
            <div className="metric-delta delta-green">
              <span>↑</span>
              <span className="tabular-nums">+12.5%</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Active Members</div>
            <div className="metric-val tabular-nums">3,420</div>
            <div className="metric-delta delta-green">
              <span>↑</span>
              <span className="tabular-nums">+8.4%</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-label">SLA Uptime</div>
            <div className="metric-val tabular-nums">99.98%</div>
            <div className="metric-delta delta-gold">
              <span>●</span>
              <span>Nominal</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Failure Rate</div>
            <div className="metric-val tabular-nums">0.02%</div>
            <div className="metric-delta delta-red">
              <span>↓</span>
              <span className="tabular-nums">-0.01%</span>
            </div>
          </div>
        </section>

        {/* Member Directory Panel */}
        {(activeTab === 'overview' || activeTab === 'members') && (
          <section className="section-panel">
            <div className="panel-header">
              <span className="panel-title">Member Records</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {members.length} Total Registered
              </span>
            </div>

            <table className="mini-table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Role</th>
                  <th scope="col">Status</th>
                  <th scope="col">Joined</th>
                  <th scope="col" style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.id}>
                    <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                      <div>{m.name}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{m.email}</div>
                    </td>
                    <td>{m.role}</td>
                    <td>
                      <span className={`status-pill status-${m.status}`}>
                        {m.status === 'active' && 'Active'}
                        {m.status === 'pending' && 'Pending'}
                        {m.status === 'inactive' && 'Inactive'}
                      </span>
                    </td>
                    <td className="tabular-nums">{m.joined}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => toggleStatus(m.id)}
                        className="btn btn-outline"
                        style={{ height: '24px', padding: '0 6px', fontSize: '10px', marginRight: '6px' }}
                      >
                        {m.status === 'active' ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeMember(m.id)}
                        className="btn btn-danger"
                        style={{ height: '24px', padding: '0 6px', fontSize: '10px' }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* Audit Log Panel */}
        {(activeTab === 'overview' || activeTab === 'logs') && (
          <section className="section-panel">
            <div className="panel-header">
              <span className="panel-title">System Audit Log</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Realtime Stream</span>
            </div>

            <table className="mini-table">
              <thead>
                <tr>
                  <th scope="col">Event Description</th>
                  <th scope="col">Actor</th>
                  <th scope="col">Status</th>
                  <th scope="col" style={{ textAlign: 'right' }}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {INITIAL_LOGS.map((log) => (
                  <tr key={log.id}>
                    <td style={{ color: 'var(--text-primary)' }}>{log.event}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{log.actor}</td>
                    <td>
                      <span style={{ fontSize: '11px', color: 'var(--accent-gold)' }}>
                        {log.delta}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', color: 'var(--text-muted)' }}>
                      {log.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </main>
    </div>
  );
}
