import { useState, useMemo, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Activity,
  Settings,
  Search,
  Bell,
  Sun,
  Moon,
  LogOut,
  UserPlus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Menu,
  X,
  Download,
  Filter,
  Trash2,
  RefreshCw,
  MoreVertical
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Initial team dataset
const INITIAL_TEAM_MEMBERS = [
  {
    id: 'usr_101',
    name: 'Elena Rostova',
    email: 'elena.rostova@userdashboard.io',
    role: 'Staff Engineer',
    department: 'Core Platform',
    status: 'active',
    joinedDate: 'Jan 12, 2025',
    lastActive: '5 mins ago',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr_102',
    name: 'Marcus Chen',
    email: 'marcus.chen@userdashboard.io',
    role: 'Lead UI/UX Designer',
    department: 'Product Design',
    status: 'active',
    joinedDate: 'Feb 03, 2025',
    lastActive: '12 mins ago',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr_103',
    name: 'Sophia Patel',
    email: 'sophia.patel@userdashboard.io',
    role: 'Security Analyst',
    department: 'Infrastructure',
    status: 'pending',
    joinedDate: 'Mar 18, 2025',
    lastActive: '2 hours ago',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr_104',
    name: 'David Kim',
    email: 'david.kim@userdashboard.io',
    role: 'Growth Strategist',
    department: 'Operations',
    status: 'active',
    joinedDate: 'Apr 02, 2025',
    lastActive: '1 day ago',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr_105',
    name: 'Amara Okafor',
    email: 'amara.okafor@userdashboard.io',
    role: 'Frontend Architect',
    department: 'Web Engineering',
    status: 'inactive',
    joinedDate: 'May 10, 2025',
    lastActive: '4 days ago',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  }
];

const INITIAL_ACTIVITIES = [
  { id: 'act_1', action: 'Deployed production release v2.4.0', time: '10 mins ago', user: 'Elena Rostova', type: 'system' },
  { id: 'act_2', action: 'Generated quarterly revenue analytics export', time: '45 mins ago', user: 'Alex Morgan', type: 'export' },
  { id: 'act_3', action: 'Approved access request for Sophia Patel', time: '2 hours ago', user: 'Alex Morgan', type: 'security' },
  { id: 'act_4', action: 'Updated security authentication policies', time: '5 hours ago', user: 'David Kim', type: 'security' }
];

export default function Dashboard() {
  const { currentUser, logout, theme, toggleTheme, addToast } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [teamMembers, setTeamMembers] = useState(INITIAL_TEAM_MEMBERS);
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);

  // Notifications dropdown
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);

  // Add Member Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Frontend Developer');
  const [newMemberDept, setNewMemberDept] = useState('Engineering');
  const modalInputRef = useRef(null);

  // Focus modal input when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setTimeout(() => modalInputRef.current?.focus(), 50);
    }
  }, [isModalOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return teamMembers.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.department.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [teamMembers, searchQuery, statusFilter]);

  // Action: Toggle Member Status
  const handleToggleStatus = (id) => {
    setTeamMembers((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextStatus = m.status === 'active' ? 'inactive' : 'active';
          addToast(`Updated ${m.name}'s status to ${nextStatus}`, 'info');
          return { ...m, status: nextStatus };
        }
        return m;
      })
    );
  };

  // Action: Delete Member
  const handleDeleteMember = (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name}?`)) {
      setTeamMembers((prev) => prev.filter((m) => m.id !== id));
      addToast(`Removed ${name} from dashboard.`, 'info');
    }
  };

  // Action: Add New Member
  const handleAddMemberSubmit = (e) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberEmail.trim()) {
      addToast('Please fill in both name and email.', 'danger');
      return;
    }

    const newMember = {
      id: `usr_${Date.now()}`,
      name: newMemberName.trim(),
      email: newMemberEmail.trim().toLowerCase(),
      role: newMemberRole,
      department: newMemberDept,
      status: 'active',
      joinedDate: 'Just now',
      lastActive: 'Online',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    };

    setTeamMembers((prev) => [newMember, ...prev]);
    setActivities((prev) => [
      {
        id: `act_${Date.now()}`,
        action: `Added new team member ${newMember.name}`,
        time: 'Just now',
        user: currentUser?.name || 'Admin',
        type: 'user'
      },
      ...prev
    ]);

    addToast(`Successfully added ${newMember.name}!`, 'success');
    setIsModalOpen(false);
    setNewMemberName('');
    setNewMemberEmail('');
  };

  // Action: Export CSV
  const handleExportCSV = () => {
    const headers = 'ID,Name,Email,Role,Department,Status,JoinedDate\n';
    const rows = filteredMembers
      .map((m) => `"${m.id}","${m.name}","${m.email}","${m.role}","${m.department}","${m.status}","${m.joinedDate}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user_dashboard_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Data exported successfully!', 'success');
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`} aria-label="Main Navigation">
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="auth-logo" style={{ width: '36px', height: '36px', marginBottom: 0 }}>
              <LayoutDashboard size={20} />
            </div>
            <span>user_dashboard</span>
            <span className="sidebar-brand-badge">v1.0</span>
          </div>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar navigation"
            style={{ display: sidebarOpen ? 'flex' : 'none' }}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <button
            type="button"
            onClick={() => {
              setActiveTab('overview');
              setSidebarOpen(false);
            }}
            className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
          >
            <LayoutDashboard size={18} aria-hidden="true" />
            <span>Dashboard Overview</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('team');
              setSidebarOpen(false);
            }}
            className={`nav-link ${activeTab === 'team' ? 'active' : ''}`}
          >
            <Users size={18} aria-hidden="true" />
            <span>Team & Users</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('analytics');
              setSidebarOpen(false);
            }}
            className={`nav-link ${activeTab === 'analytics' ? 'active' : ''}`}
          >
            <BarChart3 size={18} aria-hidden="true" />
            <span>Analytics & KPIs</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('activity');
              setSidebarOpen(false);
            }}
            className={`nav-link ${activeTab === 'activity' ? 'active' : ''}`}
          >
            <Activity size={18} aria-hidden="true" />
            <span>Audit Activity</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('settings');
              setSidebarOpen(false);
            }}
            className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
          >
            <Settings size={18} aria-hidden="true" />
            <span>Portal Settings</span>
          </button>
        </nav>

        {/* Sidebar Status Badge */}
        <div style={{ padding: '1rem', margin: '0.85rem', background: 'var(--color-primary-light)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-success)', display: 'inline-block' }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)' }}>System Nominal</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)', margin: 0 }}>
            99.98% SLA Uptime verified
          </p>
        </div>

        {/* User Card in Sidebar */}
        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'}
              alt={currentUser?.name || 'User avatar'}
              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser?.name || 'Administrator'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser?.email || 'admin@example.com'}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="btn-ghost"
            title="Log out"
            aria-label="Log out of user_dashboard"
            style={{ color: 'var(--color-danger)' }}
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="dashboard-main">
        {/* Sticky Header Bar */}
        <header className="dashboard-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar navigation"
              style={{ display: 'flex' }}
            >
              <Menu size={22} />
            </button>

            {/* Quick Header Search */}
            <div className="header-search">
              <Search
                size={16}
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-foreground-subtle)' }}
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search team, roles, or metrics…"
                aria-label="Search dashboard"
              />
            </div>
          </div>

          <div className="header-actions">
            {/* Theme Switcher Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="btn-secondary"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              style={{ borderRadius: 'var(--radius-full)', padding: '0.45rem 0.75rem' }}
            >
              {theme === 'dark' ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
            </button>

            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => {
                  setShowNotifications((prev) => !prev);
                  setUnreadNotifications(0);
                }}
                className="btn-secondary"
                aria-label={`Notifications: ${unreadNotifications} unread`}
                style={{ borderRadius: 'var(--radius-full)', padding: '0.45rem 0.75rem', position: 'relative' }}
              >
                <Bell size={17} aria-hidden="true" />
                {unreadNotifications > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-accent)'
                    }}
                  />
                )}
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div
                  className="glass-panel"
                  style={{
                    position: 'absolute',
                    top: '48px',
                    right: 0,
                    width: '320px',
                    padding: '1rem',
                    zIndex: 50,
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Activity Alerts</span>
                    <button
                      type="button"
                      className="btn-ghost"
                      style={{ fontSize: '0.75rem' }}
                      onClick={() => setShowNotifications(false)}
                    >
                      Close
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <div style={{ fontSize: '0.82rem', padding: '0.5rem', background: 'var(--color-surface-hover)', borderRadius: 'var(--radius-sm)' }}>
                      <strong>Elena Rostova</strong> published v2.4.0 core build.
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-foreground-subtle)' }}>10 mins ago</div>
                    </div>
                    <div style={{ fontSize: '0.82rem', padding: '0.5rem', background: 'var(--color-surface-hover)', borderRadius: 'var(--radius-sm)' }}>
                      <strong>Sophia Patel</strong> requested security review.
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-foreground-subtle)' }}>2 hours ago</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Logout Shortcut */}
            <button
              type="button"
              onClick={logout}
              className="btn-secondary"
              aria-label="Sign out"
              style={{ gap: '0.4rem', color: 'var(--color-danger)' }}
            >
              <LogOut size={16} aria-hidden="true" />
              <span style={{ fontSize: '0.85rem' }}>Logout</span>
            </button>
          </div>
        </header>

        {/* Dashboard Workspace */}
        <main className="dashboard-content">
          {/* Welcome Greeting Banner */}
          <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
                Welcome back, {currentUser?.name || 'Administrator'}
              </h1>
              <p style={{ fontSize: '0.92rem' }}>
                Here is your live analytics overview and team activity for today.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button type="button" onClick={handleExportCSV} className="btn-secondary">
                <Download size={16} aria-hidden="true" />
                <span>Export CSV</span>
              </button>
              <button type="button" onClick={() => setIsModalOpen(true)} className="btn-primary" style={{ width: 'auto' }}>
                <UserPlus size={16} aria-hidden="true" />
                <span>Add Member</span>
              </button>
            </div>
          </section>

          {/* Metric Stats Cards */}
          <section className="stats-grid" aria-label="Key Performance Indicators">
            {/* Card 1 */}
            <article className="stat-card">
              <div className="stat-header">
                <span className="stat-title">Total Revenue</span>
                <div className="stat-icon" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                  <DollarSign size={20} aria-hidden="true" />
                </div>
              </div>
              <div className="stat-value tabular-nums">$128,430</div>
              <div className="stat-trend trend-up">
                <TrendingUp size={16} aria-hidden="true" />
                <span>+12.5% from last month</span>
              </div>
            </article>

            {/* Card 2 */}
            <article className="stat-card">
              <div className="stat-header">
                <span className="stat-title">Active Team Members</span>
                <div className="stat-icon" style={{ background: 'var(--color-success-bg)', color: 'var(--color-success)' }}>
                  <Users size={20} aria-hidden="true" />
                </div>
              </div>
              <div className="stat-value tabular-nums">{teamMembers.length * 48}</div>
              <div className="stat-trend trend-up">
                <TrendingUp size={16} aria-hidden="true" />
                <span>+8.4% monthly active growth</span>
              </div>
            </article>

            {/* Card 3 */}
            <article className="stat-card">
              <div className="stat-header">
                <span className="stat-title">Task Completion Rate</span>
                <div className="stat-icon" style={{ background: 'var(--color-warning-bg)', color: 'var(--color-warning)' }}>
                  <CheckCircle2 size={20} aria-hidden="true" />
                </div>
              </div>
              <div className="stat-value tabular-nums">94.8%</div>
              <div className="stat-trend trend-up">
                <TrendingUp size={16} aria-hidden="true" />
                <span>+2.1% performance gain</span>
              </div>
            </article>

            {/* Card 4 */}
            <article className="stat-card">
              <div className="stat-header">
                <span className="stat-title">Infrastructure Health</span>
                <div className="stat-icon" style={{ background: 'var(--color-info-bg)', color: 'var(--color-info)' }}>
                  <Shield size={20} aria-hidden="true" />
                </div>
              </div>
              <div className="stat-value tabular-nums">99.98%</div>
              <div className="stat-trend trend-up">
                <TrendingUp size={16} aria-hidden="true" />
                <span>Operational & Secure</span>
              </div>
            </article>
          </section>

          {/* Team Members Data Table Card */}
          <section className="content-card">
            <div className="card-header-bar">
              <div>
                <h2 className="card-title">Team Directory & Permissions</h2>
                <p className="card-subtitle">Manage workspace roles, statuses, and account authorizations</p>
              </div>

              {/* Table Filters */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Filter size={15} style={{ color: 'var(--color-foreground-muted)' }} aria-hidden="true" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="input-control"
                    style={{ height: '36px', padding: '0 0.75rem', fontSize: '0.85rem' }}
                    aria-label="Filter members by status"
                  >
                    <option value="all">All Statuses ({teamMembers.length})</option>
                    <option value="active">Active Only</option>
                    <option value="pending">Pending Approval</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th scope="col">Member Name & Email</th>
                    <th scope="col">Role & Department</th>
                    <th scope="col">Status</th>
                    <th scope="col">Joined Date</th>
                    <th scope="col">Last Activity</th>
                    <th scope="col" style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.length > 0 ? (
                    filteredMembers.map((member) => (
                      <tr key={member.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <img
                              src={member.avatar}
                              alt=""
                              aria-hidden="true"
                              style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <div>
                              <div style={{ fontWeight: 700, color: 'var(--color-foreground)' }}>{member.name}</div>
                              <div style={{ fontSize: '0.78rem', color: 'var(--color-foreground-muted)' }}>{member.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{member.role}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--color-foreground-muted)' }}>{member.department}</div>
                        </td>
                        <td>
                          <span className={`badge badge-${member.status}`}>
                            {member.status === 'active' && '● Active'}
                            {member.status === 'pending' && '◌ Pending'}
                            {member.status === 'inactive' && '✕ Inactive'}
                          </span>
                        </td>
                        <td className="tabular-nums">{member.joinedDate}</td>
                        <td style={{ color: 'var(--color-foreground-muted)' }}>{member.lastActive}</td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(member.id)}
                              className="btn-secondary"
                              style={{ height: '32px', padding: '0 0.6rem', fontSize: '0.78rem' }}
                              title="Toggle status"
                              aria-label={`Toggle status for ${member.name}`}
                            >
                              <RefreshCw size={14} aria-hidden="true" />
                              <span>{member.status === 'active' ? 'Deactivate' : 'Activate'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteMember(member.id, member.name)}
                              className="btn-ghost"
                              style={{ height: '32px', width: '32px', padding: 0, color: 'var(--color-danger)' }}
                              title="Remove member"
                              aria-label={`Remove ${member.name}`}
                            >
                              <Trash2 size={15} aria-hidden="true" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                        <div style={{ color: 'var(--color-foreground-muted)', marginBottom: '0.75rem' }}>
                          No team members found matching your search.
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSearchQuery('');
                            setStatusFilter('all');
                          }}
                          className="btn-secondary"
                          style={{ margin: '0 auto' }}
                        >
                          Clear Filters
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Audit Logs Section */}
          <section className="content-card">
            <div className="card-header-bar">
              <div>
                <h2 className="card-title">Recent Audit Log & Events</h2>
                <p className="card-subtitle">Chronological record of system modifications and administrative actions</p>
              </div>
            </div>
            <div style={{ padding: '1.25rem 1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {activities.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      background: 'var(--color-surface-hover)',
                      borderRadius: 'var(--radius-md)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: 'var(--color-primary-light)',
                          color: 'var(--color-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Activity size={16} aria-hidden="true" />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{item.action}</div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--color-foreground-muted)' }}>
                          Triggered by {item.user}
                        </div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-foreground-subtle)' }}>{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Accessible Add Member Modal */}
      {isModalOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal-content">
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 id="modal-title" style={{ fontSize: '1.2rem', fontWeight: 800 }}>Add New Team Member</h2>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close dialog"
                style={{ padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddMemberSubmit} style={{ padding: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="new-name">
                  Full Name
                </label>
                <input
                  id="new-name"
                  ref={modalInputRef}
                  type="text"
                  required
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="e.g. Liam Sterling…"
                  className="input-control"
                  style={{ paddingLeft: '0.85rem' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="new-email">
                  Work Email Address
                </label>
                <input
                  id="new-email"
                  type="email"
                  required
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="liam.sterling@userdashboard.io…"
                  spellCheck={false}
                  className="input-control"
                  style={{ paddingLeft: '0.85rem' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="new-role">
                  Designation / Role
                </label>
                <input
                  id="new-role"
                  type="text"
                  required
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  placeholder="e.g. Lead QA Engineer…"
                  className="input-control"
                  style={{ paddingLeft: '0.85rem' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="new-dept">
                  Department
                </label>
                <select
                  id="new-dept"
                  value={newMemberDept}
                  onChange={(e) => setNewMemberDept(e.target.value)}
                  className="input-control"
                  style={{ paddingLeft: '0.85rem' }}
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Product Design">Product Design</option>
                  <option value="Operations">Operations</option>
                  <option value="Security">Security</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.75rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ width: 'auto' }}>
                  Create Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
