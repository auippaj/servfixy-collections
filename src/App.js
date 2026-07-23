import React, { useState, useEffect, useRef } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'https://servfixy-production.up.railway.app';

// ── Login ──────────────────────────────────────────────────────────────────────
function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      if (data.user.role !== 'admin' && data.user.role !== 'dispatcher') {
        throw new Error('Access denied. Servfixy Collections staff only.');
      }
      localStorage.setItem('collections_token', data.token);
      localStorage.setItem('collections_user', JSON.stringify(data.user));
      onLogin(data.user, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ backgroundColor: '#ffffff', padding: '48px', borderRadius: '12px', width: '100%', maxWidth: '420px', boxShadow: '0 4px 40px rgba(192,132,252,0.15)', border: '1px solid #1e293b' }}>
        <div style={{ marginBottom: '24px' }}>
          <img src="https://i.imgur.com/zJis2hK.png" alt="Servfixy" style={{ height: '36px', objectFit: 'contain' }} />
          <div style={{ display: 'inline-block', marginLeft: '10px', verticalAlign: 'middle', background: '#1d4ed8', borderRadius: '6px', padding: '3px 10px', fontSize: '12px', fontWeight: '700', color: '#fff', letterSpacing: '0.05em' }}>COLLECTIONS</div>
        </div>
        <h2 style={{ color: '#0f172a', margin: '0 0 6px 0', fontSize: '20px', fontWeight: '700' }}>Sign in</h2>
        <p style={{ color: '#94a3b8', margin: '0 0 28px 0', fontSize: '13px' }}>Delinquency &amp; Collections Management</p>
        {error && <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px' }}>{error}</div>}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="you@servfixy.com"
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #1e293b', backgroundColor: '#ffffff', color: '#0f172a', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }} />
        </div>
        <div style={{ marginBottom: '28px' }}>
          <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="••••••••"
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #1e293b', backgroundColor: '#ffffff', color: '#0f172a', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }} />
        </div>
        <button onClick={handleLogin} disabled={loading}
          style={{ width: '100%', padding: '13px', borderRadius: '8px', border: 'none', background: loading ? '#1e40af' : '#1d4ed8', color: '#fff', fontSize: '15px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '0.02em' }}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </div>
    </div>
  );
}

// ── Sidebar Nav ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { group: 'OVERVIEW', items: [
    { label: 'Analytics',            icon: '📊', tab: 'Collections Analytics' },
    { label: 'Cases',                icon: '📁', tab: 'Collections Cases' },
    { label: 'Reports',              icon: '📄', tab: 'Collections Reports' },
  ]},
  { group: 'OPERATIONS', items: [
    { label: 'Coordinator Workspace',icon: '🧑‍💼', tab: 'Coordinator Workspace' },
    { label: 'Court Calendar',       icon: '🗓️', tab: 'Court Calendar' },
    { label: 'Escalation Rules',     icon: '⚡', tab: 'Escalation Rules' },
  ]},
  { group: 'TOOLS', items: [
    { label: 'Document Vault',       icon: '🗂️', tab: 'Document Vault' },
    { label: 'Import Cases',         icon: '📥', tab: 'Import Cases' },
    { label: 'Owner Summary',        icon: '🏢', tab: 'Owner Summary' },
    { label: 'Onboarding',           icon: '🚀', tab: 'Onboarding' },
  ]},
  { group: 'RISK', items: [
    { label: 'Risk Register',        icon: '🛡️', tab: 'Collections Risk' },
  ]},
];

function Sidebar({ activeTab, setActiveTab, user, onLogout }) {
  return (
    <div style={{ width: '224px', minWidth: '224px', backgroundColor: '#ffffff', borderRight: '1px solid #1e293b', display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0 }}>
      {/* Logo */}
      <div style={{ padding: '20px 18px 14px', borderBottom: '1px solid #1e293b' }}>
        <img src="https://i.imgur.com/zJis2hK.png" alt="Servfixy" style={{ height: '28px', objectFit: 'contain' }} />
        <div style={{ marginTop: '6px', display: 'inline-block', background: '#1d4ed8', borderRadius: '5px', padding: '2px 8px', fontSize: '10px', fontWeight: '700', color: '#fff', letterSpacing: '0.08em' }}>COLLECTIONS</div>
      </div>
      {/* Nav groups */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
        {NAV_ITEMS.map(group => (
          <div key={group.group} style={{ marginBottom: '8px' }}>
            <div style={{ padding: '4px 18px 6px', fontSize: '10px', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.1em' }}>{group.group}</div>
            {group.items.map(item => {
              const active = activeTab === item.tab;
              return (
                <div key={item.tab} onClick={() => setActiveTab(item.tab)}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 18px', cursor: 'pointer', borderRadius: '0', borderLeft: active ? '3px solid #3b82f6' : '3px solid transparent', backgroundColor: active ? '#eff6ff' : 'transparent', color: active ? '#1d4ed8' : '#94a3b8', fontSize: '13px', fontWeight: active ? '600' : '400', transition: 'all 0.15s' }}>
                  <span style={{ fontSize: '15px' }}>{item.icon}</span>
                  {item.label}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {/* Footer */}
      <div style={{ padding: '14px 18px', borderTop: '1px solid #1e293b' }}>
        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
        <div style={{ fontSize: '11px', color: '#1e40af', textTransform: 'capitalize', marginBottom: '10px' }}>{user?.role}</div>
        <button onClick={onLogout}
          style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #1e293b', backgroundColor: 'transparent', color: '#94a3b8', fontSize: '12px', cursor: 'pointer' }}>
          Sign Out
        </button>
      </div>
    </div>
  );
}

// ── App Shell ──────────────────────────────────────────────────────────────────
// ── Collections Analytics Tab ──────────────────────────────────────────────────
function CollectionsAnalyticsTab({ token, onNavigate }) {
  const [data, setData] = useState(null);
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async (propId) => {
    setLoading(true);
    setError('');
    try {
      const url = propId
        ? `${API_URL}/api/collections/analytics?property_id=${propId}`
        : `${API_URL}/api/collections/analytics`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to load analytics');
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch(`${API_URL}/api/properties`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(rows => setProperties(Array.isArray(rows) ? rows : [])).catch(() => {});
    fetchData('');
  }, [token]);

  const handlePropertyChange = (e) => {
    setSelectedProperty(e.target.value);
    fetchData(e.target.value);
  };

  const AGING_COLORS = { '30-60': '#facc15', '61-90': '#ea580c', '91-120': '#dc2626', '120+': '#dc2626' };
  const STATUS_COLORS = {
    active: '#1d4ed8', notice_issued: '#facc15', filed_with_attorney: '#ea580c',
    fed: '#dc2626', writ_filed: '#dc2626', hearing_scheduled: '#7c3aed',
    possession_granted: '#15803d', closed_paid: '#34d399', closed_written_off: '#94a3b8'
  };

  const fmtCurrency = (v) => '$' + Number(v || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtStatus = (s) => (s || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  const BarChart = ({ rows, valueKey, labelKey, colorMap, maxVal }) => {
    const max = maxVal || Math.max(...rows.map(r => Number(r[valueKey]) || 0), 1);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {rows.map((row, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '130px', fontSize: '12px', color: '#94a3b8', textAlign: 'right', flexShrink: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {fmtStatus(row[labelKey])}
            </div>
            <div style={{ flex: 1, height: '22px', backgroundColor: '#ffffff', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${Math.min(100, (Number(row[valueKey]) / max) * 100)}%`, height: '100%', backgroundColor: colorMap ? (colorMap[row[labelKey]] || '#14B8A6') : '#14B8A6', borderRadius: '4px', transition: 'width 0.4s ease' }} />
            </div>
            <div style={{ width: '40px', fontSize: '12px', color: '#1e293b', fontWeight: '600', flexShrink: 0 }}>{row[valueKey]}</div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) return (
    <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontFamily: 'Arial, sans-serif' }}>
      Loading collections analytics...
    </div>
  );

  if (error) return (
    <div style={{ padding: '40px', color: '#dc2626', fontFamily: 'Arial, sans-serif' }}>{error}</div>
  );

  const s = data?.summary || {};
  const byAging = data?.by_aging || [];
  const byStatus = data?.by_status || [];
  const byProperty = data?.by_property || [];
  const activity = data?.recent_activity || [];
  const plans = data?.plan_performance || {};

  const navigate = onNavigate || (() => {});

  const kpis = [
    { label: 'Total Delinquent Balance', value: fmtCurrency(s.total_balance), color: '#dc2626', sub: `${s.total_cases || 0} total cases`, onClick: () => navigate('Collections Cases', { status: '', property_id: selectedProperty, aging_bucket: '' }) },
    { label: 'Active Cases', value: s.active_cases || 0, color: '#1d4ed8', sub: 'Not yet closed', onClick: () => navigate('Collections Cases', { status: 'active', property_id: selectedProperty, aging_bucket: '' }) },
    { label: 'In Legal Pipeline', value: s.legal_cases || 0, color: '#ea580c', sub: 'Attorney thru Possession', onClick: () => navigate('Collections Cases', { status: 'filed_with_attorney', property_id: selectedProperty, aging_bucket: '' }) },
    { label: 'Possession Granted', value: s.possession_count || 0, color: '#dc2626', sub: 'This portfolio', onClick: () => navigate('Collections Cases', { status: 'possession_granted', property_id: selectedProperty, aging_bucket: '' }) },
    { label: 'Avg Days Open', value: `${s.avg_days_open || 0}d`, color: '#7c3aed', sub: 'Per active case', onClick: () => navigate('Collections Reports', null) },
    { label: 'Active Payment Plans', value: plans.active_plans || 0, color: '#15803d', sub: `${plans.completed_plans || 0} completed / ${plans.broken_plans || 0} broken`, onClick: () => navigate('Collections Reports', null) },
  ];

  const maxAgingBalance = Math.max(...byAging.map(r => Number(r.balance) || 0), 1);

  return (
    <div style={{ padding: '24px', fontFamily: 'Arial, sans-serif', backgroundColor: '#ffffff', minHeight: '100vh', color: '#1e293b' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: '#0f172a' }}>Collections Analytics</h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#94a3b8' }}>Portfolio-wide delinquency intelligence</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select value={selectedProperty} onChange={handlePropertyChange}
            style={{ padding: '8px 12px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#1e293b', fontSize: '13px' }}>
            <option value=''>All Properties</option>
            {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <button onClick={() => fetchData(selectedProperty)}
            style={{ padding: '8px 16px', backgroundColor: '#14B8A6', border: 'none', borderRadius: '8px', color: 'white', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
            Refresh
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {kpis.map((k, i) => (
          <div key={i} onClick={k.onClick}
            style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', borderLeft: `4px solid ${k.color}`, cursor: 'pointer', transition: 'background 0.15s', userSelect: 'none' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffff'}>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k.label}</div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: k.color, marginBottom: '4px' }}>{k.value}</div>
            <div style={{ fontSize: '11px', color: '#475569' }}>{k.sub}</div>
            <div style={{ fontSize: '10px', color: '#cbd5e1', marginTop: '6px' }}>Click to view →</div>
          </div>
        ))}
      </div>

      {/* Row 1: Aging + Status */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>

        {/* Aging Breakdown */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Balance by Aging Bucket</h3>
          {byAging.length === 0 ? (
            <div style={{ color: '#475569', fontSize: '13px' }}>No data yet</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {byAging.map((row, i) => (
                <div key={i} onClick={() => navigate('Collections Cases', { status: '', property_id: selectedProperty, aging_bucket: row.aging_bucket })}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: AGING_COLORS[row.aging_bucket] || '#14B8A6' }}>{row.aging_bucket} Days</span>
                    <span style={{ fontSize: '13px', color: '#94a3b8' }}>{row.count} cases &nbsp;·&nbsp; {fmtCurrency(row.balance)} <span style={{ color: '#cbd5e1', fontSize: '11px' }}>→</span></span>
                  </div>
                  <div style={{ height: '10px', backgroundColor: '#ffffff', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min(100, (Number(row.balance) / maxAgingBalance) * 100)}%`, height: '100%', backgroundColor: AGING_COLORS[row.aging_bucket] || '#14B8A6', borderRadius: '5px', transition: 'width 0.4s ease' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pipeline by Status */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Collections Pipeline</h3>
          {byStatus.length === 0 ? (
            <div style={{ color: '#475569', fontSize: '13px' }}>No data yet</div>
          ) : (
            <BarChart rows={byStatus} valueKey='count' labelKey='status' colorMap={STATUS_COLORS} />
          )}
        </div>
      </div>

      {/* Row 2: Properties + Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>

        {/* Top Properties by Balance */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Properties by Delinquent Balance</h3>
          {byProperty.length === 0 ? (
            <div style={{ color: '#475569', fontSize: '13px' }}>No data yet</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {byProperty.map((row, i) => (
                <div key={i} onClick={() => { const prop = properties.find(p => p.name === row.property_name); navigate('Collections Cases', { status: '', property_id: prop?.id || '', aging_bucket: '' }); }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', backgroundColor: '#ffffff', borderRadius: '8px', cursor: 'pointer', transition: 'opacity 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>{row.property_name}</div>
                    <div style={{ fontSize: '11px', color: '#475569' }}>{row.state} &nbsp;·&nbsp; {row.case_count} cases <span style={{ color: '#cbd5e1' }}>→</span></div>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#dc2626' }}>{fmtCurrency(row.total_balance)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Contact Activity */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Contact Activity</h3>
          <div style={{ fontSize: '11px', color: '#475569', marginBottom: '16px' }}>Last 30 days</div>
          {activity.length === 0 ? (
            <div style={{ color: '#475569', fontSize: '13px' }}>No touchpoints logged yet</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {activity.slice(0, 8).map((row, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#ffffff', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', backgroundColor: '#dbeafe', color: '#1d4ed8', padding: '2px 8px', borderRadius: '4px', fontWeight: '600', textTransform: 'uppercase' }}>{row.contact_method}</span>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>{fmtStatus(row.outcome)}</span>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#14B8A6' }}>{row.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Payment Plan Summary */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Payment Plan Overview</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {[
            { label: 'Total Plans', value: plans.total_plans || 0, color: '#1d4ed8' },
            { label: 'Active', value: plans.active_plans || 0, color: '#15803d' },
            { label: 'Completed', value: plans.completed_plans || 0, color: '#14B8A6' },
            { label: 'Broken', value: plans.broken_plans || 0, color: '#dc2626' },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '16px', backgroundColor: '#ffffff', borderRadius: '10px' }}>
              <div style={{ fontSize: '28px', fontWeight: '800', color: item.color }}>{item.value}</div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
// ── End Collections Analytics Tab ──────────────────────────────────────────────

// ── Coordinator Assign Field ───────────────────────────────────────────────────
function CoordinatorAssignField({ caseId, currentCoordinator, token, onAssigned }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(currentCoordinator || '');
  const [saving, setSaving] = useState(false);
  const KNOWN_COORDINATORS = JSON.parse(localStorage.getItem('collections_known_coordinators') || '[]');

  const handleSave = async () => {
    if (!value.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/collections/cases/${caseId}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ assigned_coordinator_id: value.trim() })
      });
      if (res.ok) {
        // Save to known coordinators list
        const updated = [...new Set([...KNOWN_COORDINATORS, value.trim()])];
        localStorage.setItem('collections_known_coordinators', JSON.stringify(updated));
        setEditing(false);
        if (onAssigned) onAssigned();
      }
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  if (editing) return (
    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flex: 1 }}>
      <input
        value={value} onChange={e => setValue(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSave()}
        list='coordinator-list'
        placeholder='Type or select coordinator...'
        autoFocus
        style={{ flex: 1, padding: '6px 10px', backgroundColor: '#ffffff', border: '1px solid #14B8A6', borderRadius: '6px', color: '#1e293b', fontSize: '13px' }}
      />
      <datalist id='coordinator-list'>
        {KNOWN_COORDINATORS.map(n => <option key={n} value={n} />)}
      </datalist>
      <button onClick={handleSave} disabled={saving}
        style={{ padding: '6px 12px', backgroundColor: '#14B8A6', border: 'none', borderRadius: '6px', color: 'white', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
        {saving ? '...' : 'Assign'}
      </button>
      <button onClick={() => setEditing(false)}
        style={{ padding: '6px 10px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#94a3b8', fontSize: '12px', cursor: 'pointer' }}>
        Cancel
      </button>
    </div>
  );

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
      {currentCoordinator ? (
        <span style={{ fontSize: '13px', fontWeight: '600', color: '#14B8A6' }}>👤 {currentCoordinator}</span>
      ) : (
        <span style={{ fontSize: '13px', color: '#475569', fontStyle: 'italic' }}>Unassigned</span>
      )}
      <button onClick={() => { setValue(currentCoordinator || ''); setEditing(true); }}
        style={{ fontSize: '11px', padding: '3px 10px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '5px', color: '#94a3b8', cursor: 'pointer' }}>
        {currentCoordinator ? 'Reassign' : 'Assign'}
      </button>
    </div>
  );
}
// ── End Coordinator Assign Field ───────────────────────────────────────────────

// ── Collections Cases Tab ──────────────────────────────────────────────────────
function CollectionsCasesTab({ token, initialFilters, onBack }) {
  const [cases, setCases] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCase, setSelectedCase] = useState(null);
  const [caseDetail, setCaseDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [filterProperty, setFilterProperty] = useState(initialFilters?.property_id || '');
  const [filterStatus, setFilterStatus] = useState(initialFilters?.status || '');
  const [filterAging, setFilterAging] = useState(initialFilters?.aging_bucket || '');
  const [showNewCase, setShowNewCase] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkAction, setBulkAction] = useState('');
  const [bulkStatus, setBulkStatus] = useState('');
  const [bulkCoordinator, setBulkCoordinator] = useState('');
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [showTouchpoint, setShowTouchpoint] = useState(false);
  const [showPaymentPlan, setShowPaymentPlan] = useState(false);
  const [showNoticeForm, setShowNoticeForm] = useState(false);
  const [logPaymentPlanId, setLogPaymentPlanId] = useState(null);
  const [noteForm, setNoteForm] = useState({ note_text: '', note_type: 'general', author: '' });
  const [noteSubmitting, setNoteSubmitting] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [paymentLogForm, setPaymentLogForm] = useState({ amount: '', due_date: new Date().toISOString().split('T')[0], paid_date: new Date().toISOString().split('T')[0], status: 'paid', notes: '' });
  const [paymentLogSubmitting, setPaymentLogSubmitting] = useState(false);
  const [noticeForm, setNoticeForm] = useState({ notice_type: 'pay_or_quit', jurisdiction_state: '', generated_by: '' });
  const [noticeGenerating, setNoticeGenerating] = useState(false);
  const [noticePreview, setNoticePreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const [newCase, setNewCase] = useState({
    property_id: '', resident_name: '', unit_number: '', balance_owed: '',
    aging_bucket: '30-60', times_late: '', attorney_name: '',
    notice_issued_date: '', court_hearing_date: '', writ_file_date: '',
    possession_granted_date: '', fed_date: '', assigned_coordinator_id: '',
    status: 'active'
  });

  const [touchpointForm, setTouchpointForm] = useState({
    coordinator_name: '', contact_method: 'call', outcome: 'left_voicemail', notes: '', contacted_at: new Date().toISOString().slice(0,16)
  });

  const [planForm, setPlanForm] = useState({
    total_amount: '', installment_amount: '', frequency: 'monthly',
    start_date: new Date().toISOString().split('T')[0], coordinator_name: '', notes: ''
  });

  const STATUS_PIPELINE = [
    { key: 'active', label: 'Active', color: '#1d4ed8' },
    { key: 'notice_issued', label: 'Notice Issued', color: '#facc15' },
    { key: 'filed_with_attorney', label: 'Filed w/ Attorney', color: '#ea580c' },
    { key: 'fed', label: 'FED', color: '#f97316' },
    { key: 'writ_filed', label: 'Writ Filed', color: '#dc2626' },
    { key: 'hearing_scheduled', label: 'Hearing Scheduled', color: '#7c3aed' },
    { key: 'possession_granted', label: 'Possession Granted', color: '#15803d' },
    { key: 'closed_paid', label: 'Closed - Paid', color: '#34d399' },
    { key: 'closed_written_off', label: 'Closed - Written Off', color: '#94a3b8' },
  ];

  const AGING_OPTIONS = ['30-60', '61-90', '91-120', '120+'];
  const AGING_COLORS = { '30-60': '#facc15', '61-90': '#ea580c', '91-120': '#dc2626', '120+': '#dc2626' };
  const METHOD_OPTIONS = ['call', 'text', 'email', 'letter', 'in_person', 'other'];
  const OUTCOME_OPTIONS = ['left_voicemail', 'payment_promise', 'no_answer', 'payment_received', 'refused_to_pay', 'disconnected', 'in_person_contact', 'other'];

  const fmtCurrency = (v) => '$' + Number(v || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
  const fmtStatus = (s) => (s || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const statusColor = (s) => (STATUS_PIPELINE.find(p => p.key === s) || { color: '#94a3b8' }).color;

  const fetchCases = async () => {
    setLoading(true); setError('');
    try {
      let url = `${API_URL}/api/collections/cases?`;
      if (filterProperty) url += `property_id=${filterProperty}&`;
      if (filterStatus)   url += `status=${filterStatus}&`;
      if (filterAging)    url += `aging_bucket=${encodeURIComponent(filterAging)}&`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to load cases');
      setCases(Array.isArray(json) ? json : []);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const fetchCaseDetail = async (id) => {
    setDetailLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/collections/cases/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to load case');
      setCaseDetail(json);
    } catch (err) { setError(err.message); }
    finally { setDetailLoading(false); }
  };

  useEffect(() => {
    fetch(`${API_URL}/api/properties`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(rows => setProperties(Array.isArray(rows) ? rows : [])).catch(() => {});
    fetchCases();
  }, [token]);

  useEffect(() => { fetchCases(); }, [filterProperty, filterStatus, filterAging]);

  const handleSelectCase = (c) => {
    setSelectedCase(c);
    fetchCaseDetail(c.id);
    setShowTouchpoint(false);
    setShowPaymentPlan(false);
  };

  const handleCreateCase = async () => {
    if (!newCase.property_id || !newCase.resident_name || !newCase.unit_number || !newCase.balance_owed) {
      setFormError('Property, resident name, unit, and balance are required.'); return;
    }
    setSubmitting(true); setFormError('');
    try {
      const res = await fetch(`${API_URL}/api/collections/cases`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newCase, balance_owed: parseFloat(newCase.balance_owed), times_late: parseInt(newCase.times_late) || 0 })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to create case');
      setShowNewCase(false);
      setNewCase({ property_id: '', resident_name: '', unit_number: '', balance_owed: '', aging_bucket: '30-60', times_late: '', attorney_name: '', notice_issued_date: '', court_hearing_date: '', writ_file_date: '', possession_granted_date: '', fed_date: '', assigned_coordinator_id: '', status: 'active' });
      fetchCases();
    } catch (err) { setFormError(err.message); }
    finally { setSubmitting(false); }
  };

  const handleAdvanceStatus = async (newStatus) => {
    if (!selectedCase) return;
    try {
      const res = await fetch(`${API_URL}/api/collections/cases/${selectedCase.id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setSelectedCase(json);
      fetchCaseDetail(selectedCase.id);
      fetchCases();
    } catch (err) { alert('Status update failed: ' + err.message); }
  };

  const handleLogTouchpoint = async () => {
    if (!touchpointForm.coordinator_name) { setFormError('Coordinator name required.'); return; }
    setSubmitting(true); setFormError('');
    try {
      const res = await fetch(`${API_URL}/api/collections/cases/${selectedCase.id}/touchpoints`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(touchpointForm)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setShowTouchpoint(false);
      setTouchpointForm({ coordinator_name: '', contact_method: 'call', outcome: 'left_voicemail', notes: '', contacted_at: new Date().toISOString().slice(0,16) });
      fetchCaseDetail(selectedCase.id);
    } catch (err) { setFormError(err.message); }
    finally { setSubmitting(false); }
  };

  const handleCreatePlan = async () => {
    if (!planForm.total_amount || !planForm.installment_amount || !planForm.start_date) {
      setFormError('Total amount, installment amount, and start date are required.'); return;
    }
    setSubmitting(true); setFormError('');
    try {
      const res = await fetch(`${API_URL}/api/collections/cases/${selectedCase.id}/payment-plans`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...planForm, total_amount: parseFloat(planForm.total_amount), installment_amount: parseFloat(planForm.installment_amount) })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setShowPaymentPlan(false);
      setPlanForm({ total_amount: '', installment_amount: '', frequency: 'monthly', start_date: new Date().toISOString().split('T')[0], coordinator_name: '', notes: '' });
      fetchCaseDetail(selectedCase.id);
    } catch (err) { setFormError(err.message); }
    finally { setSubmitting(false); }
  };

  const handleLogPayment = async (planId) => {
    if (!paymentLogForm.amount || !paymentLogForm.due_date) { setFormError('Amount and due date required.'); return; }
    setPaymentLogSubmitting(true); setFormError('');
    try {
      const res = await fetch(`${API_URL}/api/collections/payment-plans/${planId}/payments`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ case_id: selectedCase.id, amount: parseFloat(paymentLogForm.amount), due_date: paymentLogForm.due_date, paid_date: paymentLogForm.status === 'paid' ? paymentLogForm.paid_date : null, status: paymentLogForm.status, notes: paymentLogForm.notes || null })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      if (paymentLogForm.status === 'missed') {
        const planData = caseDetail.payment_plans.find(p => p.id === planId);
        if (planData) {
          const newMissed = (planData.missed_payments || 0) + 1;
          await fetch(`${API_URL}/api/collections/payment-plans/${planId}`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ missed_payments: newMissed, status: newMissed >= 2 ? 'broken' : 'active' })
          });
        }
      }
      setLogPaymentPlanId(null);
      setPaymentLogForm({ amount: '', due_date: new Date().toISOString().split('T')[0], paid_date: new Date().toISOString().split('T')[0], status: 'paid', notes: '' });
      fetchCaseDetail(selectedCase.id);
    } catch (err) { setFormError(err.message); }
    finally { setPaymentLogSubmitting(false); }
  };

  const handleFetchPreview = async () => {
    if (!noticeForm.jurisdiction_state || !noticeForm.notice_type) return;
    setPreviewLoading(true); setNoticePreview(null);
    try {
      const res = await fetch(`${API_URL}/api/collections/cases/${selectedCase.id}/notice-preview?notice_type=${noticeForm.notice_type}&jurisdiction_state=${noticeForm.jurisdiction_state}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (res.ok) setNoticePreview(json);
    } catch (err) { console.error(err); }
    finally { setPreviewLoading(false); }
  };

  const handleGenerateNotice = async () => {
    if (!noticeForm.jurisdiction_state || !noticeForm.generated_by) {
      setFormError('State and coordinator name are required.'); return;
    }
    setNoticeGenerating(true); setFormError('');
    try {
      const res = await fetch(`${API_URL}/api/collections/cases/${selectedCase.id}/generate-notice`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(noticeForm)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to generate notice');
      setShowNoticeForm(false);
      setNoticeForm({ notice_type: 'pay_or_quit', jurisdiction_state: '', generated_by: '' });
      fetchCaseDetail(selectedCase.id);
      window.open(json.pdf_url, '_blank');
    } catch (err) { setFormError(err.message); }
    finally { setNoticeGenerating(false); }
  };

  const toggleSelectId = (id) => setSelectedIds(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const handleBulkAdvanceStatus = async () => {
    if (!bulkStatus || selectedIds.size === 0) return;
    setBulkProcessing(true);
    for (const id of selectedIds) {
      try {
        await fetch(`${API_URL}/api/collections/cases/${id}`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: bulkStatus })
        });
      } catch (err) { console.error(err); }
    }
    setBulkProcessing(false);
    setSelectedIds(new Set());
    setBulkMode(false);
    fetchCases();
  };

  const handleBulkExportCSV = () => {
    const rows = cases.filter(c => selectedIds.size === 0 || selectedIds.has(c.id));
    const headers = ['Resident Name','Unit','Property','Balance Owed','Aging','Status','Attorney','Notice Date','FED Date','Writ Date','Hearing Date','Possession Date'];
    const csvRows = [
      headers.join(','),
      ...rows.map(c => [
        c.resident_name, c.unit_number, c.property_name,
        c.balance_owed, c.aging_bucket, c.status,
        c.attorney_name || '', c.notice_issued_date || '',
        c.fed_date || '', c.writ_file_date || '',
        c.court_hearing_date || '', c.possession_granted_date || ''
      ].map(v => `"${String(v || '').replace(/"/g,'""')}"`).join(','))
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `collections_cases_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAddNote = async () => {
    if (!noteForm.note_text || !noteForm.author) { setFormError('Note text and author required.'); return; }
    setNoteSubmitting(true); setFormError('');
    try {
      const res = await fetch(`${API_URL}/api/collections/cases/${selectedCase.id}/notes`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(noteForm)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setNoteForm({ note_text: '', note_type: 'general', author: noteForm.author });
      setShowNoteForm(false);
      fetchCaseDetail(selectedCase.id);
    } catch (err) { setFormError(err.message); }
    finally { setNoteSubmitting(false); }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await fetch(`${API_URL}/api/collections/notes/${noteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCaseDetail(selectedCase.id);
    } catch (err) { console.error(err); }
  };

  const inputStyle = { width: '100%', padding: '9px 12px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '7px', color: '#1e293b', fontSize: '13px', boxSizing: 'border-box' };
  const labelStyle = { fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' };
  const btnPrimary = { padding: '9px 18px', backgroundColor: '#14B8A6', border: 'none', borderRadius: '7px', color: 'white', fontSize: '13px', fontWeight: '600', cursor: 'pointer' };
  const btnSecondary = { padding: '9px 18px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '7px', color: '#94a3b8', fontSize: '13px', cursor: 'pointer' };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>

      {/* LEFT PANEL — Case List */}
      <div style={{ width: '360px', minWidth: '360px', borderRight: '1px solid #ffffff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Filters */}
        <div style={{ padding: '16px', borderBottom: '1px solid #ffffff', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {onBack && (
                <button onClick={onBack}
                  style={{ padding: '5px 10px', backgroundColor: '#1B3A6B', border: '1px solid #14B8A6', borderRadius: '6px', color: '#14B8A6', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                  ← Analytics
                </button>
              )}
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Cases</h2>
            </div>
            <button onClick={() => { setShowNewCase(true); setFormError(''); }} style={{ ...btnPrimary, padding: '7px 14px', fontSize: '12px' }}>+ New Case</button>
          </div>
          <select value={filterProperty} onChange={e => setFilterProperty(e.target.value)} style={{ ...inputStyle, marginBottom: '8px' }}>
            <option value=''>All Properties</option>
            {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <div style={{ display: 'flex', gap: '8px' }}>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ ...inputStyle }}>
              <option value=''>All Statuses</option>
              {STATUS_PIPELINE.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
            <select value={filterAging} onChange={e => setFilterAging(e.target.value)} style={{ ...inputStyle }}>
              <option value=''>All Aging</option>
              {AGING_OPTIONS.map(a => <option key={a} value={a}>{a} Days</option>)}
            </select>
          </div>
        </div>

        {/* Bulk Toolbar */}
        <div style={{ padding: '8px 16px', borderBottom: '1px solid #ffffff', backgroundColor: '#ffffff', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => { setBulkMode(!bulkMode); setSelectedIds(new Set()); }}
            style={{ fontSize: '11px', padding: '4px 10px', backgroundColor: bulkMode ? '#1B3A6B' : '#ffffff', border: `1px solid ${bulkMode ? '#14B8A6' : '#cbd5e1'}`, borderRadius: '5px', color: bulkMode ? '#14B8A6' : '#94a3b8', cursor: 'pointer', fontWeight: '600' }}>
            {bulkMode ? `✓ ${selectedIds.size} selected` : 'Bulk Select'}
          </button>
          {bulkMode && selectedIds.size > 0 && (
            <>
              <select value={bulkStatus} onChange={e => setBulkStatus(e.target.value)}
                style={{ fontSize: '11px', padding: '4px 8px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '5px', color: '#1e293b' }}>
                <option value=''>Advance status to...</option>
                {[{key:'active',label:'Active'},{key:'notice_issued',label:'Notice Issued'},{key:'filed_with_attorney',label:'Filed w/ Attorney'},{key:'fed',label:'FED'},{key:'writ_filed',label:'Writ Filed'},{key:'hearing_scheduled',label:'Hearing Scheduled'},{key:'possession_granted',label:'Possession Granted'},{key:'closed_paid',label:'Closed - Paid'},{key:'closed_written_off',label:'Written Off'}].map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
              {bulkStatus && (
                <button onClick={handleBulkAdvanceStatus} disabled={bulkProcessing}
                  style={{ fontSize: '11px', padding: '4px 10px', backgroundColor: '#14B8A6', border: 'none', borderRadius: '5px', color: 'white', cursor: 'pointer', fontWeight: '600' }}>
                  {bulkProcessing ? 'Updating...' : 'Apply'}
                </button>
              )}
              <button onClick={handleBulkExportCSV}
                style={{ fontSize: '11px', padding: '4px 10px', backgroundColor: '#dbeafe', border: '1px solid #cbd5e1', borderRadius: '5px', color: '#1d4ed8', cursor: 'pointer', fontWeight: '600' }}>
                Export CSV
              </button>
              <button onClick={() => setSelectedIds(new Set(cases.map(c => c.id)))}
                style={{ fontSize: '11px', padding: '4px 10px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '5px', color: '#94a3b8', cursor: 'pointer' }}>
                Select All
              </button>
              <button onClick={() => setSelectedIds(new Set())}
                style={{ fontSize: '11px', padding: '4px 10px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '5px', color: '#94a3b8', cursor: 'pointer' }}>
                Clear
              </button>
            </>
          )}
          {!bulkMode && (
            <button onClick={handleBulkExportCSV}
              style={{ fontSize: '11px', padding: '4px 10px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '5px', color: '#94a3b8', cursor: 'pointer' }}>
              Export All CSV
            </button>
          )}
        </div>

        {/* Case List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#475569', fontSize: '13px' }}>Loading cases...</div>
          ) : error ? (
            <div style={{ padding: '24px', color: '#dc2626', fontSize: '13px' }}>{error}</div>
          ) : cases.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#475569', fontSize: '13px' }}>No cases found. Add your first case.</div>
          ) : cases.map(c => (
            <div key={c.id}
              onClick={() => bulkMode ? toggleSelectId(c.id) : handleSelectCase(c)}
              style={{ padding: '14px 16px', borderBottom: '1px solid #ffffff', cursor: 'pointer', backgroundColor: bulkMode && selectedIds.has(c.id) ? '#1B3A6B' : selectedCase?.id === c.id ? '#ffffff' : 'transparent', transition: 'background 0.15s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  {bulkMode && (
                    <div style={{ width: '16px', height: '16px', borderRadius: '3px', border: `2px solid ${selectedIds.has(c.id) ? '#14B8A6' : '#cbd5e1'}`, backgroundColor: selectedIds.has(c.id) ? '#14B8A6' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                      {selectedIds.has(c.id) && <span style={{ color: '#ffffff', fontSize: '10px', fontWeight: '900' }}>✓</span>}
                    </div>
                  )}
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>{c.resident_name}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>Unit {c.unit_number} &nbsp;·&nbsp; {c.property_name}</div>
                  </div>
                </div>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#dc2626' }}>{fmtCurrency(c.balance_owed)}</div>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#dbeafe', color: statusColor(c.status), fontWeight: '600' }}>{fmtStatus(c.status)}</span>
                <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#ffffff', color: AGING_COLORS[c.aging_bucket] || '#94a3b8', fontWeight: '600' }}>{c.aging_bucket} Days</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL — Case Detail */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        {!selectedCase ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#cbd5e1' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
            <div style={{ fontSize: '16px', fontWeight: '600' }}>Select a case to view details</div>
            <div style={{ fontSize: '13px', marginTop: '8px' }}>Or create a new case using the button above</div>
          </div>
        ) : detailLoading ? (
          <div style={{ textAlign: 'center', color: '#475569', paddingTop: '60px' }}>Loading case detail...</div>
        ) : caseDetail ? (
          <div>
            {/* Case Header */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>{caseDetail.resident_name}</h2>
                  <div style={{ fontSize: '13px', color: '#94a3b8' }}>Unit {caseDetail.unit_number} &nbsp;·&nbsp; {caseDetail.property_name} &nbsp;·&nbsp; {caseDetail.property_state}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '28px', fontWeight: '800', color: '#dc2626' }}>{fmtCurrency(caseDetail.balance_owed)}</div>
                  <div style={{ fontSize: '11px', color: '#475569' }}>Balance Owed</div>
                </div>
              </div>

              {/* Status Pipeline */}
              <div style={{ marginTop: '20px' }}>
                <div style={{ fontSize: '11px', color: '#475569', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Case Status — click to advance</div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {STATUS_PIPELINE.map(s => (
                    <button key={s.key} onClick={() => handleAdvanceStatus(s.key)}
                      style={{ padding: '5px 12px', borderRadius: '6px', border: caseDetail.status === s.key ? `2px solid ${s.color}` : '2px solid #cbd5e1', backgroundColor: caseDetail.status === s.key ? s.color + '22' : 'transparent', color: caseDetail.status === s.key ? s.color : '#475569', fontSize: '11px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s' }}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Key Dates */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px', marginTop: '20px' }}>
                {[
                  { label: 'Aging Bucket', value: `${caseDetail.aging_bucket} Days`, color: AGING_COLORS[caseDetail.aging_bucket] },
                  { label: 'Times Late', value: caseDetail.times_late || 0 },
                  { label: 'Notice Issued', value: fmtDate(caseDetail.notice_issued_date) },
                  { label: 'FED Date', value: fmtDate(caseDetail.fed_date) },
                  { label: 'Writ Filed', value: fmtDate(caseDetail.writ_file_date) },
                  { label: 'Court Hearing', value: fmtDate(caseDetail.court_hearing_date) },
                  { label: 'Possession Granted', value: fmtDate(caseDetail.possession_granted_date) },
                  { label: 'Attorney', value: caseDetail.attorney_name || '—' },
                ].map((item, i) => (
                  <div key={i} style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '10px 12px' }}>
                    <div style={{ fontSize: '10px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{item.label}</div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: item.color || '#1e293b' }}>{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Coordinator Assignment */}
              <div style={{ marginTop: '16px', padding: '12px 14px', backgroundColor: '#ffffff', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', flexShrink: 0 }}>Assigned Coordinator</div>
                <CoordinatorAssignField caseId={caseDetail.id} currentCoordinator={caseDetail.assigned_coordinator_name || caseDetail.assigned_coordinator_id} token={token} onAssigned={() => fetchCaseDetail(caseDetail.id)} />
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <button onClick={() => { setShowTouchpoint(true); setShowPaymentPlan(false); setFormError(''); }} style={btnPrimary}>+ Log Contact</button>
              <button onClick={() => { setShowPaymentPlan(true); setShowTouchpoint(false); setShowNoticeForm(false); setFormError(''); }} style={{ ...btnPrimary, backgroundColor: '#1d4ed8' }}>+ Payment Plan</button>
              <button onClick={() => { setShowNoticeForm(true); setShowTouchpoint(false); setShowPaymentPlan(false); setShowNoteForm(false); setFormError(''); }} style={{ ...btnPrimary, backgroundColor: '#b45309' }}>Generate Notice</button>
              <button onClick={() => { setShowNoteForm(true); setShowTouchpoint(false); setShowPaymentPlan(false); setShowNoticeForm(false); setFormError(''); }} style={{ ...btnPrimary, backgroundColor: '#0f4c75' }}>+ Internal Note</button>
            </div>

            {/* Log Touchpoint Form */}
            {showTouchpoint && (
              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Log Contact Attempt</h3>
                {formError && <div style={{ color: '#dc2626', fontSize: '13px', marginBottom: '12px' }}>{formError}</div>}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={labelStyle}>Coordinator Name</label>
                    <input value={touchpointForm.coordinator_name} onChange={e => setTouchpointForm(p => ({...p, coordinator_name: e.target.value}))} style={inputStyle} placeholder='Your name' />
                  </div>
                  <div>
                    <label style={labelStyle}>Date & Time</label>
                    <input type='datetime-local' value={touchpointForm.contacted_at} onChange={e => setTouchpointForm(p => ({...p, contacted_at: e.target.value}))} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Contact Method</label>
                    <select value={touchpointForm.contact_method} onChange={e => setTouchpointForm(p => ({...p, contact_method: e.target.value}))} style={inputStyle}>
                      {METHOD_OPTIONS.map(m => <option key={m} value={m}>{fmtStatus(m)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Outcome</label>
                    <select value={touchpointForm.outcome} onChange={e => setTouchpointForm(p => ({...p, outcome: e.target.value}))} style={inputStyle}>
                      {OUTCOME_OPTIONS.map(o => <option key={o} value={o}>{fmtStatus(o)}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <label style={labelStyle}>Notes</label>
                  <textarea value={touchpointForm.notes} onChange={e => setTouchpointForm(p => ({...p, notes: e.target.value}))} rows={3} style={{ ...inputStyle, resize: 'vertical' }} placeholder='Call notes, promises made, next steps...' />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={handleLogTouchpoint} disabled={submitting} style={btnPrimary}>{submitting ? 'Saving...' : 'Log Contact'}</button>
                  <button onClick={() => setShowTouchpoint(false)} style={btnSecondary}>Cancel</button>
                </div>
              </div>
            )}

            {/* Payment Plan Form */}
            {showPaymentPlan && (
              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Create Payment Plan</h3>
                {formError && <div style={{ color: '#dc2626', fontSize: '13px', marginBottom: '12px' }}>{formError}</div>}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={labelStyle}>Total Amount Owed ($)</label>
                    <input type='number' value={planForm.total_amount} onChange={e => setPlanForm(p => ({...p, total_amount: e.target.value}))} style={inputStyle} placeholder='0.00' />
                  </div>
                  <div>
                    <label style={labelStyle}>Installment Amount ($)</label>
                    <input type='number' value={planForm.installment_amount} onChange={e => setPlanForm(p => ({...p, installment_amount: e.target.value}))} style={inputStyle} placeholder='0.00' />
                  </div>
                  <div>
                    <label style={labelStyle}>Frequency</label>
                    <select value={planForm.frequency} onChange={e => setPlanForm(p => ({...p, frequency: e.target.value}))} style={inputStyle}>
                      <option value='weekly'>Weekly</option>
                      <option value='biweekly'>Bi-Weekly</option>
                      <option value='monthly'>Monthly</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Start Date</label>
                    <input type='date' value={planForm.start_date} onChange={e => setPlanForm(p => ({...p, start_date: e.target.value}))} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Coordinator Name</label>
                    <input value={planForm.coordinator_name} onChange={e => setPlanForm(p => ({...p, coordinator_name: e.target.value}))} style={inputStyle} placeholder='Your name' />
                  </div>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <label style={labelStyle}>Notes</label>
                  <textarea value={planForm.notes} onChange={e => setPlanForm(p => ({...p, notes: e.target.value}))} rows={2} style={{ ...inputStyle, resize: 'vertical' }} placeholder='Terms agreed, conditions, etc.' />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={handleCreatePlan} disabled={submitting} style={{ ...btnPrimary, backgroundColor: '#1d4ed8' }}>{submitting ? 'Saving...' : 'Create Plan'}</button>
                  <button onClick={() => setShowPaymentPlan(false)} style={btnSecondary}>Cancel</button>
                </div>
              </div>
            )}

            {/* Notice Generator Form */}
            {showNoticeForm && (
              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Generate Legal Notice</h3>
                {formError && <div style={{ color: '#dc2626', fontSize: '13px', marginBottom: '12px' }}>{formError}</div>}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={labelStyle}>Notice Type</label>
                    <select value={noticeForm.notice_type} onChange={e => { setNoticeForm(p => ({...p, notice_type: e.target.value})); setNoticePreview(null); }} style={inputStyle}>
                      <option value='pay_or_quit'>Pay or Quit / Notice to Vacate</option>
                      <option value='demand_letter'>Demand Letter</option>
                      <option value='eviction_notice'>Eviction Notice</option>
                      <option value='notice_to_vacate'>Notice to Vacate</option>
                      <option value='unlawful_detainer'>Unlawful Detainer</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Jurisdiction State</label>
                    <select value={noticeForm.jurisdiction_state} onChange={e => { setNoticeForm(p => ({...p, jurisdiction_state: e.target.value})); setNoticePreview(null); }} style={inputStyle}>
                      <option value=''>Select state...</option>
                      {['TX','OH','TN','MO','WA'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div style={{ gridColumn: '1/-1' }}>
                    <label style={labelStyle}>Generated By (Coordinator Name)</label>
                    <input value={noticeForm.generated_by} onChange={e => setNoticeForm(p => ({...p, generated_by: e.target.value}))} style={inputStyle} placeholder='Your name' />
                  </div>
                </div>
                {noticeForm.jurisdiction_state && noticeForm.notice_type && (
                  <div style={{ marginBottom: '12px' }}>
                    <button onClick={handleFetchPreview} disabled={previewLoading}
                      style={{ padding: '7px 14px', backgroundColor: '#dbeafe', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#1d4ed8', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                      {previewLoading ? 'Loading...' : '👁 Preview Notice Text'}
                    </button>
                  </div>
                )}
                {noticePreview && (
                  <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '14px', marginBottom: '14px', maxHeight: '240px', overflowY: 'auto', border: '1px solid #ffffff' }}>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#dc2626', marginBottom: '4px', textTransform: 'uppercase' }}>{noticePreview.title}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '10px' }}>{noticePreview.state_name} · {noticePreview.days > 0 ? `${noticePreview.days}-Day Notice` : 'Immediate'}</div>
                    {noticePreview.body_lines.map((line, i) => (
                      <div key={i} style={{ fontSize: '11px', color: line === '' ? 'transparent' : line.startsWith('TO:') || line.startsWith('PREMISES:') || line.startsWith('AMOUNT') || line.startsWith('TOTAL') || line.startsWith('IMPORTANT') ? '#1e293b' : '#94a3b8', marginBottom: line === '' ? '6px' : '2px', fontWeight: line.startsWith('TO:') || line.startsWith('PREMISES:') ? '600' : '400' }}>
                        {line || ' '}
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '10px 12px', marginBottom: '14px' }}>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>PDF will be generated, uploaded to storage, and opened in a new tab. A notice record is added to this case automatically.</div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={handleGenerateNotice} disabled={noticeGenerating} style={{ ...btnPrimary, backgroundColor: '#b45309' }}>{noticeGenerating ? 'Generating...' : 'Generate & Open PDF'}</button>
                  <button onClick={() => setShowNoticeForm(false)} style={btnSecondary}>Cancel</button>
                </div>
              </div>
            )}

            {/* Internal Notes Form */}
            {showNoteForm && (
              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', marginBottom: '20px', borderLeft: '4px solid #0f4c75' }}>
                <h3 style={{ margin: '0 0 14px', fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Add Internal Note</h3>
                {formError && <div style={{ color: '#dc2626', fontSize: '13px', marginBottom: '10px' }}>{formError}</div>}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <label style={labelStyle}>Author *</label>
                    <input value={noteForm.author} onChange={e => setNoteForm(p => ({...p, author: e.target.value}))} style={inputStyle} placeholder='Your name' />
                  </div>
                  <div>
                    <label style={labelStyle}>Note Type</label>
                    <select value={noteForm.note_type} onChange={e => setNoteForm(p => ({...p, note_type: e.target.value}))} style={inputStyle}>
                      <option value='general'>General</option>
                      <option value='attorney'>Attorney Instructions</option>
                      <option value='supervisor'>Supervisor Direction</option>
                      <option value='legal_strategy'>Legal Strategy</option>
                      <option value='other'>Other</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <label style={labelStyle}>Note *</label>
                  <textarea value={noteForm.note_text} onChange={e => setNoteForm(p => ({...p, note_text: e.target.value}))} rows={4}
                    style={{ ...inputStyle, resize: 'vertical' }} placeholder='Internal memo, attorney instructions, supervisor direction, legal strategy...' />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={handleAddNote} disabled={noteSubmitting} style={{ ...btnPrimary, backgroundColor: '#0f4c75' }}>{noteSubmitting ? 'Saving...' : 'Save Note'}</button>
                  <button onClick={() => { setShowNoteForm(false); setFormError(''); }} style={btnSecondary}>Cancel</button>
                </div>
              </div>
            )}

            {/* Touchpoints Log */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Contact Log ({(caseDetail.touchpoints || []).length})</h3>
              {(caseDetail.touchpoints || []).length === 0 ? (
                <div style={{ color: '#475569', fontSize: '13px' }}>No contacts logged yet.</div>
              ) : (caseDetail.touchpoints || []).map((t, i) => (
                <div key={i} style={{ padding: '12px', backgroundColor: '#ffffff', borderRadius: '8px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', backgroundColor: '#dbeafe', color: '#1d4ed8', padding: '2px 8px', borderRadius: '4px', fontWeight: '600', textTransform: 'uppercase' }}>{t.contact_method}</span>
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>{fmtStatus(t.outcome)}</span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#475569' }}>{fmtDate(t.contacted_at)}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>by {t.coordinator_name}</div>
                  {t.notes && <div style={{ fontSize: '13px', color: '#cbd5e1' }}>{t.notes}</div>}
                </div>
              ))}
            </div>

            {/* Payment Plans */}
            {(caseDetail.payment_plans || []).length > 0 && (
              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Payment Plans ({caseDetail.payment_plans.length})</h3>
                {caseDetail.payment_plans.map((plan, idx) => (
                  <div key={idx} style={{ padding: '14px', backgroundColor: '#ffffff', borderRadius: '8px', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>{fmtCurrency(plan.installment_amount)} / {plan.frequency}</span>
                        <span style={{ fontSize: '11px', color: '#475569', marginLeft: '10px' }}>Total: {fmtCurrency(plan.total_amount)}</span>
                      </div>
                      <span style={{ fontSize: '11px', padding: '2px 10px', borderRadius: '4px', backgroundColor: plan.status === 'active' ? '#1c3a2e' : plan.status === 'broken' ? '#3a1e1e' : '#ffffff', color: plan.status === 'active' ? '#15803d' : plan.status === 'broken' ? '#dc2626' : '#94a3b8', fontWeight: '600' }}>{fmtStatus(plan.status)}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#475569', marginBottom: '8px' }}>
                      Started {fmtDate(plan.start_date)} &nbsp;·&nbsp;
                      <span style={{ color: plan.missed_payments >= 2 ? '#dc2626' : plan.missed_payments === 1 ? '#ea580c' : '#475569', fontWeight: plan.missed_payments > 0 ? '700' : '400' }}>{plan.missed_payments} missed</span>
                    </div>
                    {plan.notes && <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>{plan.notes}</div>}
                    {Array.isArray(plan.payments) && plan.payments.filter(Boolean).length > 0 && (
                      <div style={{ marginBottom: '10px' }}>
                        {plan.payments.filter(Boolean).map((pay, pi) => (
                          <div key={pi} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 8px', backgroundColor: '#ffffff', borderRadius: '5px', marginBottom: '3px' }}>
                            <div style={{ fontSize: '11px', color: '#94a3b8' }}>{fmtDate(pay.due_date)} — {fmtCurrency(pay.amount)}</div>
                            <span style={{ fontSize: '10px', fontWeight: '700', color: pay.status === 'paid' ? '#15803d' : pay.status === 'missed' ? '#dc2626' : '#94a3b8' }}>
                              {pay.status === 'paid' ? '✓ Paid' : pay.status === 'missed' ? '✗ Missed' : fmtStatus(pay.status)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    {plan.status === 'active' && (
                      <div>
                        {logPaymentPlanId === plan.id ? (
                          <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '12px', marginTop: '6px', border: '1px solid #cbd5e1' }}>
                            <div style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a', marginBottom: '10px' }}>Log Payment</div>
                            {formError && <div style={{ color: '#dc2626', fontSize: '11px', marginBottom: '8px' }}>{formError}</div>}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                              <div>
                                <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '3px', textTransform: 'uppercase' }}>Status</div>
                                <select value={paymentLogForm.status} onChange={e => setPaymentLogForm(p => ({...p, status: e.target.value}))}
                                  style={{ width: '100%', padding: '7px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#1e293b', fontSize: '12px' }}>
                                  <option value='paid'>Paid</option>
                                  <option value='missed'>Missed</option>
                                  <option value='waived'>Waived</option>
                                </select>
                              </div>
                              <div>
                                <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '3px', textTransform: 'uppercase' }}>Amount ($)</div>
                                <input type='number' value={paymentLogForm.amount} onChange={e => setPaymentLogForm(p => ({...p, amount: e.target.value}))}
                                  placeholder={String(plan.installment_amount || '')}
                                  style={{ width: '100%', padding: '7px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#1e293b', fontSize: '12px', boxSizing: 'border-box' }} />
                              </div>
                              <div>
                                <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '3px', textTransform: 'uppercase' }}>Due Date</div>
                                <input type='date' value={paymentLogForm.due_date} onChange={e => setPaymentLogForm(p => ({...p, due_date: e.target.value}))}
                                  style={{ width: '100%', padding: '7px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#1e293b', fontSize: '12px', boxSizing: 'border-box' }} />
                              </div>
                              {paymentLogForm.status === 'paid' && (
                                <div>
                                  <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '3px', textTransform: 'uppercase' }}>Paid Date</div>
                                  <input type='date' value={paymentLogForm.paid_date} onChange={e => setPaymentLogForm(p => ({...p, paid_date: e.target.value}))}
                                    style={{ width: '100%', padding: '7px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#1e293b', fontSize: '12px', boxSizing: 'border-box' }} />
                                </div>
                              )}
                            </div>
                            <input value={paymentLogForm.notes} onChange={e => setPaymentLogForm(p => ({...p, notes: e.target.value}))}
                              placeholder='Notes (optional)' style={{ width: '100%', padding: '7px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#1e293b', fontSize: '12px', boxSizing: 'border-box', marginBottom: '10px' }} />
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button onClick={() => handleLogPayment(plan.id)} disabled={paymentLogSubmitting}
                                style={{ padding: '7px 16px', backgroundColor: paymentLogForm.status === 'paid' ? '#14B8A6' : '#dc2626', border: 'none', borderRadius: '6px', color: 'white', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                                {paymentLogSubmitting ? 'Saving...' : paymentLogForm.status === 'paid' ? '✓ Mark Paid' : paymentLogForm.status === 'missed' ? '✗ Mark Missed' : 'Save'}
                              </button>
                              <button onClick={() => { setLogPaymentPlanId(null); setFormError(''); }}
                                style={{ padding: '7px 12px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#94a3b8', fontSize: '12px', cursor: 'pointer' }}>Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <button onClick={() => { setLogPaymentPlanId(plan.id); setPaymentLogForm({ amount: String(plan.installment_amount || ''), due_date: new Date().toISOString().split('T')[0], paid_date: new Date().toISOString().split('T')[0], status: 'paid', notes: '' }); setFormError(''); }}
                            style={{ fontSize: '11px', padding: '5px 12px', backgroundColor: '#1c3a2e', border: '1px solid #15803d', borderRadius: '5px', color: '#15803d', cursor: 'pointer', fontWeight: '600' }}>
                            + Log Payment
                          </button>
                        )}
                      </div>
                    )}
                    {plan.missed_payments >= 2 && plan.status === 'active' && (
                      <div style={{ marginTop: '8px', padding: '6px 10px', backgroundColor: '#3a1e1e', borderRadius: '6px', fontSize: '11px', color: '#dc2626', fontWeight: '600' }}>
                        ⚠️ 2+ missed payments — plan will be marked broken on next missed log
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Notices */}
            {(caseDetail.notices || []).length > 0 && (
              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Notices ({caseDetail.notices.length})</h3>
                {caseDetail.notices.map((n, i) => (
                  <div key={i} style={{ padding: '12px', backgroundColor: '#ffffff', borderRadius: '8px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>{fmtStatus(n.notice_type)}</div>
                      <div style={{ fontSize: '11px', color: '#475569' }}>{n.jurisdiction_state} &nbsp;·&nbsp; Generated by {n.generated_by} &nbsp;·&nbsp; {fmtDate(n.created_at)}</div>
                    </div>
                    {n.pdf_url && <a href={n.pdf_url} target='_blank' rel='noreferrer' style={{ fontSize: '12px', color: '#14B8A6', textDecoration: 'none', fontWeight: '600' }}>View PDF</a>}
                  </div>
                ))}
              </div>
            )}

            {/* Internal Notes */}
            {(caseDetail.case_notes || []).length > 0 && (
              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', marginBottom: '20px', borderLeft: '4px solid #0f4c75' }}>
                <h3 style={{ margin: '0 0 14px', fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Internal Notes ({caseDetail.case_notes.length})</h3>
                {caseDetail.case_notes.map((note, i) => (
                  <div key={i} style={{ padding: '12px 14px', backgroundColor: '#ffffff', borderRadius: '8px', marginBottom: '8px', borderLeft: '3px solid #0f4c75' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#0f4c75', color: '#93c5fd', fontWeight: '700', textTransform: 'uppercase' }}>
                          {note.note_type === 'attorney' ? '⚖️ Attorney' : note.note_type === 'supervisor' ? '👤 Supervisor' : note.note_type === 'legal_strategy' ? '📋 Legal Strategy' : '📝 ' + (note.note_type || 'General')}
                        </span>
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>by {note.author}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', color: '#cbd5e1' }}>{new Date(note.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <button onClick={() => handleDeleteNote(note.id)}
                          style={{ fontSize: '10px', padding: '2px 8px', backgroundColor: '#3a1e1e', border: 'none', borderRadius: '4px', color: '#dc2626', cursor: 'pointer' }}>
                          Delete
                        </button>
                      </div>
                    </div>
                    <div style={{ fontSize: '13px', color: '#1e293b', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{note.note_text}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Documents */}
            {(caseDetail.documents || []).length > 0 && (
              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Documents ({caseDetail.documents.length})</h3>
                {caseDetail.documents.map((d, i) => (
                  <div key={i} style={{ padding: '12px', backgroundColor: '#ffffff', borderRadius: '8px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>{d.file_name}</div>
                      <div style={{ fontSize: '11px', color: '#475569' }}>{fmtStatus(d.document_type)} &nbsp;·&nbsp; {d.uploaded_by} &nbsp;·&nbsp; {fmtDate(d.created_at)}</div>
                    </div>
                    <a href={d.file_url} target='_blank' rel='noreferrer' style={{ fontSize: '12px', color: '#14B8A6', textDecoration: 'none', fontWeight: '600' }}>Open</a>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* NEW CASE MODAL */}
      {showNewCase && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '28px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>New Collections Case</h2>
            {formError && <div style={{ color: '#dc2626', fontSize: '13px', marginBottom: '14px', padding: '10px', backgroundColor: '#3a1e1e', borderRadius: '7px' }}>{formError}</div>}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={labelStyle}>Property *</label>
                <select value={newCase.property_id} onChange={e => setNewCase(p => ({...p, property_id: e.target.value}))} style={inputStyle}>
                  <option value=''>Select property...</option>
                  {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Resident Name *</label>
                <input value={newCase.resident_name} onChange={e => setNewCase(p => ({...p, resident_name: e.target.value}))} style={inputStyle} placeholder='Last name or full name' />
              </div>
              <div>
                <label style={labelStyle}>Unit Number *</label>
                <input value={newCase.unit_number} onChange={e => setNewCase(p => ({...p, unit_number: e.target.value}))} style={inputStyle} placeholder='e.g. 247' />
              </div>
              <div>
                <label style={labelStyle}>Balance Owed ($) *</label>
                <input type='number' value={newCase.balance_owed} onChange={e => setNewCase(p => ({...p, balance_owed: e.target.value}))} style={inputStyle} placeholder='0.00' />
              </div>
              <div>
                <label style={labelStyle}>Aging Bucket</label>
                <select value={newCase.aging_bucket} onChange={e => setNewCase(p => ({...p, aging_bucket: e.target.value}))} style={inputStyle}>
                  {AGING_OPTIONS.map(a => <option key={a} value={a}>{a} Days</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Times Late</label>
                <input type='number' value={newCase.times_late} onChange={e => setNewCase(p => ({...p, times_late: e.target.value}))} style={inputStyle} placeholder='0' />
              </div>
              <div>
                <label style={labelStyle}>Status</label>
                <select value={newCase.status} onChange={e => setNewCase(p => ({...p, status: e.target.value}))} style={inputStyle}>
                  {STATUS_PIPELINE.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Attorney Name</label>
                <input value={newCase.attorney_name} onChange={e => setNewCase(p => ({...p, attorney_name: e.target.value}))} style={inputStyle} placeholder='Optional' />
              </div>
              <div>
                <label style={labelStyle}>Notice Issued Date</label>
                <input type='date' value={newCase.notice_issued_date} onChange={e => setNewCase(p => ({...p, notice_issued_date: e.target.value}))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>FED Date</label>
                <input type='date' value={newCase.fed_date} onChange={e => setNewCase(p => ({...p, fed_date: e.target.value}))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Writ File Date</label>
                <input type='date' value={newCase.writ_file_date} onChange={e => setNewCase(p => ({...p, writ_file_date: e.target.value}))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Court Hearing Date</label>
                <input type='date' value={newCase.court_hearing_date} onChange={e => setNewCase(p => ({...p, court_hearing_date: e.target.value}))} style={inputStyle} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={handleCreateCase} disabled={submitting} style={btnPrimary}>{submitting ? 'Creating...' : 'Create Case'}</button>
              <button onClick={() => { setShowNewCase(false); setFormError(''); }} style={btnSecondary}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// ── End Collections Cases Tab ──────────────────────────────────────────────────

// ── Collections Reports Tab ────────────────────────────────────────────────────
function CollectionsReportsTab({ token, onBack }) {
  const [activeReport, setActiveReport] = useState('portfolio_summary');
  const [reportData, setReportData] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filterProperty, setFilterProperty] = useState('');
  const [filterState, setFilterState] = useState('');
  const [filterStart, setFilterStart] = useState('');
  const [filterEnd, setFilterEnd] = useState('');

  const REPORTS = [
    { key: 'portfolio_summary',     label: 'Portfolio Summary',       endpoint: '/reports/portfolio-summary',     description: 'All properties with case counts and balance by aging bucket' },
    { key: 'aging',                 label: 'Delinquency Aging',       endpoint: '/reports/aging',                 description: 'All residents by 30/60/90/120+ day aging bucket' },
    { key: 'pipeline',              label: 'Collections Pipeline',    endpoint: '/reports/pipeline',              description: 'Active cases by legal stage with days in system' },
    { key: 'attorney_referrals',    label: 'Attorney Referrals',      endpoint: '/reports/attorney-referrals',    description: 'Cases in legal pipeline with all key dates' },
    { key: 'payment_plans',         label: 'Payment Plan Performance',endpoint: '/reports/payment-plans',         description: 'All plans with payments made, missed, and amount collected' },
    { key: 'coordinator_activity',  label: 'Coordinator Activity',    endpoint: '/reports/coordinator-activity',  description: 'Touchpoints per coordinator with method and outcome breakdown' },
  ];

  const fmtCurrency = (v) => '$' + Number(v || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
  const fmtStatus = (s) => (s || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const fmtNum = (v) => Number(v || 0).toLocaleString();

  const fetchReport = async (key) => {
    const report = REPORTS.find(r => r.key === key);
    if (!report) return;
    setLoading(true); setError(''); setReportData(null);
    try {
      let url = `${API_URL}/api/collections${report.endpoint}?`;
      if (filterProperty) url += `property_id=${filterProperty}&`;
      if (filterState)    url += `state=${filterState}&`;
      if (filterStart)    url += `start_date=${filterStart}&`;
      if (filterEnd)      url += `end_date=${filterEnd}&`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to load report');
      setReportData(json);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetch(`${API_URL}/api/properties`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(rows => setProperties(Array.isArray(rows) ? rows : [])).catch(() => {});
    fetchReport(activeReport);
  }, [token]);

  const handleRunReport = () => fetchReport(activeReport);

  const handleExportCSV = () => {
    if (!reportData || !reportData.rows || reportData.rows.length === 0) return;
    const headers = Object.keys(reportData.rows[0]);
    const csvRows = [
      headers.join(','),
      ...reportData.rows.map(row =>
        headers.map(h => {
          const val = row[h] == null ? '' : String(row[h]);
          return val.includes(',') || val.includes('"') ? `"${val.replace(/"/g, '""')}"` : val;
        }).join(',')
      )
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `servfixy_collections_${activeReport}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const inputStyle = { padding: '8px 12px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '7px', color: '#1e293b', fontSize: '13px' };

  // ── Report Renderers ──────────────────────────────────────────────────────────

  const renderPortfolioSummary = (rows) => (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr style={{ backgroundColor: '#ffffff' }}>
            {['Property', 'State', 'Total Cases', 'Total Balance', '30-60', '61-90', '91-120', '120+', 'Notices', 'Legal', 'Possession', 'Active'].map(h => (
              <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: '#94a3b8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap', borderBottom: '1px solid #ffffff' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #ffffff', backgroundColor: i % 2 === 0 ? 'transparent' : '#ffffff11' }}>
              <td style={{ padding: '10px 12px', color: '#0f172a', fontWeight: '600' }}>{row.property_name}</td>
              <td style={{ padding: '10px 12px', color: '#94a3b8' }}>{row.state}</td>
              <td style={{ padding: '10px 12px', color: '#1e293b', textAlign: 'center' }}>{fmtNum(row.total_cases)}</td>
              <td style={{ padding: '10px 12px', color: '#dc2626', fontWeight: '700' }}>{fmtCurrency(row.total_balance)}</td>
              <td style={{ padding: '10px 12px', color: '#facc15', textAlign: 'center' }}>{row.bucket_30_60 || 0}</td>
              <td style={{ padding: '10px 12px', color: '#ea580c', textAlign: 'center' }}>{row.bucket_61_90 || 0}</td>
              <td style={{ padding: '10px 12px', color: '#dc2626', textAlign: 'center' }}>{row.bucket_91_120 || 0}</td>
              <td style={{ padding: '10px 12px', color: '#dc2626', textAlign: 'center' }}>{row.bucket_120_plus || 0}</td>
              <td style={{ padding: '10px 12px', color: '#94a3b8', textAlign: 'center' }}>{row.notices_issued || 0}</td>
              <td style={{ padding: '10px 12px', color: '#7c3aed', textAlign: 'center' }}>{row.legal_pipeline || 0}</td>
              <td style={{ padding: '10px 12px', color: '#15803d', textAlign: 'center' }}>{row.possession_granted || 0}</td>
              <td style={{ padding: '10px 12px', color: '#1d4ed8', textAlign: 'center' }}>{row.active || 0}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={{ backgroundColor: '#ffffff', borderTop: '2px solid #cbd5e1' }}>
            <td style={{ padding: '10px 12px', color: '#0f172a', fontWeight: '700' }}>TOTAL</td>
            <td style={{ padding: '10px 12px' }}></td>
            <td style={{ padding: '10px 12px', color: '#1e293b', fontWeight: '700', textAlign: 'center' }}>{fmtNum(rows.reduce((s, r) => s + Number(r.total_cases || 0), 0))}</td>
            <td style={{ padding: '10px 12px', color: '#dc2626', fontWeight: '800' }}>{fmtCurrency(rows.reduce((s, r) => s + Number(r.total_balance || 0), 0))}</td>
            <td style={{ padding: '10px 12px', color: '#facc15', fontWeight: '700', textAlign: 'center' }}>{rows.reduce((s, r) => s + Number(r.bucket_30_60 || 0), 0)}</td>
            <td style={{ padding: '10px 12px', color: '#ea580c', fontWeight: '700', textAlign: 'center' }}>{rows.reduce((s, r) => s + Number(r.bucket_61_90 || 0), 0)}</td>
            <td style={{ padding: '10px 12px', color: '#dc2626', fontWeight: '700', textAlign: 'center' }}>{rows.reduce((s, r) => s + Number(r.bucket_91_120 || 0), 0)}</td>
            <td style={{ padding: '10px 12px', color: '#dc2626', fontWeight: '700', textAlign: 'center' }}>{rows.reduce((s, r) => s + Number(r.bucket_120_plus || 0), 0)}</td>
            <td colSpan={4}></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );

  const renderAging = (rows) => (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr style={{ backgroundColor: '#ffffff' }}>
            {['Resident', 'Unit', 'Property', 'State', 'Balance', 'Aging', 'Status', 'Times Late', 'Case Opened'].map(h => (
              <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: '#94a3b8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap', borderBottom: '1px solid #ffffff' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #ffffff' }}>
              <td style={{ padding: '10px 12px', color: '#0f172a', fontWeight: '600' }}>{row.resident_name}</td>
              <td style={{ padding: '10px 12px', color: '#94a3b8' }}>{row.unit_number}</td>
              <td style={{ padding: '10px 12px', color: '#cbd5e1' }}>{row.property_name}</td>
              <td style={{ padding: '10px 12px', color: '#94a3b8' }}>{row.state}</td>
              <td style={{ padding: '10px 12px', color: '#dc2626', fontWeight: '700' }}>{fmtCurrency(row.balance_owed)}</td>
              <td style={{ padding: '10px 12px' }}><span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#ffffff', color: { '30-60': '#facc15', '61-90': '#ea580c', '91-120': '#dc2626', '120+': '#dc2626' }[row.aging_bucket] || '#94a3b8', fontWeight: '700' }}>{row.aging_bucket}</span></td>
              <td style={{ padding: '10px 12px', color: '#94a3b8', fontSize: '12px' }}>{fmtStatus(row.status)}</td>
              <td style={{ padding: '10px 12px', color: '#94a3b8', textAlign: 'center' }}>{row.times_late || 0}</td>
              <td style={{ padding: '10px 12px', color: '#94a3b8', fontSize: '12px' }}>{fmtDate(row.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderPipeline = (rows) => (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr style={{ backgroundColor: '#ffffff' }}>
            {['Resident', 'Unit', 'Property', 'State', 'Balance', 'Status', 'Aging', 'Attorney', 'Court Date', 'Days Open'].map(h => (
              <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: '#94a3b8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap', borderBottom: '1px solid #ffffff' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #ffffff' }}>
              <td style={{ padding: '10px 12px', color: '#0f172a', fontWeight: '600' }}>{row.resident_name}</td>
              <td style={{ padding: '10px 12px', color: '#94a3b8' }}>{row.unit_number}</td>
              <td style={{ padding: '10px 12px', color: '#cbd5e1' }}>{row.property_name}</td>
              <td style={{ padding: '10px 12px', color: '#94a3b8' }}>{row.state}</td>
              <td style={{ padding: '10px 12px', color: '#dc2626', fontWeight: '700' }}>{fmtCurrency(row.balance_owed)}</td>
              <td style={{ padding: '10px 12px', color: '#1d4ed8', fontSize: '12px' }}>{fmtStatus(row.status)}</td>
              <td style={{ padding: '10px 12px', color: '#facc15', fontSize: '12px' }}>{row.aging_bucket}</td>
              <td style={{ padding: '10px 12px', color: '#94a3b8' }}>{row.attorney_name || '—'}</td>
              <td style={{ padding: '10px 12px', color: '#7c3aed', fontSize: '12px' }}>{fmtDate(row.court_hearing_date)}</td>
              <td style={{ padding: '10px 12px', color: '#ea580c', fontWeight: '700', textAlign: 'center' }}>{Math.round(row.days_in_system || 0)}d</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderAttorneyReferrals = (rows) => (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr style={{ backgroundColor: '#ffffff' }}>
            {['Resident', 'Unit', 'Property', 'Balance', 'Attorney', 'Notice', 'FED', 'Writ', 'Hearing', 'Possession', 'Status'].map(h => (
              <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: '#94a3b8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap', borderBottom: '1px solid #ffffff' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #ffffff' }}>
              <td style={{ padding: '10px 12px', color: '#0f172a', fontWeight: '600' }}>{row.resident_name}</td>
              <td style={{ padding: '10px 12px', color: '#94a3b8' }}>{row.unit_number}</td>
              <td style={{ padding: '10px 12px', color: '#cbd5e1' }}>{row.property_name}</td>
              <td style={{ padding: '10px 12px', color: '#dc2626', fontWeight: '700' }}>{fmtCurrency(row.balance_owed)}</td>
              <td style={{ padding: '10px 12px', color: '#94a3b8' }}>{row.attorney_name || '—'}</td>
              <td style={{ padding: '10px 12px', color: '#94a3b8', fontSize: '12px' }}>{fmtDate(row.notice_issued_date)}</td>
              <td style={{ padding: '10px 12px', color: '#94a3b8', fontSize: '12px' }}>{fmtDate(row.fed_date)}</td>
              <td style={{ padding: '10px 12px', color: '#94a3b8', fontSize: '12px' }}>{fmtDate(row.writ_file_date)}</td>
              <td style={{ padding: '10px 12px', color: '#7c3aed', fontSize: '12px' }}>{fmtDate(row.court_hearing_date)}</td>
              <td style={{ padding: '10px 12px', color: '#15803d', fontSize: '12px' }}>{fmtDate(row.possession_granted_date)}</td>
              <td style={{ padding: '10px 12px', color: '#1d4ed8', fontSize: '12px' }}>{fmtStatus(row.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderPaymentPlans = (rows) => (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr style={{ backgroundColor: '#ffffff' }}>
            {['Resident', 'Unit', 'Property', 'Total Owed', 'Installment', 'Frequency', 'Start', 'Status', 'Paid', 'Missed', 'Collected'].map(h => (
              <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: '#94a3b8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap', borderBottom: '1px solid #ffffff' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #ffffff' }}>
              <td style={{ padding: '10px 12px', color: '#0f172a', fontWeight: '600' }}>{row.resident_name}</td>
              <td style={{ padding: '10px 12px', color: '#94a3b8' }}>{row.unit_number}</td>
              <td style={{ padding: '10px 12px', color: '#cbd5e1' }}>{row.property_name}</td>
              <td style={{ padding: '10px 12px', color: '#dc2626', fontWeight: '700' }}>{fmtCurrency(row.total_amount)}</td>
              <td style={{ padding: '10px 12px', color: '#1e293b' }}>{fmtCurrency(row.installment_amount)}</td>
              <td style={{ padding: '10px 12px', color: '#94a3b8' }}>{fmtStatus(row.frequency)}</td>
              <td style={{ padding: '10px 12px', color: '#94a3b8', fontSize: '12px' }}>{fmtDate(row.start_date)}</td>
              <td style={{ padding: '10px 12px' }}><span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', backgroundColor: row.status === 'active' ? '#1c3a2e' : row.status === 'broken' ? '#3a1e1e' : '#ffffff', color: row.status === 'active' ? '#15803d' : row.status === 'broken' ? '#dc2626' : '#94a3b8', fontWeight: '700' }}>{fmtStatus(row.status)}</span></td>
              <td style={{ padding: '10px 12px', color: '#15803d', fontWeight: '700', textAlign: 'center' }}>{row.payments_made || 0}</td>
              <td style={{ padding: '10px 12px', color: '#dc2626', fontWeight: '700', textAlign: 'center' }}>{row.payments_missed || 0}</td>
              <td style={{ padding: '10px 12px', color: '#14B8A6', fontWeight: '700' }}>{fmtCurrency(row.amount_collected)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={{ backgroundColor: '#ffffff', borderTop: '2px solid #cbd5e1' }}>
            <td colSpan={3} style={{ padding: '10px 12px', color: '#0f172a', fontWeight: '700' }}>TOTAL</td>
            <td style={{ padding: '10px 12px', color: '#dc2626', fontWeight: '800' }}>{fmtCurrency(rows.reduce((s, r) => s + Number(r.total_amount || 0), 0))}</td>
            <td colSpan={5}></td>
            <td style={{ padding: '10px 12px', color: '#dc2626', fontWeight: '700', textAlign: 'center' }}>{rows.reduce((s, r) => s + Number(r.payments_missed || 0), 0)}</td>
            <td style={{ padding: '10px 12px', color: '#14B8A6', fontWeight: '800' }}>{fmtCurrency(rows.reduce((s, r) => s + Number(r.amount_collected || 0), 0))}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );

  const renderCoordinatorActivity = (rows) => (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr style={{ backgroundColor: '#ffffff' }}>
            {['Coordinator', 'Total Touchpoints', 'Calls', 'Texts', 'Emails', 'Payment Promises', 'Payments Received'].map(h => (
              <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: '#94a3b8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap', borderBottom: '1px solid #ffffff' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #ffffff' }}>
              <td style={{ padding: '10px 12px', color: '#0f172a', fontWeight: '700' }}>{row.coordinator_name}</td>
              <td style={{ padding: '10px 12px', color: '#14B8A6', fontWeight: '800', textAlign: 'center' }}>{fmtNum(row.total_touchpoints)}</td>
              <td style={{ padding: '10px 12px', color: '#1d4ed8', textAlign: 'center' }}>{fmtNum(row.calls)}</td>
              <td style={{ padding: '10px 12px', color: '#a78bfa', textAlign: 'center' }}>{fmtNum(row.texts)}</td>
              <td style={{ padding: '10px 12px', color: '#34d399', textAlign: 'center' }}>{fmtNum(row.emails)}</td>
              <td style={{ padding: '10px 12px', color: '#facc15', textAlign: 'center' }}>{fmtNum(row.payment_promises)}</td>
              <td style={{ padding: '10px 12px', color: '#15803d', fontWeight: '700', textAlign: 'center' }}>{fmtNum(row.payments_received)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderReport = () => {
    if (!reportData || !reportData.rows) return null;
    const rows = reportData.rows;
    if (rows.length === 0) return <div style={{ padding: '32px', textAlign: 'center', color: '#475569', fontSize: '14px' }}>No data found for the selected filters.</div>;
    switch (activeReport) {
      case 'portfolio_summary':    return renderPortfolioSummary(rows);
      case 'aging':                return renderAging(rows);
      case 'pipeline':             return renderPipeline(rows);
      case 'attorney_referrals':   return renderAttorneyReferrals(rows);
      case 'payment_plans':        return renderPaymentPlans(rows);
      case 'coordinator_activity': return renderCoordinatorActivity(rows);
      default: return null;
    }
  };

  const activeReportMeta = REPORTS.find(r => r.key === activeReport);
  const showPropertyFilter  = ['aging', 'pipeline', 'portfolio_summary'].includes(activeReport);
  const showStateFilter     = activeReport === 'aging';
  const showDateFilter      = activeReport === 'coordinator_activity';

  return (
    <div style={{ padding: '24px', fontFamily: 'Arial, sans-serif', backgroundColor: '#ffffff', minHeight: '100vh', color: '#1e293b' }}>

      {/* Header */}
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
        {onBack && (
          <button onClick={onBack}
            style={{ marginTop: '4px', padding: '6px 12px', backgroundColor: '#1B3A6B', border: '1px solid #14B8A6', borderRadius: '6px', color: '#14B8A6', fontSize: '12px', fontWeight: '600', cursor: 'pointer', flexShrink: 0 }}>
            ← Analytics
          </button>
        )}
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: '700', color: '#0f172a' }}>Collections Reports</h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>On-demand reporting across your portfolio. Export any report to CSV.</p>
        </div>
      </div>

      {/* Report Selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px', marginBottom: '24px' }}>
        {REPORTS.map(r => (
          <button key={r.key} onClick={() => { setActiveReport(r.key); setReportData(null); setError(''); }}
            style={{ padding: '14px 16px', backgroundColor: activeReport === r.key ? '#1B3A6B' : '#ffffff', border: activeReport === r.key ? '2px solid #14B8A6' : '2px solid #cbd5e1', borderRadius: '10px', color: activeReport === r.key ? '#14B8A6' : '#94a3b8', fontSize: '13px', fontWeight: activeReport === r.key ? '700' : '400', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
            {r.label}
          </button>
        ))}
      </div>

      {/* Filters + Run */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'flex-end' }}>
        <div style={{ flex: 1, minWidth: '160px' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Report</div>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>{activeReportMeta?.label}</div>
          <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>{activeReportMeta?.description}</div>
        </div>
        {showPropertyFilter && (
          <div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Property</div>
            <select value={filterProperty} onChange={e => setFilterProperty(e.target.value)} style={{ ...inputStyle, minWidth: '160px' }}>
              <option value=''>All Properties</option>
              {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        )}
        {showStateFilter && (
          <div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>State</div>
            <select value={filterState} onChange={e => setFilterState(e.target.value)} style={{ ...inputStyle }}>
              <option value=''>All States</option>
              {['TX','OH','TN','MO','WA'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        )}
        {showDateFilter && (
          <>
            <div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Start Date</div>
              <input type='date' value={filterStart} onChange={e => setFilterStart(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>End Date</div>
              <input type='date' value={filterEnd} onChange={e => setFilterEnd(e.target.value)} style={inputStyle} />
            </div>
          </>
        )}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleRunReport} disabled={loading}
            style={{ padding: '9px 20px', backgroundColor: '#14B8A6', border: 'none', borderRadius: '7px', color: 'white', fontSize: '13px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Running...' : 'Run Report'}
          </button>
          {reportData && reportData.rows && reportData.rows.length > 0 && (
            <button onClick={handleExportCSV}
              style={{ padding: '9px 16px', backgroundColor: '#dbeafe', border: '1px solid #cbd5e1', borderRadius: '7px', color: '#1d4ed8', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
              Export CSV
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', overflow: 'hidden' }}>
        {/* Report Meta Bar */}
        {reportData && (
          <div style={{ padding: '12px 20px', backgroundColor: '#ffffff', borderBottom: '1px solid #ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#94a3b8' }}>
              {reportData.rows?.length || 0} rows &nbsp;·&nbsp; Generated {new Date(reportData.generated_at).toLocaleString()}
            </span>
            <span style={{ fontSize: '12px', color: '#cbd5e1' }}>Servfixy Collections</span>
          </div>
        )}

        {error && <div style={{ padding: '24px', color: '#dc2626', fontSize: '13px' }}>{error}</div>}
        {loading && <div style={{ padding: '40px', textAlign: 'center', color: '#475569', fontSize: '13px' }}>Running report...</div>}
        {!loading && !error && !reportData && (
          <div style={{ padding: '48px', textAlign: 'center', color: '#cbd5e1' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>📊</div>
            <div style={{ fontSize: '15px', fontWeight: '600', color: '#475569' }}>Select a report and click Run</div>
          </div>
        )}
        {!loading && !error && reportData && renderReport()}
      </div>

    </div>
  );
}
// ── End Collections Reports Tab ────────────────────────────────────────────────

// ── Collections Coordinator Workspace ─────────────────────────────────────────
function CollectionsWorkspaceTab({ token }) {
  const [coordinator, setCoordinator] = useState('');
  const [coordinatorInput, setCoordinatorInput] = useState('');
  const [myCases, setMyCases] = useState([]);
  const [allCoordinators, setAllCoordinators] = useState([]);
  const [taskQueue, setTaskQueue] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [caseDetail, setCaseDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [quickNoteForm, setQuickNoteForm] = useState({ contact_method: 'call', outcome: 'left_voicemail', notes: '' });
  const [quickSubmitting, setQuickSubmitting] = useState(false);
  const [quickError, setQuickError] = useState('');
  const [view, setView] = useState('queue'); // queue | all
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mobileView, setMobileView] = useState('queue'); // queue | detail

  React.useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const AGING_COLORS  = { '30-60': '#facc15', '61-90': '#ea580c', '91-120': '#dc2626', '120+': '#dc2626' };
  const URGENCY_COLOR = (days) => days >= 7 ? '#dc2626' : days >= 3 ? '#ea580c' : '#facc15';
  const fmtCurrency   = (v) => '$' + Number(v || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtStatus     = (s) => (s || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const fmtDate       = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  const fetchWorkspace = async (name) => {
    if (!name) return;
    setLoading(true);
    try {
      // Pull all cases assigned to or last touched by this coordinator
      const res = await fetch(`${API_URL}/api/collections/cases`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const allCases = await res.json();
      if (!Array.isArray(allCases)) throw new Error('Failed to load cases');

      // Also pull touchpoints to find cases this coordinator has worked
      const touchRes = await fetch(`${API_URL}/api/collections/reports/coordinator-activity?start_date=2000-01-01`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const touchData = await touchRes.json();
      const coordinatorList = (touchData.rows || []).map(r => r.coordinator_name);
      setAllCoordinators([...new Set(coordinatorList)]);

      // Filter to active cases not yet closed
      const activeCases = allCases.filter(c => !['closed_paid', 'closed_written_off'].includes(c.status));

      // Build task queue — cases needing attention (no recent contact)
      // We'll fetch last touchpoint per case via case detail in background
      // For now sort by aging bucket severity + balance
      const agingRank = { '120+': 4, '91-120': 3, '61-90': 2, '30-60': 1 };
      const sorted = [...activeCases].sort((a, b) => {
        const ageDiff = (agingRank[b.aging_bucket] || 0) - (agingRank[a.aging_bucket] || 0);
        if (ageDiff !== 0) return ageDiff;
        return Number(b.balance_owed) - Number(a.balance_owed);
      });

      setMyCases(sorted);

      // Build task queue — top 10 most urgent
      const queue = sorted.slice(0, 10).map(c => ({
        ...c,
        urgency_reason: agingRank[c.aging_bucket] >= 3 ? 'High aging bucket' : Number(c.balance_owed) > 2000 ? 'High balance' : 'Needs follow-up'
      }));
      setTaskQueue(queue);

      // Stats
      setStats({
        total_active: activeCases.length,
        high_priority: activeCases.filter(c => ['91-120', '120+'].includes(c.aging_bucket)).length,
        in_legal: activeCases.filter(c => ['filed_with_attorney', 'fed', 'writ_filed', 'hearing_scheduled', 'possession_granted'].includes(c.status)).length,
        total_balance: activeCases.reduce((s, c) => s + Number(c.balance_owed || 0), 0),
        notices_pending: activeCases.filter(c => c.status === 'active' && ['91-120', '120+'].includes(c.aging_bucket)).length,
      });

    } catch (err) {
      console.error('workspace fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCaseDetail = async (id) => {
    setDetailLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/collections/cases/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      setCaseDetail(json);
    } catch (err) { console.error(err); }
    finally { setDetailLoading(false); }
  };

  const handleSelectCase = (c) => {
    setSelectedCase(c);
    setCaseDetail(null);
    setQuickError('');
    fetchCaseDetail(c.id);
  };

  const handleQuickLog = async () => {
    if (!coordinator) { setQuickError('Set your name at the top first.'); return; }
    if (!quickNoteForm.notes) { setQuickError('Notes are required.'); return; }
    setQuickSubmitting(true); setQuickError('');
    try {
      const res = await fetch(`${API_URL}/api/collections/cases/${selectedCase.id}/touchpoints`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...quickNoteForm, coordinator_name: coordinator, contacted_at: new Date().toISOString() })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setQuickNoteForm({ contact_method: 'call', outcome: 'left_voicemail', notes: '' });
      fetchCaseDetail(selectedCase.id);
    } catch (err) { setQuickError(err.message); }
    finally { setQuickSubmitting(false); }
  };

  const handleAdvanceStatus = async (newStatus) => {
    try {
      const res = await fetch(`${API_URL}/api/collections/cases/${selectedCase.id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setSelectedCase(json);
      fetchCaseDetail(selectedCase.id);
      fetchWorkspace(coordinator);
    } catch (err) { alert('Status update failed: ' + err.message); }
  };

  useEffect(() => {
    // Try to restore coordinator name from localStorage
    const saved = localStorage.getItem('collections_coordinator_name');
    if (saved) { setCoordinator(saved); setCoordinatorInput(saved); fetchWorkspace(saved); }
  }, [token]);

  const handleSetCoordinator = () => {
    const name = coordinatorInput.trim();
    if (!name) return;
    setCoordinator(name);
    localStorage.setItem('collections_coordinator_name', name);
    fetchWorkspace(name);
  };

  const inputStyle  = { padding: '8px 12px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '7px', color: '#1e293b', fontSize: '13px', width: '100%', boxSizing: 'border-box' };
  const btnPrimary  = { padding: '8px 16px', backgroundColor: '#14B8A6', border: 'none', borderRadius: '7px', color: 'white', fontSize: '13px', fontWeight: '600', cursor: 'pointer' };
  const btnSmall    = { padding: '5px 12px', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' };

  const STATUS_PIPELINE = [
    { key: 'active', label: 'Active', color: '#1d4ed8' },
    { key: 'notice_issued', label: 'Notice Issued', color: '#facc15' },
    { key: 'filed_with_attorney', label: 'Filed w/ Attorney', color: '#ea580c' },
    { key: 'fed', label: 'FED', color: '#f97316' },
    { key: 'writ_filed', label: 'Writ Filed', color: '#dc2626' },
    { key: 'hearing_scheduled', label: 'Hearing Scheduled', color: '#7c3aed' },
    { key: 'possession_granted', label: 'Possession Granted', color: '#15803d' },
    { key: 'closed_paid', label: 'Closed - Paid', color: '#34d399' },
    { key: 'closed_written_off', label: 'Closed - Written Off', color: '#94a3b8' },
  ];

  // ── Coordinator not set ───────────────────────────────────────────────────────
  if (!coordinator) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '420px', textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '16px' }}>👤</div>
        <h2 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>Collections Workspace</h2>
        <p style={{ margin: '0 0 28px', fontSize: '13px', color: '#94a3b8' }}>Enter your name to load your task queue and case assignments.</p>
        <input
          value={coordinatorInput}
          onChange={e => setCoordinatorInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSetCoordinator()}
          placeholder='Your full name'
          style={{ ...inputStyle, marginBottom: '14px', padding: '12px 16px', fontSize: '15px', textAlign: 'center' }}
        />
        {allCoordinators.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', color: '#475569', marginBottom: '8px', textTransform: 'uppercase' }}>Recent coordinators</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' }}>
              {allCoordinators.map(n => (
                <button key={n} onClick={() => { setCoordinatorInput(n); }}
                  style={{ ...btnSmall, backgroundColor: '#dbeafe', color: '#1d4ed8' }}>{n}</button>
              ))}
            </div>
          </div>
        )}
        <button onClick={handleSetCoordinator} style={{ ...btnPrimary, width: '100%', padding: '12px', fontSize: '15px' }}>Enter Workspace</button>
      </div>
    </div>
  );

  // ── Mobile Layout ─────────────────────────────────────────────────────────────
  if (isMobile) return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
      {/* Mobile Header */}
      <div style={{ backgroundColor: '#ffffff', padding: '12px 16px', borderBottom: '1px solid #ffffff', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#475569', textTransform: 'uppercase' }}>Coordinator</div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: '#14B8A6' }}>{coordinator}</div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {stats && <div style={{ fontSize: '12px', color: '#dc2626', fontWeight: '700' }}>{stats.total_active} active</div>}
            <button onClick={() => { setCoordinator(''); setCoordinatorInput(''); setMyCases([]); setStats(null); setSelectedCase(null); }}
              style={{ fontSize: '11px', padding: '4px 10px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '5px', color: '#94a3b8', cursor: 'pointer' }}>Switch</button>
          </div>
        </div>
        {stats && (
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            {[
              { label: 'Active', value: stats.total_active, color: '#1d4ed8' },
              { label: 'Priority', value: stats.high_priority, color: '#dc2626' },
              { label: 'Legal', value: stats.in_legal, color: '#7c3aed' },
            ].map((k, i) => (
              <div key={i} style={{ flex: 1, backgroundColor: '#ffffff', borderRadius: '6px', padding: '6px', textAlign: 'center' }}>
                <div style={{ fontSize: '16px', fontWeight: '800', color: k.color }}>{k.value}</div>
                <div style={{ fontSize: '10px', color: '#475569' }}>{k.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile View Toggle */}
      {selectedCase && (
        <div style={{ display: 'flex', backgroundColor: '#ffffff', borderBottom: '1px solid #ffffff', flexShrink: 0 }}>
          <button onClick={() => setMobileView('queue')}
            style={{ flex: 1, padding: '10px', backgroundColor: mobileView === 'queue' ? '#ffffff' : 'transparent', border: 'none', borderBottom: mobileView === 'queue' ? '2px solid #14B8A6' : '2px solid transparent', color: mobileView === 'queue' ? '#14B8A6' : '#475569', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
            ← Queue
          </button>
          <button onClick={() => setMobileView('detail')}
            style={{ flex: 1, padding: '10px', backgroundColor: mobileView === 'detail' ? '#ffffff' : 'transparent', border: 'none', borderBottom: mobileView === 'detail' ? '2px solid #14B8A6' : '2px solid transparent', color: mobileView === 'detail' ? '#14B8A6' : '#475569', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
            Case Detail →
          </button>
        </div>
      )}

      {/* Mobile Queue */}
      {(mobileView === 'queue' || !selectedCase) && (
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #ffffff' }}>
            {[{ key: 'queue', label: `Queue (${taskQueue.length})` }, { key: 'all', label: `All (${myCases.length})` }].map(v => (
              <button key={v.key} onClick={() => setView(v.key)}
                style={{ flex: 1, padding: '8px', backgroundColor: view === v.key ? '#ffffff' : 'transparent', border: 'none', borderBottom: view === v.key ? '2px solid #14B8A6' : '2px solid transparent', color: view === v.key ? '#14B8A6' : '#475569', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                {v.label}
              </button>
            ))}
          </div>
          {loading ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#475569', fontSize: '13px' }}>Loading...</div>
          ) : (view === 'queue' ? taskQueue : myCases).map((c, idx) => (
            <div key={c.id} onClick={() => { handleSelectCase(c); setMobileView('detail'); }}
              style={{ padding: '14px 16px', borderBottom: '1px solid #ffffff', cursor: 'pointer', backgroundColor: selectedCase?.id === c.id ? '#ffffff' : 'transparent' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>{c.resident_name}</div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#dc2626' }}>${Number(c.balance_owed).toFixed(0)}</div>
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '5px' }}>Unit {c.unit_number} · {c.property_name}</div>
              <div style={{ display: 'flex', gap: '5px' }}>
                <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '4px', backgroundColor: '#ffffff', color: AGING_COLORS[c.aging_bucket] || '#94a3b8', fontWeight: '600' }}>{c.aging_bucket}d</span>
                <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '4px', backgroundColor: '#ffffff', color: '#1d4ed8' }}>{fmtStatus(c.status)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mobile Case Detail */}
      {mobileView === 'detail' && selectedCase && (
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {detailLoading ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#475569' }}>Loading case...</div>
          ) : caseDetail ? (
            <div style={{ padding: '16px' }}>
              {/* Case header */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '16px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>{caseDetail.resident_name}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>Unit {caseDetail.unit_number} · {caseDetail.property_name}</div>
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: '#dc2626' }}>${Number(caseDetail.balance_owed).toFixed(0)}</div>
                </div>
                {/* Status pills — scrollable row */}
                <div style={{ overflowX: 'auto', display: 'flex', gap: '5px', paddingBottom: '4px' }}>
                  {STATUS_PIPELINE.map(s => (
                    <button key={s.key} onClick={() => handleAdvanceStatus(s.key)}
                      style={{ padding: '4px 10px', borderRadius: '5px', border: caseDetail.status === s.key ? `2px solid ${s.color}` : '2px solid #cbd5e1', backgroundColor: caseDetail.status === s.key ? s.color + '22' : 'transparent', color: caseDetail.status === s.key ? s.color : '#475569', fontSize: '10px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick log — mobile optimized */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '16px', marginBottom: '14px' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '10px' }}>Log Contact</div>
                {quickError && <div style={{ color: '#dc2626', fontSize: '12px', marginBottom: '8px' }}>{quickError}</div>}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                  <select value={quickNoteForm.contact_method} onChange={e => setQuickNoteForm(p => ({...p, contact_method: e.target.value}))}
                    style={{ padding: '8px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#1e293b', fontSize: '12px' }}>
                    {['call','text','email','letter','in_person','other'].map(m => <option key={m} value={m}>{fmtStatus(m)}</option>)}
                  </select>
                  <select value={quickNoteForm.outcome} onChange={e => setQuickNoteForm(p => ({...p, outcome: e.target.value}))}
                    style={{ padding: '8px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#1e293b', fontSize: '12px' }}>
                    {['left_voicemail','payment_promise','no_answer','payment_received','refused_to_pay','disconnected','in_person_contact','other'].map(o => <option key={o} value={o}>{fmtStatus(o)}</option>)}
                  </select>
                </div>
                <textarea value={quickNoteForm.notes} onChange={e => setQuickNoteForm(p => ({...p, notes: e.target.value}))} rows={3}
                  placeholder='Notes...' style={{ width: '100%', padding: '8px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#1e293b', fontSize: '12px', resize: 'none', boxSizing: 'border-box', marginBottom: '8px' }} />
                <button onClick={handleQuickLog} disabled={quickSubmitting}
                  style={{ width: '100%', padding: '12px', backgroundColor: '#14B8A6', border: 'none', borderRadius: '8px', color: 'white', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
                  {quickSubmitting ? 'Logging...' : 'Log Contact'}
                </button>
              </div>

              {/* Contact history — compact */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '10px' }}>History ({(caseDetail.touchpoints || []).length})</div>
                {(caseDetail.touchpoints || []).length === 0 ? (
                  <div style={{ fontSize: '12px', color: '#475569' }}>No contacts yet.</div>
                ) : (caseDetail.touchpoints || []).slice(0, 5).map((t, i) => (
                  <div key={i} style={{ padding: '8px 10px', backgroundColor: '#ffffff', borderRadius: '7px', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span style={{ fontSize: '10px', color: '#1d4ed8', fontWeight: '700', textTransform: 'uppercase' }}>{t.contact_method}</span>
                      <span style={{ fontSize: '10px', color: '#cbd5e1' }}>{new Date(t.contacted_at).toLocaleDateString()}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>{fmtStatus(t.outcome)}</div>
                    {t.notes && <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '2px' }}>{t.notes}</div>}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );

  // ── Desktop Layout ────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>

      {/* LEFT — Task Queue + Case List */}
      <div style={{ width: '380px', minWidth: '380px', borderRight: '1px solid #ffffff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Coordinator Header */}
        <div style={{ padding: '16px', borderBottom: '1px solid #ffffff', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Coordinator</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#14B8A6' }}>{coordinator}</div>
            </div>
            <button onClick={() => { setCoordinator(''); setCoordinatorInput(''); setMyCases([]); setStats(null); setSelectedCase(null); }}
              style={{ ...btnSmall, backgroundColor: '#ffffff', color: '#94a3b8', border: '1px solid #cbd5e1' }}>Switch</button>
          </div>

          {/* KPI Strip */}
          {stats && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '14px' }}>
              {[
                { label: 'Active', value: stats.total_active, color: '#1d4ed8' },
                { label: 'High Priority', value: stats.high_priority, color: '#dc2626' },
                { label: 'In Legal', value: stats.in_legal, color: '#7c3aed' },
              ].map((k, i) => (
                <div key={i} style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: k.color }}>{k.value}</div>
                  <div style={{ fontSize: '10px', color: '#475569' }}>{k.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Total Balance */}
          {stats && (
            <div style={{ marginTop: '10px', padding: '8px 12px', backgroundColor: '#ffffff', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#475569' }}>Portfolio Balance</span>
              <span style={{ fontSize: '15px', fontWeight: '800', color: '#dc2626' }}>{fmtCurrency(stats.total_balance)}</span>
            </div>
          )}
        </div>

        {/* View Toggle */}
        <div style={{ display: 'flex', borderBottom: '1px solid #ffffff' }}>
          {[{ key: 'queue', label: `Task Queue (${taskQueue.length})` }, { key: 'all', label: `All Active (${myCases.length})` }].map(v => (
            <button key={v.key} onClick={() => setView(v.key)}
              style={{ flex: 1, padding: '10px', backgroundColor: view === v.key ? '#ffffff' : 'transparent', border: 'none', borderBottom: view === v.key ? '2px solid #14B8A6' : '2px solid transparent', color: view === v.key ? '#14B8A6' : '#475569', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
              {v.label}
            </button>
          ))}
        </div>

        {/* Case List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#475569', fontSize: '13px' }}>Loading workspace...</div>
          ) : (view === 'queue' ? taskQueue : myCases).length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#475569', fontSize: '13px' }}>No cases to show.</div>
          ) : (view === 'queue' ? taskQueue : myCases).map((c, idx) => (
            <div key={c.id} onClick={() => handleSelectCase(c)}
              style={{ padding: '14px 16px', borderBottom: '1px solid #ffffff', cursor: 'pointer', backgroundColor: selectedCase?.id === c.id ? '#ffffff' : 'transparent' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <div style={{ flex: 1 }}>
                  {view === 'queue' && (
                    <div style={{ fontSize: '10px', color: URGENCY_COLOR(idx), fontWeight: '700', marginBottom: '3px', textTransform: 'uppercase' }}>
                      {idx < 3 ? '🔴 Urgent' : idx < 6 ? '🟠 High' : '🟡 Normal'} · {c.urgency_reason}
                    </div>
                  )}
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>{c.resident_name}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>Unit {c.unit_number} · {c.property_name}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#dc2626' }}>{fmtCurrency(c.balance_owed)}</div>
                  <div style={{ fontSize: '10px', color: AGING_COLORS[c.aging_bucket] || '#94a3b8', fontWeight: '600' }}>{c.aging_bucket} Days</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '4px', backgroundColor: '#ffffff', color: '#1d4ed8' }}>{fmtStatus(c.status)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT — Case Work Panel */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {!selectedCase ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#475569' }}>Select a case from your queue</div>
            {stats && stats.notices_pending > 0 && (
              <div style={{ marginTop: '20px', padding: '14px 20px', backgroundColor: '#3a1e1e', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '13px', color: '#dc2626', fontWeight: '600' }}>⚠️ {stats.notices_pending} cases in 91+ day aging with no notice issued</div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Review task queue for highest priority</div>
              </div>
            )}
          </div>
        ) : detailLoading ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>Loading case...</div>
        ) : caseDetail ? (
          <div style={{ padding: '24px' }}>

            {/* Case Header */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h2 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>{caseDetail.resident_name}</h2>
                  <div style={{ fontSize: '13px', color: '#94a3b8' }}>Unit {caseDetail.unit_number} · {caseDetail.property_name} · {caseDetail.property_state}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '26px', fontWeight: '800', color: '#dc2626' }}>{fmtCurrency(caseDetail.balance_owed)}</div>
                  <div style={{ fontSize: '11px', color: '#475569' }}>Balance Owed</div>
                </div>
              </div>

              {/* Status Pipeline */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Advance Status</div>
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                  {STATUS_PIPELINE.map(s => (
                    <button key={s.key} onClick={() => handleAdvanceStatus(s.key)}
                      style={{ padding: '4px 10px', borderRadius: '5px', border: caseDetail.status === s.key ? `2px solid ${s.color}` : '2px solid #cbd5e1', backgroundColor: caseDetail.status === s.key ? s.color + '22' : 'transparent', color: caseDetail.status === s.key ? s.color : '#475569', fontSize: '10px', fontWeight: '600', cursor: 'pointer' }}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Key dates row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {[
                  { label: 'Aging', value: `${caseDetail.aging_bucket} Days`, color: AGING_COLORS[caseDetail.aging_bucket] },
                  { label: 'Times Late', value: caseDetail.times_late || 0 },
                  { label: 'Notice Issued', value: fmtDate(caseDetail.notice_issued_date) },
                  { label: 'Attorney', value: caseDetail.attorney_name || '—' },
                ].map((item, i) => (
                  <div key={i} style={{ backgroundColor: '#ffffff', borderRadius: '7px', padding: '8px 10px' }}>
                    <div style={{ fontSize: '10px', color: '#475569', textTransform: 'uppercase', marginBottom: '3px' }}>{item.label}</div>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: item.color || '#1e293b' }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Log Contact */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Quick Log Contact</h3>
              {quickError && <div style={{ color: '#dc2626', fontSize: '12px', marginBottom: '10px' }}>{quickError}</div>}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                <div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>Method</div>
                  <select value={quickNoteForm.contact_method} onChange={e => setQuickNoteForm(p => ({...p, contact_method: e.target.value}))} style={inputStyle}>
                    {['call','text','email','letter','in_person','other'].map(m => <option key={m} value={m}>{fmtStatus(m)}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>Outcome</div>
                  <select value={quickNoteForm.outcome} onChange={e => setQuickNoteForm(p => ({...p, outcome: e.target.value}))} style={inputStyle}>
                    {['left_voicemail','payment_promise','no_answer','payment_received','refused_to_pay','disconnected','in_person_contact','other'].map(o => <option key={o} value={o}>{fmtStatus(o)}</option>)}
                  </select>
                </div>
              </div>
              <textarea value={quickNoteForm.notes} onChange={e => setQuickNoteForm(p => ({...p, notes: e.target.value}))} rows={2} placeholder='Notes — what was said, what was promised, next action...' style={{ ...inputStyle, resize: 'vertical', marginBottom: '10px' }} />
              <button onClick={handleQuickLog} disabled={quickSubmitting} style={{ ...btnPrimary, width: '100%' }}>
                {quickSubmitting ? 'Logging...' : `Log Contact as ${coordinator}`}
              </button>
            </div>

            {/* Contact History */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
                Contact History ({(caseDetail.touchpoints || []).length})
              </h3>
              {(caseDetail.touchpoints || []).length === 0 ? (
                <div style={{ color: '#475569', fontSize: '13px' }}>No contacts logged yet — be the first.</div>
              ) : (caseDetail.touchpoints || []).map((t, i) => (
                <div key={i} style={{ padding: '10px 12px', backgroundColor: '#ffffff', borderRadius: '8px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '10px', backgroundColor: '#dbeafe', color: '#1d4ed8', padding: '2px 7px', borderRadius: '4px', fontWeight: '600', textTransform: 'uppercase' }}>{t.contact_method}</span>
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>{fmtStatus(t.outcome)}</span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#cbd5e1' }}>{fmtDate(t.contacted_at)}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#475569', marginBottom: t.notes ? '4px' : 0 }}>by {t.coordinator_name}</div>
                  {t.notes && <div style={{ fontSize: '12px', color: '#cbd5e1' }}>{t.notes}</div>}
                </div>
              ))}
            </div>

            {/* Active Payment Plans */}
            {(caseDetail.payment_plans || []).filter(p => p.status === 'active').length > 0 && (
              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px' }}>
                <h3 style={{ margin: '0 0 14px', fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Active Payment Plan</h3>
                {caseDetail.payment_plans.filter(p => p.status === 'active').map((plan, i) => (
                  <div key={i} style={{ padding: '14px', backgroundColor: '#ffffff', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: '#15803d' }}>{fmtCurrency(plan.installment_amount)} / {plan.frequency}</div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>Total: {fmtCurrency(plan.total_amount)}</div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#475569' }}>Started {fmtDate(plan.start_date)} · {plan.missed_payments} missed payments</div>
                    {plan.missed_payments >= 1 && (
                      <div style={{ marginTop: '8px', padding: '6px 10px', backgroundColor: '#3a1e1e', borderRadius: '6px', fontSize: '12px', color: '#dc2626', fontWeight: '600' }}>
                        ⚠️ Missed payment detected — consider escalating
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

          </div>
        ) : null}
      </div>
    </div>
  );
}
// ── End Collections Coordinator Workspace ──────────────────────────────────────

// ── Collections Escalation Rules Engine ───────────────────────────────────────
function CollectionsEscalationTab({ token }) {
  const [rules, setRules] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [emailConfigStatus, setEmailConfigStatus] = useState(null);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [testingEmail, setTestingEmail] = useState(false);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertsLoading, setAlertsLoading] = useState(true);
  const [showNewRule, setShowNewRule] = useState(false);
  const [saving, setSaving] = useState(false);
  const [supervisorEmail, setSupervisorEmail] = useState(localStorage.getItem('collections_supervisor_email') || '');
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState({
    rule_name: '', property_id: '', trigger_type: 'aging_bucket', trigger_value: '120+',
    days_since_contact: '', action: 'flag_attorney_referral', notify_supervisor: true, active: true
  });

  const TRIGGER_TYPES = [
    { key: 'aging_bucket',       label: 'Aging Bucket Reached' },
    { key: 'days_no_contact',    label: 'Days Since Last Contact' },
    { key: 'missed_payments',    label: 'Missed Payment Plan Payments' },
    { key: 'balance_threshold',  label: 'Balance Exceeds Amount' },
  ];

  const AGING_OPTIONS   = ['30-60', '61-90', '91-120', '120+'];
  const ACTION_OPTIONS  = [
    { key: 'flag_attorney_referral', label: 'Flag for Attorney Referral' },
    { key: 'flag_supervisor',        label: 'Flag for Supervisor Review' },
    { key: 'flag_notice_needed',     label: 'Flag: Notice Not Yet Issued' },
    { key: 'flag_escalate',          label: 'Escalate Case Priority' },
  ];

  const fmtStatus   = (s) => (s || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const fmtCurrency = (v) => '$' + Number(v || 0).toLocaleString('en-US', { minimumFractionDigits: 2 });
  const fmtDate     = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  // Pull cases and evaluate rules client-side (no backend rule engine needed yet)
  const evaluateRules = async (ruleSet, cases) => {
    const generatedAlerts = [];
    ruleSet.forEach(rule => {
      if (!rule.active) return;
      cases.forEach(c => {
        if (rule.property_id && rule.property_id !== c.property_id) return;
        if (['closed_paid', 'closed_written_off'].includes(c.status)) return;
        let triggered = false;
        let reason = '';
        if (rule.trigger_type === 'aging_bucket') {
          const rank = { '30-60': 1, '61-90': 2, '91-120': 3, '120+': 4 };
          if ((rank[c.aging_bucket] || 0) >= (rank[rule.trigger_value] || 0)) {
            triggered = true; reason = `Aging bucket ${c.aging_bucket} meets threshold ${rule.trigger_value}`;
          }
        } else if (rule.trigger_type === 'balance_threshold') {
          if (Number(c.balance_owed) >= Number(rule.trigger_value)) {
            triggered = true; reason = `Balance ${fmtCurrency(c.balance_owed)} exceeds threshold ${fmtCurrency(rule.trigger_value)}`;
          }
        } else if (rule.trigger_type === 'days_no_contact') {
          const daysSinceCreated = Math.floor((Date.now() - new Date(c.created_at)) / 86400000);
          if (daysSinceCreated >= Number(rule.days_since_contact || rule.trigger_value)) {
            triggered = true; reason = `${daysSinceCreated} days since case opened with no tracked contact`;
          }
        } else if (rule.trigger_type === 'missed_payments') {
          // Flag cases in payment plan status with balance still owed
          if (c.status === 'active' && ['91-120', '120+'].includes(c.aging_bucket)) {
            triggered = true; reason = 'High aging with active status — potential missed plan';
          }
        }
        if (triggered) {
          generatedAlerts.push({
            id: `${rule.id}-${c.id}`,
            rule_name: rule.rule_name,
            action: rule.action,
            notify_supervisor: rule.notify_supervisor,
            case_id: c.id,
            resident_name: c.resident_name,
            unit_number: c.unit_number,
            property_name: c.property_name,
            balance_owed: c.balance_owed,
            aging_bucket: c.aging_bucket,
            status: c.status,
            reason,
            triggered_at: new Date().toISOString(),
          });
        }
      });
    });
    return generatedAlerts;
  };

  const loadData = async () => {
    setLoading(true); setAlertsLoading(true);
    try {
      const [propRes, caseRes] = await Promise.all([
        fetch(`${API_URL}/api/properties`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/collections/cases`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const propsData = await propRes.json();
      const casesData = await caseRes.json();
      setProperties(Array.isArray(propsData) ? propsData : []);

      // Load saved rules from localStorage (persisted per user)
      const savedRules = JSON.parse(localStorage.getItem('collections_escalation_rules') || '[]');
      // Seed default rules if none exist
      const defaultRules = savedRules.length > 0 ? savedRules : [
        { id: 'default-1', rule_name: '120+ Day Auto-Flag', property_id: '', trigger_type: 'aging_bucket', trigger_value: '120+', days_since_contact: '', action: 'flag_attorney_referral', notify_supervisor: true, active: true, created_at: new Date().toISOString() },
        { id: 'default-2', rule_name: '91+ Day Notice Alert', property_id: '', trigger_type: 'aging_bucket', trigger_value: '91-120', days_since_contact: '', action: 'flag_notice_needed', notify_supervisor: false, active: true, created_at: new Date().toISOString() },
        { id: 'default-3', rule_name: 'High Balance Flag', property_id: '', trigger_type: 'balance_threshold', trigger_value: '3000', days_since_contact: '', action: 'flag_supervisor', notify_supervisor: true, active: true, created_at: new Date().toISOString() },
      ];
      if (savedRules.length === 0) localStorage.setItem('collections_escalation_rules', JSON.stringify(defaultRules));
      setRules(defaultRules);

      if (Array.isArray(casesData)) {
        const generatedAlerts = await evaluateRules(defaultRules, casesData);
        setAlerts(generatedAlerts);
      }
    // Fetch email config status
    fetch(`${API_URL}/api/collections-email/config-status`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setEmailConfigStatus).catch(() => {});
    } catch (err) { console.error('escalation load error:', err); }
    finally { setLoading(false); setAlertsLoading(false); }
  };

  useEffect(() => { loadData(); }, [token]);

  const handleSaveRule = () => {
    if (!form.rule_name || !form.trigger_type || !form.action) {
      setFormError('Rule name, trigger type, and action are required.'); return;
    }
    setSaving(true);
    const newRule = { ...form, id: `rule-${Date.now()}`, created_at: new Date().toISOString() };
    const updated = [...rules, newRule];
    setRules(updated);
    localStorage.setItem('collections_escalation_rules', JSON.stringify(updated));
    setShowNewRule(false);
    setForm({ rule_name: '', property_id: '', trigger_type: 'aging_bucket', trigger_value: '120+', days_since_contact: '', action: 'flag_attorney_referral', notify_supervisor: true, active: true });
    setFormError('');
    setSaving(false);
    // Re-evaluate alerts with new rule set
    fetch(`${API_URL}/api/collections/cases`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(cases => { if (Array.isArray(cases)) evaluateRules(updated, cases).then(setAlerts); });
  };

  const handleToggleRule = (id) => {
    const updated = rules.map(r => r.id === id ? { ...r, active: !r.active } : r);
    setRules(updated);
    localStorage.setItem('collections_escalation_rules', JSON.stringify(updated));
  };

  const handleDeleteRule = (id) => {
    const updated = rules.filter(r => r.id !== id);
    setRules(updated);
    localStorage.setItem('collections_escalation_rules', JSON.stringify(updated));
  };

  const handleDismissAlert = (alertId) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  const handleSendAlertEmail = async () => {
    if (!supervisorEmail) { alert('Enter supervisor email first.'); return; }
    const supervisorAlerts = alerts.filter(a => a.notify_supervisor);
    if (supervisorAlerts.length === 0) { alert('No supervisor-flagged alerts to send.'); return; }
    setSendingEmail(true);
    try {
      const res = await fetch(`${API_URL}/api/collections-email/send-alert`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supervisor_email: supervisorEmail,
          subject: `Servfixy Collections — ${supervisorAlerts.length} case${supervisorAlerts.length > 1 ? 's' : ''} require supervisor review`,
          alerts: supervisorAlerts.map(a => ({
            resident_name: a.resident_name, unit_number: a.unit_number,
            property_name: a.property_name, balance_owed: a.balance_owed,
            status: a.status, action_label: a.rule_name, reason: a.reason
          }))
        })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setEmailSent(true);
      setTimeout(() => setEmailSent(false), 4000);
    } catch (err) { alert('Email failed: ' + err.message); }
    finally { setSendingEmail(false); }
  };

  const handleTestEmail = async () => {
    if (!supervisorEmail) { alert('Enter supervisor email first.'); return; }
    setTestingEmail(true);
    try {
      const res = await fetch(`${API_URL}/api/collections-email/test`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ supervisor_email: supervisorEmail })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      alert('Test email sent to ' + supervisorEmail);
    } catch (err) { alert('Test failed: ' + err.message); }
    finally { setTestingEmail(false); }
  };

  const ACTION_COLORS = {
    flag_attorney_referral: '#dc2626',
    flag_supervisor:        '#7c3aed',
    flag_notice_needed:     '#facc15',
    flag_escalate:          '#ea580c',
  };

  const inputStyle = { padding: '8px 12px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '7px', color: '#1e293b', fontSize: '13px', width: '100%', boxSizing: 'border-box' };
  const labelStyle = { fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' };
  const btnPrimary = { padding: '9px 18px', backgroundColor: '#14B8A6', border: 'none', borderRadius: '7px', color: 'white', fontSize: '13px', fontWeight: '600', cursor: 'pointer' };

  return (
    <div style={{ padding: '24px', fontFamily: 'Arial, sans-serif', backgroundColor: '#ffffff', minHeight: '100vh', color: '#1e293b' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: '700', color: '#0f172a' }}>Escalation Rules</h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>Automated flags run against all active cases on load. Rules are portfolio-wide unless scoped to a property.</p>
        </div>
        <button onClick={() => { setShowNewRule(true); setFormError(''); }} style={btnPrimary}>+ New Rule</button>
      </div>

      {/* Alert Banner */}
      {alerts.length > 0 && (
        <div style={{ backgroundColor: '#3a1e1e', border: '1px solid #dc2626', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#dc2626', marginBottom: '4px' }}>⚠️ {alerts.length} Active Alert{alerts.length > 1 ? 's' : ''}</div>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Rules evaluated against all active cases. Review and act below.</div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

        {/* LEFT — Active Alerts */}
        <div>
          <h2 style={{ margin: '0 0 14px', fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>Active Alerts ({alerts.length})</h2>
          {alertsLoading ? (
            <div style={{ color: '#475569', fontSize: '13px' }}>Evaluating rules...</div>
          ) : alerts.length === 0 ? (
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>✅</div>
              <div style={{ fontSize: '14px', color: '#15803d', fontWeight: '600' }}>No alerts triggered</div>
              <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>All active cases are within rule thresholds</div>
            </div>
          ) : alerts.map(alert => (
            <div key={alert.id} style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '16px', marginBottom: '12px', borderLeft: `4px solid ${ACTION_COLORS[alert.action] || '#94a3b8'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: ACTION_COLORS[alert.action] || '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>
                    {fmtStatus(alert.action)}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>{alert.resident_name}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>Unit {alert.unit_number} · {alert.property_name}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#dc2626' }}>{fmtCurrency(alert.balance_owed)}</div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>{alert.aging_bucket} Days</div>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>
                <span style={{ color: '#475569' }}>Rule: </span>{alert.rule_name} — {alert.reason}
              </div>
              {alert.notify_supervisor && (
                <div style={{ fontSize: '11px', color: '#7c3aed', marginBottom: '8px' }}>👤 Supervisor notification flagged</div>
              )}
              <button onClick={() => handleDismissAlert(alert.id)}
                style={{ fontSize: '11px', padding: '4px 12px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '5px', color: '#94a3b8', cursor: 'pointer' }}>
                Dismiss
              </button>
            </div>
          ))}
        </div>

        {/* RIGHT — Rules List */}
        <div>
          <h2 style={{ margin: '0 0 14px', fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>Rules ({rules.length})</h2>
          {rules.map(rule => (
            <div key={rule.id} style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '16px', marginBottom: '10px', opacity: rule.active ? 1 : 0.5 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>{rule.rule_name}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                    {fmtStatus(rule.trigger_type)} → {rule.trigger_value || rule.days_since_contact}
                    {rule.property_id ? ` · ${properties.find(p => p.id === rule.property_id)?.name || 'Specific property'}` : ' · All properties'}
                  </div>
                </div>
                <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', backgroundColor: ACTION_COLORS[rule.action] + '22' || '#ffffff', color: ACTION_COLORS[rule.action] || '#94a3b8', fontWeight: '700' }}>
                  {fmtStatus(rule.action)}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button onClick={() => handleToggleRule(rule.id)}
                  style={{ fontSize: '11px', padding: '4px 12px', backgroundColor: rule.active ? '#1c3a2e' : '#ffffff', border: `1px solid ${rule.active ? '#15803d' : '#cbd5e1'}`, borderRadius: '5px', color: rule.active ? '#15803d' : '#475569', cursor: 'pointer', fontWeight: '600' }}>
                  {rule.active ? 'Active' : 'Inactive'}
                </button>
                {!rule.id.startsWith('default') && (
                  <button onClick={() => handleDeleteRule(rule.id)}
                    style={{ fontSize: '11px', padding: '4px 12px', backgroundColor: '#3a1e1e', border: '1px solid #dc2626', borderRadius: '5px', color: '#dc2626', cursor: 'pointer' }}>
                    Delete
                  </button>
                )}
                {rule.notify_supervisor && <span style={{ fontSize: '11px', color: '#7c3aed', alignSelf: 'center' }}>👤 Supervisor</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Email Notifications Panel */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', marginTop: '24px' }}>
        <h2 style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>Email Notifications</h2>
        <p style={{ margin: '0 0 16px', fontSize: '12px', color: '#94a3b8' }}>Send escalation alerts to a supervisor via email. Requires EMAIL_HOST, EMAIL_USER, EMAIL_PASS set in Railway.</p>

        {emailConfigStatus && (
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {[
              { label: 'SMTP Host', value: emailConfigStatus.host },
              { label: 'User', value: emailConfigStatus.user },
              { label: 'Password', value: emailConfigStatus.pass },
              { label: 'From', value: emailConfigStatus.from },
              { label: 'Port', value: emailConfigStatus.port },
            ].map((item, i) => (
              <div key={i} style={{ backgroundColor: '#ffffff', borderRadius: '7px', padding: '8px 12px', fontSize: '11px' }}>
                <div style={{ color: '#475569', marginBottom: '2px', textTransform: 'uppercase' }}>{item.label}</div>
                <div style={{ color: item.value.startsWith('✓') ? '#15803d' : item.value.startsWith('✗') ? '#dc2626' : '#1e293b', fontWeight: '600' }}>{item.value}</div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '220px' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '5px', textTransform: 'uppercase' }}>Supervisor Email</div>
            <input value={supervisorEmail}
              onChange={e => { setSupervisorEmail(e.target.value); localStorage.setItem('collections_supervisor_email', e.target.value); }}
              placeholder='supervisor@company.com'
              style={{ width: '100%', padding: '9px 12px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '7px', color: '#1e293b', fontSize: '13px', boxSizing: 'border-box' }} />
          </div>
          <button onClick={handleTestEmail} disabled={testingEmail}
            style={{ padding: '9px 16px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '7px', color: '#94a3b8', fontSize: '13px', cursor: 'pointer' }}>
            {testingEmail ? 'Sending...' : 'Send Test'}
          </button>
          <button onClick={handleSendAlertEmail} disabled={sendingEmail || alerts.filter(a => a.notify_supervisor).length === 0}
            style={{ padding: '9px 18px', backgroundColor: emailSent ? '#1c3a2e' : '#1d4ed8', border: 'none', borderRadius: '7px', color: emailSent ? '#15803d' : 'white', fontSize: '13px', fontWeight: '700', cursor: 'pointer', opacity: alerts.filter(a => a.notify_supervisor).length === 0 ? 0.5 : 1 }}>
            {emailSent ? '✓ Sent!' : sendingEmail ? 'Sending...' : `Email ${alerts.filter(a => a.notify_supervisor).length} Supervisor Alert${alerts.filter(a => a.notify_supervisor).length !== 1 ? 's' : ''}`}
          </button>
        </div>

        {alerts.filter(a => a.notify_supervisor).length === 0 && alerts.length > 0 && (
          <div style={{ fontSize: '12px', color: '#475569', marginTop: '10px' }}>No alerts with supervisor notification flag active. Enable "Flag for supervisor notification" on a rule to send email alerts.</div>
        )}
      </div>

      {/* New Rule Modal */}
      {showNewRule && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '28px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>New Escalation Rule</h2>
            {formError && <div style={{ color: '#dc2626', fontSize: '13px', marginBottom: '12px', padding: '10px', backgroundColor: '#3a1e1e', borderRadius: '7px' }}>{formError}</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div><label style={labelStyle}>Rule Name *</label><input value={form.rule_name} onChange={e => setForm(p => ({...p, rule_name: e.target.value}))} style={inputStyle} placeholder='e.g. 120-Day Attorney Flag' /></div>
              <div>
                <label style={labelStyle}>Property Scope</label>
                <select value={form.property_id} onChange={e => setForm(p => ({...p, property_id: e.target.value}))} style={inputStyle}>
                  <option value=''>All Properties (portfolio-wide)</option>
                  {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Trigger Type *</label>
                <select value={form.trigger_type} onChange={e => setForm(p => ({...p, trigger_type: e.target.value, trigger_value: ''}))} style={inputStyle}>
                  {TRIGGER_TYPES.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>{form.trigger_type === 'aging_bucket' ? 'Aging Bucket' : form.trigger_type === 'days_no_contact' ? 'Days Without Contact' : form.trigger_type === 'balance_threshold' ? 'Balance Threshold ($)' : 'Missed Payments Count'}</label>
                {form.trigger_type === 'aging_bucket' ? (
                  <select value={form.trigger_value} onChange={e => setForm(p => ({...p, trigger_value: e.target.value}))} style={inputStyle}>
                    {AGING_OPTIONS.map(a => <option key={a} value={a}>{a} Days</option>)}
                  </select>
                ) : (
                  <input type='number' value={form.trigger_value} onChange={e => setForm(p => ({...p, trigger_value: e.target.value}))} style={inputStyle} placeholder={form.trigger_type === 'balance_threshold' ? '3000' : '30'} />
                )}
              </div>
              <div>
                <label style={labelStyle}>Action *</label>
                <select value={form.action} onChange={e => setForm(p => ({...p, action: e.target.value}))} style={inputStyle}>
                  {ACTION_OPTIONS.map(a => <option key={a.key} value={a.key}>{a.label}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type='checkbox' id='notify_sup' checked={form.notify_supervisor} onChange={e => setForm(p => ({...p, notify_supervisor: e.target.checked}))} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                <label htmlFor='notify_sup' style={{ fontSize: '13px', color: '#1e293b', cursor: 'pointer' }}>Flag for supervisor notification</label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={handleSaveRule} disabled={saving} style={btnPrimary}>{saving ? 'Saving...' : 'Save Rule'}</button>
              <button onClick={() => { setShowNewRule(false); setFormError(''); }} style={{ padding: '9px 18px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '7px', color: '#94a3b8', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// ── End Collections Escalation Rules Engine ────────────────────────────────────

// ── Collections Document Vault ─────────────────────────────────────────────────
function CollectionsDocumentVault({ token }) {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [docsLoading, setDocsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [filterProp, setFilterProp] = useState('');
  const [properties, setProperties] = useState([]);
  const [uploadedBy, setUploadedBy] = useState(localStorage.getItem('collections_coordinator_name') || '');
  const [docType, setDocType] = useState('notice');
  const [searchTerm, setSearchTerm] = useState('');

  const DOC_TYPES = [
    { key: 'notice',                  label: 'Notice',                  color: '#facc15' },
    { key: 'court_filing',            label: 'Court Filing',            color: '#dc2626' },
    { key: 'payment_plan',            label: 'Payment Plan',            color: '#15803d' },
    { key: 'attorney_correspondence', label: 'Attorney Correspondence', color: '#7c3aed' },
    { key: 'lease',                   label: 'Lease',                   color: '#1d4ed8' },
    { key: 'other',                   label: 'Other',                   color: '#94a3b8' },
  ];

  const fmtDate     = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
  const fmtStatus   = (s) => (s || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const fmtCurrency = (v) => '$' + Number(v || 0).toLocaleString('en-US', { minimumFractionDigits: 2 });
  const docColor    = (type) => (DOC_TYPES.find(d => d.key === type) || { color: '#94a3b8' }).color;

  const fetchCases = async () => {
    setLoading(true);
    try {
      const [caseRes, propRes] = await Promise.all([
        fetch(`${API_URL}/api/collections/cases${filterProp ? `?property_id=${filterProp}` : ''}`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/properties`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const casesData = await caseRes.json();
      const propsData = await propRes.json();
      setCases(Array.isArray(casesData) ? casesData : []);
      setProperties(Array.isArray(propsData) ? propsData : []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchDocs = async (caseId) => {
    setDocsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/collections/cases/${caseId}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setDocuments(data.documents || []);
    } catch (err) { console.error(err); }
    finally { setDocsLoading(false); }
  };

  useEffect(() => { fetchCases(); }, [token, filterProp]);

  const handleSelectCase = (c) => {
    setSelectedCase(c);
    setDocuments([]);
    setUploadError('');
    fetchDocs(c.id);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedCase) return;
    if (!uploadedBy) { setUploadError('Enter your name before uploading.'); return; }
    setUploading(true); setUploadError('');

    try {
      // Convert file to base64 and upload via collections documents endpoint
      const reader = new FileReader();
      reader.onload = async (ev) => {
        try {
          // Upload to Supabase via backend
          const formData = new FormData();
          formData.append('file', file);
          formData.append('document_type', docType);
          formData.append('uploaded_by', uploadedBy);
          formData.append('case_id', selectedCase.id);

          // Use the existing documents endpoint with a file URL stub
          // We'll store the file in Supabase via a direct upload approach
          const uploadRes = await fetch(`${API_URL}/api/collections/cases/${selectedCase.id}/documents/upload`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          });

          if (!uploadRes.ok) {
            // Fallback: store with a placeholder URL for now
            const fallbackRes = await fetch(`${API_URL}/api/collections/cases/${selectedCase.id}/documents`, {
              method: 'POST',
              headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({
                document_type: docType,
                file_name: file.name,
                file_url: `pending_upload_${Date.now()}_${file.name}`,
                uploaded_by: uploadedBy,
              }),
            });
            const fallbackData = await fallbackRes.json();
            if (!fallbackRes.ok) throw new Error(fallbackData.error || 'Upload failed');
            fetchDocs(selectedCase.id);
          } else {
            fetchDocs(selectedCase.id);
          }
        } catch (err) { setUploadError(err.message); }
        finally { setUploading(false); e.target.value = ''; }
      };
      reader.readAsDataURL(file);
    } catch (err) { setUploadError(err.message); setUploading(false); }
  };

  const handleManualLink = async (fileName, fileUrl) => {
    if (!fileName || !fileUrl || !uploadedBy) { setUploadError('File name, URL, and your name are required.'); return; }
    setUploading(true); setUploadError('');
    try {
      const res = await fetch(`${API_URL}/api/collections/cases/${selectedCase.id}/documents`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ document_type: docType, file_name: fileName, file_url: fileUrl, uploaded_by: uploadedBy }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save document link');
      fetchDocs(selectedCase.id);
    } catch (err) { setUploadError(err.message); }
    finally { setUploading(false); }
  };

  const [linkForm, setLinkForm] = useState({ name: '', url: '' });
  const [showLinkForm, setShowLinkForm] = useState(false);

  const filteredCases = cases.filter(c =>
    !searchTerm || c.resident_name.toLowerCase().includes(searchTerm.toLowerCase()) || c.unit_number.includes(searchTerm)
  );

  const inputStyle = { padding: '8px 12px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '7px', color: '#1e293b', fontSize: '13px', width: '100%', boxSizing: 'border-box' };

  // Summary stats
  const totalDocs = cases.reduce((s) => s, 0);

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>

      {/* LEFT — Case List */}
      <div style={{ width: '340px', minWidth: '340px', borderRight: '1px solid #ffffff', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #ffffff' }}>
          <h2 style={{ margin: '0 0 12px', fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Document Vault</h2>
          <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder='Search resident or unit...' style={{ ...inputStyle, marginBottom: '8px' }} />
          <select value={filterProp} onChange={e => setFilterProp(e.target.value)} style={inputStyle}>
            <option value=''>All Properties</option>
            {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#475569', fontSize: '13px' }}>Loading cases...</div>
          ) : filteredCases.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#475569', fontSize: '13px' }}>No cases found.</div>
          ) : filteredCases.map(c => (
            <div key={c.id} onClick={() => handleSelectCase(c)}
              style={{ padding: '14px 16px', borderBottom: '1px solid #ffffff', cursor: 'pointer', backgroundColor: selectedCase?.id === c.id ? '#ffffff' : 'transparent' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>{c.resident_name}</div>
                <div style={{ fontSize: '12px', color: '#dc2626', fontWeight: '700' }}>{fmtCurrency(c.balance_owed)}</div>
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Unit {c.unit_number} · {c.property_name}</div>
              <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '4px' }}>{fmtStatus(c.status)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT — Document Panel */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        {!selectedCase ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#cbd5e1' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗂️</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#475569' }}>Select a case to manage documents</div>
            <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '8px' }}>Upload notices, court filings, payment plans, and correspondence</div>
          </div>
        ) : (
          <div>
            {/* Case Header */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '18px 20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>{selectedCase.resident_name}</div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Unit {selectedCase.unit_number} · {selectedCase.property_name}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '20px', fontWeight: '800', color: '#dc2626' }}>{fmtCurrency(selectedCase.balance_owed)}</div>
                <div style={{ fontSize: '11px', color: '#475569' }}>{documents.length} document{documents.length !== 1 ? 's' : ''}</div>
              </div>
            </div>

            {/* Upload Panel */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Add Document</h3>
              {uploadError && <div style={{ color: '#dc2626', fontSize: '13px', marginBottom: '10px', padding: '8px 12px', backgroundColor: '#3a1e1e', borderRadius: '7px' }}>{uploadError}</div>}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>Your Name</div>
                  <input value={uploadedBy} onChange={e => { setUploadedBy(e.target.value); localStorage.setItem('collections_coordinator_name', e.target.value); }} style={inputStyle} placeholder='Coordinator name' />
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' }}>Document Type</div>
                  <select value={docType} onChange={e => setDocType(e.target.value)} style={inputStyle}>
                    {DOC_TYPES.map(d => <option key={d.key} value={d.key}>{d.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Two upload options */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {/* File Upload */}
                <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '16px', border: '2px dashed #cbd5e1', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>📎</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '10px' }}>Upload file (PDF, DOC, IMG)</div>
                  <label style={{ padding: '8px 16px', backgroundColor: '#14B8A6', border: 'none', borderRadius: '7px', color: 'white', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                    {uploading ? 'Uploading...' : 'Choose File'}
                    <input type='file' onChange={handleFileUpload} disabled={uploading} accept='.pdf,.doc,.docx,.jpg,.jpeg,.png' style={{ display: 'none' }} />
                  </label>
                </div>

                {/* Link/URL */}
                <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '16px', border: '2px dashed #cbd5e1' }}>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>🔗 Link existing document</div>
                  {showLinkForm ? (
                    <div>
                      <input value={linkForm.name} onChange={e => setLinkForm(p => ({...p, name: e.target.value}))} placeholder='File name' style={{ ...inputStyle, marginBottom: '6px', fontSize: '12px' }} />
                      <input value={linkForm.url} onChange={e => setLinkForm(p => ({...p, url: e.target.value}))} placeholder='https://...' style={{ ...inputStyle, marginBottom: '8px', fontSize: '12px' }} />
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => { handleManualLink(linkForm.name, linkForm.url); setLinkForm({ name: '', url: '' }); setShowLinkForm(false); }}
                          style={{ flex: 1, padding: '6px', backgroundColor: '#14B8A6', border: 'none', borderRadius: '5px', color: 'white', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>Save</button>
                        <button onClick={() => setShowLinkForm(false)}
                          style={{ padding: '6px 10px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '5px', color: '#94a3b8', fontSize: '11px', cursor: 'pointer' }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setShowLinkForm(true)}
                      style={{ width: '100%', padding: '8px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '7px', color: '#94a3b8', fontSize: '12px', cursor: 'pointer' }}>
                      + Add Link
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Documents List */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Documents ({documents.length})</h3>
              {docsLoading ? (
                <div style={{ color: '#475569', fontSize: '13px' }}>Loading documents...</div>
              ) : documents.length === 0 ? (
                <div style={{ color: '#475569', fontSize: '13px', padding: '24px 0', textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>📂</div>
                  No documents yet — upload the first one above.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {/* Group by type */}
                  {DOC_TYPES.map(dt => {
                    const typeDocs = documents.filter(d => d.document_type === dt.key);
                    if (typeDocs.length === 0) return null;
                    return (
                      <div key={dt.key}>
                        <div style={{ fontSize: '11px', color: dt.color, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', marginTop: '4px' }}>{dt.label} ({typeDocs.length})</div>
                        {typeDocs.map((doc, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#ffffff', borderRadius: '8px', marginBottom: '6px', borderLeft: `3px solid ${dt.color}` }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.file_name}</div>
                              <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>{doc.uploaded_by} · {fmtDate(doc.created_at)}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', marginLeft: '12px', flexShrink: 0 }}>
                              {doc.file_url && !doc.file_url.startsWith('pending_upload') && (
                                <a href={doc.file_url} target='_blank' rel='noreferrer'
                                  style={{ fontSize: '11px', padding: '4px 12px', backgroundColor: '#dbeafe', border: 'none', borderRadius: '5px', color: '#1d4ed8', textDecoration: 'none', fontWeight: '600' }}>
                                  Open
                                </a>
                              )}
                              {doc.file_url && doc.file_url.startsWith('pending_upload') && (
                                <span style={{ fontSize: '11px', color: '#94a3b8', padding: '4px 8px' }}>Pending upload</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
// ── End Collections Document Vault ─────────────────────────────────────────────

// ── Collections CSV Import ─────────────────────────────────────────────────────
function CollectionsImportTab({ token }) {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState('');
  const [rawRows, setRawRows] = useState([]);
  const [mappedRows, setMappedRows] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [mapping, setMapping] = useState({});
  const [step, setStep] = useState(1); // 1=upload, 2=map, 3=preview, 4=done
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState(null);
  const [parseError, setParseError] = useState('');
  const [defaultState, setDefaultState] = useState('TX');

  const FIELDS = [
    { key: 'resident_name',  label: 'Resident Name',   required: true  },
    { key: 'unit_number',    label: 'Unit Number',      required: true  },
    { key: 'balance_owed',   label: 'Balance Owed ($)', required: true  },
    { key: 'aging_bucket',   label: 'Aging Bucket',     required: false },
    { key: 'times_late',     label: 'Times Late',       required: false },
    { key: 'status',         label: 'Status',           required: false },
    { key: 'attorney_name',  label: 'Attorney Name',    required: false },
    { key: 'notice_issued_date',      label: 'Notice Issued Date',    required: false },
    { key: 'court_hearing_date',      label: 'Court Hearing Date',    required: false },
    { key: 'writ_file_date',          label: 'Writ File Date',        required: false },
    { key: 'possession_granted_date', label: 'Possession Granted Date', required: false },
    { key: 'fed_date',                label: 'FED Date',              required: false },
  ];

  const AGING_MAP = {
    '30-60': '30-60', '30': '30-60', '60': '30-60',
    '61-90': '61-90', '90': '61-90',
    '91-120': '91-120', '120': '91-120',
    '120+': '120+', '121+': '120+', 'over 120': '120+',
  };

  const STATUS_MAP = {
    'active': 'active', 'open': 'active', 'new': 'active',
    'notice issued': 'notice_issued', 'notice_issued': 'notice_issued',
    'filed with attorney': 'filed_with_attorney', 'filed_with_attorney': 'filed_with_attorney', 'attorney': 'filed_with_attorney',
    'fed': 'fed',
    'writ filed': 'writ_filed', 'writ_filed': 'writ_filed', 'writ': 'writ_filed',
    'hearing scheduled': 'hearing_scheduled', 'hearing_scheduled': 'hearing_scheduled', 'hearing': 'hearing_scheduled',
    'possession granted': 'possession_granted', 'possession_granted': 'possession_granted', 'possession': 'possession_granted',
    'closed': 'closed_paid', 'paid': 'closed_paid', 'closed paid': 'closed_paid',
    'written off': 'closed_written_off', 'write off': 'closed_written_off',
  };

  const fmtStatus = (s) => (s || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  const normalizeBalance = (v) => {
    if (!v) return 0;
    return parseFloat(String(v).replace(/[$,\s]/g, '')) || 0;
  };

  const normalizeAging = (v) => {
    if (!v) return '30-60';
    const k = String(v).toLowerCase().trim();
    return AGING_MAP[k] || '30-60';
  };

  const normalizeStatus = (v) => {
    if (!v) return 'active';
    const k = String(v).toLowerCase().trim();
    return STATUS_MAP[k] || 'active';
  };

  const normalizeDate = (v) => {
    if (!v || String(v).trim() === '' || String(v).trim() === '—') return null;
    try {
      const d = new Date(v);
      return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
    } catch { return null; }
  };

  useEffect(() => {
    fetch(`${API_URL}/api/properties`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setProperties(Array.isArray(d) ? d : [])).catch(() => {});
  }, [token]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setParseError('');
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target.result;
        const lines = text.trim().split('\n').filter(l => l.trim());
        if (lines.length < 2) { setParseError('File must have a header row and at least one data row.'); return; }

        // Parse headers — handle quoted CSV
        const parseCSVLine = (line) => {
          const result = [];
          let current = '';
          let inQuotes = false;
          for (let i = 0; i < line.length; i++) {
            if (line[i] === '"') { inQuotes = !inQuotes; }
            else if (line[i] === ',' && !inQuotes) { result.push(current.trim()); current = ''; }
            else { current += line[i]; }
          }
          result.push(current.trim());
          return result;
        };

        const hdrs = parseCSVLine(lines[0]).map(h => h.replace(/"/g, '').trim());
        const rows = lines.slice(1).map(line => {
          const vals = parseCSVLine(line);
          const row = {};
          hdrs.forEach((h, i) => { row[h] = (vals[i] || '').replace(/"/g, '').trim(); });
          return row;
        }).filter(r => Object.values(r).some(v => v));

        if (rows.length === 0) { setParseError('No valid data rows found.'); return; }

        setHeaders(hdrs);
        setRawRows(rows);

        // Auto-map headers to fields
        const autoMap = {};
        FIELDS.forEach(field => {
          const match = hdrs.find(h => {
            const hn = h.toLowerCase().replace(/[^a-z0-9]/g, '');
            const fn = field.key.toLowerCase().replace(/_/g, '');
            const fl = field.label.toLowerCase().replace(/[^a-z0-9]/g, '');
            return hn === fn || hn === fl ||
              (field.key === 'resident_name' && (hn.includes('resident') || hn.includes('tenant') || hn.includes('name'))) ||
              (field.key === 'unit_number' && (hn.includes('unit') || hn === 'apt' || hn === 'apartment')) ||
              (field.key === 'balance_owed' && (hn.includes('balance') || hn.includes('amount') || hn.includes('owed') || hn.includes('delinquent'))) ||
              (field.key === 'aging_bucket' && (hn.includes('aging') || hn.includes('days') || hn.includes('age'))) ||
              (field.key === 'times_late' && (hn.includes('late') || hn.includes('times'))) ||
              (field.key === 'attorney_name' && (hn.includes('attorney') || hn.includes('lawyer')));
          });
          if (match) autoMap[field.key] = match;
        });
        setMapping(autoMap);
        setStep(2);
      } catch (err) { setParseError('Failed to parse file: ' + err.message); }
    };
    reader.readAsText(file);
  };

  const buildPreview = () => {
    const preview = rawRows.map((row, idx) => {
      const mapped = { _row: idx + 2, _errors: [] };
      FIELDS.forEach(field => {
        const col = mapping[field.key];
        const val = col ? row[col] : '';
        if (field.key === 'balance_owed')  mapped[field.key] = normalizeBalance(val);
        else if (field.key === 'aging_bucket') mapped[field.key] = normalizeAging(val);
        else if (field.key === 'status')       mapped[field.key] = normalizeStatus(val);
        else if (field.key.includes('_date'))  mapped[field.key] = normalizeDate(val);
        else if (field.key === 'times_late')   mapped[field.key] = parseInt(val) || 0;
        else mapped[field.key] = val || '';
        if (field.required && !mapped[field.key]) mapped._errors.push(`${field.label} is missing`);
      });
      return mapped;
    });
    setMappedRows(preview);
    setStep(3);
  };

  const handleImport = async () => {
    if (!selectedProperty) { setParseError('Select a property before importing.'); return; }
    const validRows = mappedRows.filter(r => r._errors.length === 0);
    if (validRows.length === 0) { setParseError('No valid rows to import.'); return; }

    setImporting(true);
    const results = { success: 0, failed: 0, errors: [] };

    for (const row of validRows) {
      try {
        const payload = {
          property_id: selectedProperty,
          resident_name: row.resident_name,
          unit_number: row.unit_number,
          balance_owed: row.balance_owed,
          aging_bucket: row.aging_bucket || '30-60',
          times_late: row.times_late || 0,
          status: row.status || 'active',
          attorney_name: row.attorney_name || null,
          notice_issued_date: row.notice_issued_date || null,
          court_hearing_date: row.court_hearing_date || null,
          writ_file_date: row.writ_file_date || null,
          possession_granted_date: row.possession_granted_date || null,
          fed_date: row.fed_date || null,
        };
        const res = await fetch(`${API_URL}/api/collections/cases`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) { results.success++; }
        else {
          const err = await res.json();
          results.failed++;
          results.errors.push(`Row ${row._row}: ${err.error || 'Unknown error'}`);
        }
      } catch (err) {
        results.failed++;
        results.errors.push(`Row ${row._row}: ${err.message}`);
      }
    }

    setImportResults(results);
    setImporting(false);
    setStep(4);
  };

  const handleReset = () => {
    setStep(1); setRawRows([]); setMappedRows([]); setHeaders([]);
    setMapping({}); setImportResults(null); setParseError(''); setSelectedProperty('');
  };

  const inputStyle  = { padding: '8px 12px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '7px', color: '#1e293b', fontSize: '13px', width: '100%', boxSizing: 'border-box' };
  const labelStyle  = { fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' };
  const btnPrimary  = { padding: '10px 22px', backgroundColor: '#14B8A6', border: 'none', borderRadius: '8px', color: 'white', fontSize: '13px', fontWeight: '700', cursor: 'pointer' };
  const btnSecondary = { padding: '10px 18px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#94a3b8', fontSize: '13px', cursor: 'pointer' };

  const STEPS = ['Upload File', 'Map Columns', 'Preview & Confirm', 'Done'];

  return (
    <div style={{ padding: '24px', fontFamily: 'Arial, sans-serif', backgroundColor: '#ffffff', minHeight: '100vh', color: '#1e293b' }}>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: '700', color: '#0f172a' }}>CSV Import</h1>
        <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>Import residents from your delinquency spreadsheet. Supports CSV exports from Excel, AppFolio, Entrata, and manual trackers.</p>
      </div>

      {/* Step Indicator */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '28px' }}>
        {STEPS.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: step > i + 1 ? '#14B8A6' : step === i + 1 ? '#1B3A6B' : '#ffffff', border: `2px solid ${step >= i + 1 ? '#14B8A6' : '#cbd5e1'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: step >= i + 1 ? '#14B8A6' : '#475569', flexShrink: 0 }}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: '12px', fontWeight: step === i + 1 ? '700' : '400', color: step >= i + 1 ? '#1e293b' : '#475569', whiteSpace: 'nowrap' }}>{s}</span>
            </div>
            {i < STEPS.length - 1 && <div style={{ flex: 1, height: '2px', backgroundColor: step > i + 1 ? '#14B8A6' : '#ffffff', margin: '0 12px' }} />}
          </div>
        ))}
      </div>

      {parseError && <div style={{ color: '#dc2626', fontSize: '13px', marginBottom: '16px', padding: '12px 16px', backgroundColor: '#3a1e1e', borderRadius: '8px' }}>{parseError}</div>}

      {/* STEP 1 — Upload */}
      {step === 1 && (
        <div style={{ maxWidth: '600px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
            <h2 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>Select Property</h2>
            <select value={selectedProperty} onChange={e => setSelectedProperty(e.target.value)} style={inputStyle}>
              <option value=''>Choose property to import into...</option>
              {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
            <h2 style={{ margin: '0 0 8px', fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>Upload CSV File</h2>
            <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#94a3b8' }}>Export your delinquency tracker as CSV. Column names don't need to match exactly — you'll map them in the next step.</p>
            <label style={{ display: 'block', border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '40px', textAlign: 'center', cursor: 'pointer', backgroundColor: '#ffffff' }}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>📁</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px' }}>Click to upload CSV</div>
              <div style={{ fontSize: '12px', color: '#475569' }}>Exported from Excel, Google Sheets, AppFolio, Entrata, or your own tracker</div>
              <input type='file' accept='.csv,.txt' onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
          </div>

          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '13px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Expected Columns (any order)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {FIELDS.map(f => (
                <div key={f.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: f.required ? '#14B8A6' : '#cbd5e1', flexShrink: 0 }} />
                  <span style={{ color: f.required ? '#1e293b' : '#94a3b8' }}>{f.label}{f.required ? ' *' : ''}</span>
                </div>
              ))}
            </div>
            <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '12px' }}>* Required fields</div>
          </div>
        </div>
      )}

      {/* STEP 2 — Map Columns */}
      {step === 2 && (
        <div style={{ maxWidth: '700px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>Map Columns</h2>
              <div style={{ fontSize: '13px', color: '#94a3b8' }}>{rawRows.length} rows detected</div>
            </div>
            <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#94a3b8' }}>Match your spreadsheet columns to Servfixy fields. Auto-detected where possible.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {FIELDS.map(field => (
                <div key={field.key} style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '16px', alignItems: 'center' }}>
                  <div style={{ fontSize: '13px', color: field.required ? '#1e293b' : '#94a3b8', fontWeight: field.required ? '600' : '400' }}>
                    {field.label}{field.required ? <span style={{ color: '#14B8A6' }}> *</span> : ''}
                  </div>
                  <select
                    value={mapping[field.key] || ''}
                    onChange={e => setMapping(p => ({ ...p, [field.key]: e.target.value }))}
                    style={{ ...inputStyle, borderColor: mapping[field.key] ? '#14B8A6' : field.required ? '#dc2626' : '#cbd5e1' }}>
                    <option value=''>— Skip this field —</option>
                    {headers.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px' }}>
            <label style={labelStyle}>Default State (for jurisdiction)</label>
            <select value={defaultState} onChange={e => setDefaultState(e.target.value)} style={{ ...inputStyle, maxWidth: '200px' }}>
              {['TX','OH','TN','MO','WA'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={buildPreview} style={btnPrimary}>Preview Import →</button>
            <button onClick={handleReset} style={btnSecondary}>Start Over</button>
          </div>
        </div>
      )}

      {/* STEP 3 — Preview */}
      {step === 3 && (
        <div>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#15803d' }}>{mappedRows.filter(r => r._errors.length === 0).length}</div>
              <div style={{ fontSize: '11px', color: '#475569' }}>Ready to import</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#dc2626' }}>{mappedRows.filter(r => r._errors.length > 0).length}</div>
              <div style={{ fontSize: '11px', color: '#475569' }}>Rows with errors</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#1d4ed8' }}>{mappedRows.length}</div>
              <div style={{ fontSize: '11px', color: '#475569' }}>Total rows</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#dc2626' }}>
                ${mappedRows.filter(r => r._errors.length === 0).reduce((s, r) => s + Number(r.balance_owed || 0), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: '11px', color: '#475569' }}>Total balance</div>
            </div>
          </div>

          <div style={{ overflowX: 'auto', backgroundColor: '#ffffff', borderRadius: '12px', marginBottom: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ backgroundColor: '#ffffff' }}>
                  <th style={{ padding: '10px 12px', textAlign: 'left', color: '#94a3b8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', borderBottom: '1px solid #ffffff' }}>Status</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', color: '#94a3b8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', borderBottom: '1px solid #ffffff' }}>Resident</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', color: '#94a3b8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', borderBottom: '1px solid #ffffff' }}>Unit</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right', color: '#94a3b8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', borderBottom: '1px solid #ffffff' }}>Balance</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', color: '#94a3b8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', borderBottom: '1px solid #ffffff' }}>Aging</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', color: '#94a3b8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', borderBottom: '1px solid #ffffff' }}>Case Status</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', color: '#94a3b8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', borderBottom: '1px solid #ffffff' }}>Issues</th>
                </tr>
              </thead>
              <tbody>
                {mappedRows.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #ffffff', backgroundColor: row._errors.length > 0 ? '#1a0f0f' : 'transparent' }}>
                    <td style={{ padding: '8px 12px' }}>
                      {row._errors.length === 0
                        ? <span style={{ fontSize: '10px', color: '#15803d', fontWeight: '700' }}>✓ OK</span>
                        : <span style={{ fontSize: '10px', color: '#dc2626', fontWeight: '700' }}>✗ Error</span>}
                    </td>
                    <td style={{ padding: '8px 12px', color: '#1e293b', fontWeight: '600' }}>{row.resident_name || <span style={{ color: '#dc2626' }}>Missing</span>}</td>
                    <td style={{ padding: '8px 12px', color: '#94a3b8' }}>{row.unit_number || <span style={{ color: '#dc2626' }}>Missing</span>}</td>
                    <td style={{ padding: '8px 12px', color: '#dc2626', fontWeight: '700', textAlign: 'right' }}>${Number(row.balance_owed || 0).toFixed(2)}</td>
                    <td style={{ padding: '8px 12px' }}>
                      <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '4px', backgroundColor: '#ffffff', color: { '30-60': '#facc15', '61-90': '#ea580c', '91-120': '#dc2626', '120+': '#dc2626' }[row.aging_bucket] || '#94a3b8', fontWeight: '700' }}>
                        {row.aging_bucket}
                      </span>
                    </td>
                    <td style={{ padding: '8px 12px', color: '#94a3b8', fontSize: '11px' }}>{fmtStatus(row.status)}</td>
                    <td style={{ padding: '8px 12px', color: '#dc2626', fontSize: '11px' }}>{row._errors.join(', ') || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleImport} disabled={importing || mappedRows.filter(r => r._errors.length === 0).length === 0} style={{ ...btnPrimary, opacity: importing ? 0.7 : 1 }}>
              {importing ? 'Importing...' : `Import ${mappedRows.filter(r => r._errors.length === 0).length} Cases`}
            </button>
            <button onClick={() => setStep(2)} style={btnSecondary}>Back to Mapping</button>
            <button onClick={handleReset} style={btnSecondary}>Start Over</button>
          </div>
        </div>
      )}

      {/* STEP 4 — Done */}
      {step === 4 && importResults && (
        <div style={{ maxWidth: '560px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '32px', textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>{importResults.failed === 0 ? '✅' : '⚠️'}</div>
            <h2 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>Import Complete</h2>
            <p style={{ margin: '0 0 24px', fontSize: '13px', color: '#94a3b8' }}>
              {importResults.success} case{importResults.success !== 1 ? 's' : ''} imported successfully
              {importResults.failed > 0 ? `, ${importResults.failed} failed` : ''}.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
              <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '16px' }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#15803d' }}>{importResults.success}</div>
                <div style={{ fontSize: '12px', color: '#475569' }}>Imported</div>
              </div>
              <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '16px' }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color: importResults.failed > 0 ? '#dc2626' : '#cbd5e1' }}>{importResults.failed}</div>
                <div style={{ fontSize: '12px', color: '#475569' }}>Failed</div>
              </div>
            </div>
            {importResults.errors.length > 0 && (
              <div style={{ backgroundColor: '#3a1e1e', borderRadius: '8px', padding: '12px', marginBottom: '20px', textAlign: 'left' }}>
                {importResults.errors.map((e, i) => <div key={i} style={{ fontSize: '12px', color: '#dc2626', marginBottom: '4px' }}>{e}</div>)}
              </div>
            )}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={handleReset} style={btnPrimary}>Import Another File</button>
              <button onClick={() => window.location.reload()} style={btnSecondary}>Go to Cases</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// ── End Collections CSV Import ─────────────────────────────────────────────────

// ── Collections Court Date Calendar ───────────────────────────────────────────
function CollectionsCalendarTab({ token }) {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [view, setView] = useState('month'); // month | list

  const fmtStatus   = (s) => (s || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const fmtCurrency = (v) => '$' + Number(v || 0).toLocaleString('en-US', { minimumFractionDigits: 2 });

  const EVENT_TYPES = [
    { key: 'court_hearing_date',      label: 'Hearing',   color: '#7c3aed', icon: '⚖️' },
    { key: 'writ_file_date',          label: 'Writ',      color: '#dc2626', icon: '📄' },
    { key: 'possession_granted_date', label: 'Possession',color: '#15803d', icon: '🏠' },
    { key: 'fed_date',                label: 'FED',       color: '#ea580c', icon: '📋' },
    { key: 'notice_issued_date',      label: 'Notice',    color: '#facc15', icon: '📬' },
  ];

  useEffect(() => {
    fetch(`${API_URL}/api/collections/cases`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setCases(data.filter(c => !['closed_paid','closed_written_off'].includes(c.status)));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  // Build events map: { 'YYYY-MM-DD': [{ case, type, label, color, icon }] }
  const eventsByDate = {};
  cases.forEach(c => {
    EVENT_TYPES.forEach(et => {
      const dateVal = c[et.key];
      if (!dateVal) return;
      const key = dateVal.split('T')[0];
      if (!eventsByDate[key]) eventsByDate[key] = [];
      eventsByDate[key].push({ case: c, ...et });
    });
  });

  // Calendar grid
  const year  = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date().toISOString().split('T')[0];

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const monthLabel = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Upcoming events list (next 60 days)
  const upcoming = [];
  const now = new Date();
  const cutoff = new Date(now); cutoff.setDate(cutoff.getDate() + 60);
  Object.entries(eventsByDate).forEach(([date, events]) => {
    const d = new Date(date + 'T12:00:00');
    if (d >= now && d <= cutoff) {
      events.forEach(e => upcoming.push({ date, ...e }));
    }
  });
  upcoming.sort((a, b) => a.date.localeCompare(b.date));

  // Past due events
  const pastDue = [];
  Object.entries(eventsByDate).forEach(([date, events]) => {
    if (date < today) {
      events.forEach(e => {
        if (['court_hearing_date','writ_file_date','fed_date'].includes(e.key)) {
          pastDue.push({ date, ...e });
        }
      });
    }
  });

  const selectedEvents = selectedDate ? (eventsByDate[selectedDate] || []) : [];

  return (
    <div style={{ padding: '24px', fontFamily: 'Arial, sans-serif', backgroundColor: '#ffffff', minHeight: '100vh', color: '#1e293b' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: '700', color: '#0f172a' }}>Court Date Calendar</h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>All upcoming legal dates across your portfolio. Click a date to see cases.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['month','list'].map(v => (
            <button key={v} onClick={() => setView(v)}
              style={{ padding: '7px 16px', backgroundColor: view === v ? '#14B8A6' : '#ffffff', border: `1px solid ${view === v ? '#14B8A6' : '#cbd5e1'}`, borderRadius: '7px', color: view === v ? 'white' : '#94a3b8', fontSize: '12px', fontWeight: '600', cursor: 'pointer', textTransform: 'capitalize' }}>
              {v === 'month' ? '📅 Month' : '📋 Upcoming'}
            </button>
          ))}
        </div>
      </div>

      {/* Alert strip — past due */}
      {pastDue.length > 0 && (
        <div style={{ backgroundColor: '#3a1e1e', border: '1px solid #dc2626', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#dc2626' }}>⚠️ {pastDue.length} overdue legal date{pastDue.length > 1 ? 's' : ''} — review immediately</div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {pastDue.slice(0, 3).map((e, i) => (
              <span key={i} style={{ fontSize: '11px', color: '#dc2626', backgroundColor: '#ffffff', padding: '2px 8px', borderRadius: '4px' }}>
                {e.icon} {e.case.resident_name} — {e.label} ({e.date})
              </span>
            ))}
            {pastDue.length > 3 && <span style={{ fontSize: '11px', color: '#94a3b8' }}>+{pastDue.length - 3} more</span>}
          </div>
        </div>
      )}

      {/* Legend */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {EVENT_TYPES.map(et => (
          <div key={et.key} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#94a3b8' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: et.color, display: 'inline-block' }} />
            {et.icon} {et.label}
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: '#475569', padding: '48px' }}>Loading calendar...</div>
      ) : view === 'month' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px' }}>

          {/* Calendar Grid */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', overflow: 'hidden' }}>
            {/* Month Nav */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #ffffff' }}>
              <button onClick={prevMonth} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '18px', cursor: 'pointer' }}>‹</button>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>{monthLabel}</div>
              <button onClick={nextMonth} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '18px', cursor: 'pointer' }}>›</button>
            </div>

            {/* Day headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid #ffffff' }}>
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                <div key={d} style={{ padding: '8px', textAlign: 'center', fontSize: '11px', color: '#475569', fontWeight: '600', textTransform: 'uppercase' }}>{d}</div>
              ))}
            </div>

            {/* Calendar days */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
              {/* Empty cells */}
              {Array(firstDay).fill(null).map((_, i) => (
                <div key={`empty-${i}`} style={{ minHeight: '80px', borderRight: '1px solid #ffffff', borderBottom: '1px solid #ffffff' }} />
              ))}
              {/* Day cells */}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                const dateStr = `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                const events = eventsByDate[dateStr] || [];
                const isToday = dateStr === today;
                const isSelected = dateStr === selectedDate;
                const isPast = dateStr < today && events.length > 0;
                return (
                  <div key={day} onClick={() => setSelectedDate(dateStr === selectedDate ? null : dateStr)}
                    style={{ minHeight: '80px', borderRight: '1px solid #ffffff', borderBottom: '1px solid #ffffff', padding: '6px', cursor: events.length > 0 ? 'pointer' : 'default', backgroundColor: isSelected ? '#1B3A6B' : isToday ? '#0f2a1a' : 'transparent', transition: 'background 0.1s' }}>
                    <div style={{ fontSize: '13px', fontWeight: isToday ? '800' : '400', color: isToday ? '#14B8A6' : '#94a3b8', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{day}</span>
                      {events.length > 0 && <span style={{ fontSize: '10px', backgroundColor: isPast ? '#dc2626' : '#14B8A6', color: 'white', borderRadius: '10px', padding: '1px 5px', fontWeight: '700' }}>{events.length}</span>}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {events.slice(0, 3).map((e, ei) => (
                        <div key={ei} style={{ fontSize: '9px', backgroundColor: e.color + '22', color: e.color, padding: '1px 4px', borderRadius: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: '600' }}>
                          {e.icon} {e.case.resident_name.split(' ')[0]}
                        </div>
                      ))}
                      {events.length > 3 && <div style={{ fontSize: '9px', color: '#475569' }}>+{events.length - 3}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Side Panel — selected date or upcoming */}
          <div>
            {selectedDate && selectedEvents.length > 0 ? (
              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px' }}>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>
                  {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px' }}>{selectedEvents.length} event{selectedEvents.length > 1 ? 's' : ''}</div>
                {selectedEvents.map((e, i) => (
                  <div key={i} style={{ padding: '12px', backgroundColor: '#ffffff', borderRadius: '8px', marginBottom: '10px', borderLeft: `3px solid ${e.color}` }}>
                    <div style={{ fontSize: '11px', color: e.color, fontWeight: '700', marginBottom: '4px', textTransform: 'uppercase' }}>{e.icon} {e.label}</div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>{e.case.resident_name}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Unit {e.case.unit_number} · {e.case.property_name}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>{fmtStatus(e.case.status)}</span>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: '#dc2626' }}>{fmtCurrency(e.case.balance_owed)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', marginBottom: '14px' }}>Next 60 Days ({upcoming.length})</div>
                {upcoming.length === 0 ? (
                  <div style={{ color: '#475569', fontSize: '13px' }}>No upcoming legal dates.</div>
                ) : upcoming.slice(0, 15).map((e, i) => (
                  <div key={i} style={{ padding: '10px 12px', backgroundColor: '#ffffff', borderRadius: '8px', marginBottom: '8px', borderLeft: `3px solid ${e.color}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span style={{ fontSize: '10px', color: e.color, fontWeight: '700', textTransform: 'uppercase' }}>{e.icon} {e.label}</span>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>{new Date(e.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>{e.case.resident_name}</div>
                    <div style={{ fontSize: '11px', color: '#475569' }}>Unit {e.case.unit_number} · {e.case.property_name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      ) : (
        /* LIST VIEW */
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Upcoming Legal Dates — Next 60 Days</div>
            <div style={{ fontSize: '13px', color: '#94a3b8' }}>{upcoming.length} events</div>
          </div>
          {upcoming.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#475569' }}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>📅</div>
              <div style={{ fontSize: '14px' }}>No upcoming legal dates in the next 60 days</div>
            </div>
          ) : upcoming.map((e, i) => {
            const daysUntil = Math.ceil((new Date(e.date + 'T12:00:00') - new Date()) / 86400000);
            return (
              <div key={i} style={{ padding: '14px 20px', borderBottom: '1px solid #ffffff', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '60px', textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: daysUntil <= 3 ? '#dc2626' : daysUntil <= 7 ? '#ea580c' : '#14B8A6' }}>{daysUntil}d</div>
                  <div style={{ fontSize: '10px', color: '#475569' }}>away</div>
                </div>
                <div style={{ width: '3px', height: '40px', backgroundColor: e.color, borderRadius: '2px', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '11px', color: e.color, fontWeight: '700', textTransform: 'uppercase', marginBottom: '3px' }}>{e.icon} {e.label}</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>{e.case.resident_name}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>Unit {e.case.unit_number} · {e.case.property_name} · {e.case.property_state}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#dc2626' }}>{fmtCurrency(e.case.balance_owed)}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>{new Date(e.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  {e.case.attorney_name && <div style={{ fontSize: '11px', color: '#7c3aed', marginTop: '2px' }}>⚖️ {e.case.attorney_name}</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
// ── End Collections Court Date Calendar ───────────────────────────────────────

// ── Collections Owner Summary ──────────────────────────────────────────────────
function CollectionsOwnerSummaryTab({ token }) {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState('all');
  const [summaryData, setSummaryData] = useState(null);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ownerName, setOwnerName] = useState('');
  const [shareMode, setShareMode] = useState(false);

  const fmtCurrency = (v) => '$' + Number(v || 0).toLocaleString('en-US', { minimumFractionDigits: 2 });
  const fmtStatus   = (s) => (s || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const fmtDate     = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
  const AGING_COLORS = { '30-60': '#facc15', '61-90': '#ea580c', '91-120': '#dc2626', '120+': '#dc2626' };

  const loadData = async (propId) => {
    setLoading(true);
    try {
      const [propRes, caseRes] = await Promise.all([
        fetch(`${API_URL}/api/properties`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/collections/cases${propId && propId !== 'all' ? `?property_id=${propId}` : ''}`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const propsData = await propRes.json();
      const casesData = await caseRes.json();
      setProperties(Array.isArray(propsData) ? propsData : []);
      const activeCases = Array.isArray(casesData) ? casesData.filter(c => !['closed_paid','closed_written_off'].includes(c.status)) : [];
      setCases(activeCases);

      // Build summary
      const agingBuckets = { '30-60': 0, '61-90': 0, '91-120': 0, '120+': 0 };
      activeCases.forEach(c => { if (agingBuckets[c.aging_bucket] !== undefined) agingBuckets[c.aging_bucket]++; });
      setSummaryData({
        total_cases: activeCases.length,
        total_balance: activeCases.reduce((s, c) => s + Number(c.balance_owed || 0), 0),
        aging: agingBuckets,
        in_legal: activeCases.filter(c => ['filed_with_attorney','fed','writ_filed','hearing_scheduled','possession_granted'].includes(c.status)).length,
        active_plans: 0, // would need payment plans data
        generated_at: new Date().toISOString(),
      });
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData('all'); }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePropertyChange = (e) => {
    setSelectedProperty(e.target.value);
    loadData(e.target.value);
  };

  const selectedPropName = selectedProperty === 'all'
    ? 'All Properties'
    : (properties.find(p => p.id === selectedProperty)?.name || '');

  // Share / print function
  const handlePrint = () => window.print();

  const maxAging = summaryData ? Math.max(...Object.values(summaryData.aging), 1) : 1;

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#ffffff', minHeight: '100vh', color: '#1e293b' }}>
      {/* Controls bar — hidden in share mode */}
      {!shareMode && (
        <div style={{ padding: '24px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          <div>
            <h1 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: '700', color: '#0f172a' }}>Owner Collections Summary</h1>
            <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>Read-only delinquency overview for property owners. Print or share as a PDF.</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <select value={selectedProperty} onChange={handlePropertyChange}
              style={{ padding: '8px 12px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '7px', color: '#1e293b', fontSize: '13px' }}>
              <option value='all'>All Properties</option>
              {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <input value={ownerName} onChange={e => setOwnerName(e.target.value)}
              placeholder='Owner name (optional)'
              style={{ padding: '8px 12px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '7px', color: '#1e293b', fontSize: '13px', width: '180px' }} />
            <button onClick={handlePrint}
              style={{ padding: '8px 16px', backgroundColor: '#14B8A6', border: 'none', borderRadius: '7px', color: 'white', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
              🖨️ Print / Save PDF
            </button>
          </div>
        </div>
      )}

      {/* Report body */}
      <div style={{ padding: '0 24px 24px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#475569', padding: '48px' }}>Loading summary...</div>
        ) : summaryData ? (
          <div>
            {/* Report Header */}
            <div style={{ backgroundColor: '#1B3A6B', borderRadius: '12px', padding: '24px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: '#14B8A6', marginBottom: '4px' }}>
                  Servfixy Collections — Delinquency Report
                </div>
                <div style={{ fontSize: '14px', color: '#93c5fd' }}>{selectedPropName}</div>
                {ownerName && <div style={{ fontSize: '13px', color: '#1d4ed8', marginTop: '4px' }}>Prepared for: {ownerName}</div>}
                <div style={{ fontSize: '12px', color: '#475569', marginTop: '6px' }}>Generated {fmtDate(summaryData.generated_at)}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '32px', fontWeight: '900', color: '#dc2626' }}>{fmtCurrency(summaryData.total_balance)}</div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Total Delinquent Balance</div>
              </div>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px', marginBottom: '20px' }}>
              {[
                { label: 'Active Cases', value: summaryData.total_cases, color: '#1d4ed8' },
                { label: 'Total Balance', value: fmtCurrency(summaryData.total_balance), color: '#dc2626' },
                { label: 'In Legal Pipeline', value: summaryData.in_legal, color: '#7c3aed' },
                { label: 'Report Date', value: fmtDate(new Date()), color: '#14B8A6' },
              ].map((k, i) => (
                <div key={i} style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '16px', borderTop: `3px solid ${k.color}` }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase' }}>{k.label}</div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: k.color }}>{k.value}</div>
                </div>
              ))}
            </div>

            {/* Aging Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Delinquency Aging</h3>
                {Object.entries(summaryData.aging).map(([bucket, count]) => (
                  <div key={bucket} style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: AGING_COLORS[bucket] }}>{bucket} Days</span>
                      <span style={{ fontSize: '13px', color: '#94a3b8' }}>{count} {count === 1 ? 'case' : 'cases'}</span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: '#ffffff', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${(count / maxAging) * 100}%`, height: '100%', backgroundColor: AGING_COLORS[bucket], borderRadius: '4px', transition: 'width 0.4s' }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Pipeline Summary */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Pipeline Summary</h3>
                {[
                  { label: 'Active — No Action Yet', count: cases.filter(c => c.status === 'active').length, color: '#1d4ed8' },
                  { label: 'Notice Issued', count: cases.filter(c => c.status === 'notice_issued').length, color: '#facc15' },
                  { label: 'Filed with Attorney', count: cases.filter(c => c.status === 'filed_with_attorney').length, color: '#ea580c' },
                  { label: 'FED / Writ / Hearing', count: cases.filter(c => ['fed','writ_filed','hearing_scheduled'].includes(c.status)).length, color: '#dc2626' },
                  { label: 'Possession Granted', count: cases.filter(c => c.status === 'possession_granted').length, color: '#15803d' },
                ].map((row, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #ffffff' }}>
                    <span style={{ fontSize: '13px', color: '#94a3b8' }}>{row.label}</span>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: row.color }}>{row.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Case Table — read only, no sensitive legal detail */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #ffffff' }}>
                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Active Cases ({cases.length})</h3>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#ffffff' }}>
                      {['Unit', 'Resident', 'Property', 'Balance', 'Aging', 'Stage'].map(h => (
                        <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#94a3b8', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', borderBottom: '1px solid #ffffff' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cases.length === 0 ? (
                      <tr><td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#475569' }}>No active cases</td></tr>
                    ) : cases.map((c, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #ffffff' }}>
                        <td style={{ padding: '10px 14px', color: '#94a3b8', fontWeight: '600' }}>{c.unit_number}</td>
                        <td style={{ padding: '10px 14px', color: '#0f172a', fontWeight: '600' }}>{c.resident_name}</td>
                        <td style={{ padding: '10px 14px', color: '#94a3b8' }}>{c.property_name}</td>
                        <td style={{ padding: '10px 14px', color: '#dc2626', fontWeight: '700' }}>{fmtCurrency(c.balance_owed)}</td>
                        <td style={{ padding: '10px 14px' }}>
                          <span style={{ fontSize: '11px', padding: '2px 7px', borderRadius: '4px', backgroundColor: '#ffffff', color: AGING_COLORS[c.aging_bucket] || '#94a3b8', fontWeight: '700' }}>{c.aging_bucket}</span>
                        </td>
                        <td style={{ padding: '10px 14px', color: '#94a3b8', fontSize: '12px' }}>{fmtStatus(c.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ backgroundColor: '#ffffff', borderTop: '2px solid #cbd5e1' }}>
                      <td colSpan={3} style={{ padding: '10px 14px', color: '#0f172a', fontWeight: '700', fontSize: '13px' }}>TOTAL</td>
                      <td style={{ padding: '10px 14px', color: '#dc2626', fontWeight: '800', fontSize: '14px' }}>{fmtCurrency(summaryData.total_balance)}</td>
                      <td colSpan={2}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '16px 20px', backgroundColor: '#ffffff', borderRadius: '10px', fontSize: '11px', color: '#475569', textAlign: 'center' }}>
              This report is confidential and prepared exclusively for property management purposes. Generated by Servfixy Collections · {fmtDate(new Date())}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
// ── End Collections Owner Summary ──────────────────────────────────────────────

// ── Collections Onboarding Checklist ──────────────────────────────────────────
function CollectionsOnboardingTab({ token }) {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState('');
  const [propData, setPropData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [billingStatus, setBillingStatus] = useState(null);
  const [caseCount, setCaseCount] = useState(0);
  const [ruleCount, setRuleCount] = useState(0);
  const [supervisorEmail] = useState(localStorage.getItem('collections_supervisor_email') || '');

  // Checklist state — persisted per property in localStorage
  const getChecklist = (propId) => {
    try { return JSON.parse(localStorage.getItem(`collections_checklist_${propId}`) || '{}'); }
    catch { return {}; }
  };
  const saveChecklist = (propId, data) => {
    localStorage.setItem(`collections_checklist_${propId}`, JSON.stringify(data));
  };

  const [checklist, setChecklist] = useState({});

  const STEPS = [
    {
      id: 'module_enabled', label: 'Enable Collections Module',
      description: 'Toggle Collections ON for this property in the Properties tab.',
      check: () => propData?.collections_enabled === true,
      action: null,
    },
    {
      id: 'billing_active', label: 'Activate Billing',
      description: 'Set up a Stripe subscription ($6/unit/mo Collections or $15/unit/mo Bundle).',
      check: () => billingStatus?.status === 'active' || billingStatus?.status === 'trialing',
      action: null,
    },
    {
      id: 'jurisdiction_confirmed', label: 'Confirm State Jurisdiction',
      description: 'Verify property state is correct — notice periods differ by state (TX/OH: 3 days, TN/WA: 14 days, MO: 3 days).',
      check: () => checklist.jurisdiction_confirmed,
      manual: true,
    },
    {
      id: 'coordinators_added', label: 'Add Coordinator Names',
      description: 'Enter coordinator names in the Coordinator Workspace so cases can be assigned.',
      check: () => checklist.coordinators_added,
      manual: true,
    },
    {
      id: 'escalation_rules', label: 'Configure Escalation Rules',
      description: 'Set up at least one escalation rule in the Escalation Rules tab.',
      check: () => ruleCount > 0,
      action: null,
    },
    {
      id: 'supervisor_email', label: 'Set Supervisor Email',
      description: 'Enter a supervisor email in the Escalation Rules tab so email alerts can be sent.',
      check: () => !!supervisorEmail,
      action: null,
    },
    {
      id: 'residents_imported', label: 'Import Delinquent Residents',
      description: 'Import your delinquency spreadsheet using the Import Cases tab, or add cases manually.',
      check: () => caseCount > 0,
      action: null,
    },
    {
      id: 'first_notice', label: 'Generate First Notice (Optional)',
      description: 'Open a case and generate a Pay or Quit notice for your oldest/highest-balance resident.',
      check: () => checklist.first_notice,
      manual: true,
    },
    {
      id: 'coordinator_briefed', label: 'Brief Coordinator on Workflow',
      description: 'Walk coordinator through Coordinator Workspace: task queue, logging contacts, advancing status.',
      check: () => checklist.coordinator_briefed,
      manual: true,
    },
    {
      id: 'go_live', label: 'Go Live',
      description: 'Collections is active. Review the Court Calendar weekly, run Portfolio Summary monthly, send supervisor alerts when rules fire.',
      check: () => checklist.go_live,
      manual: true,
    },
  ];

  const loadPropertyData = async (propId) => {
    if (!propId) return;
    setLoading(true);
    try {
      const [propRes, billingRes, casesRes] = await Promise.all([
        fetch(`${API_URL}/api/properties`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/billing/${propId}/collections-status`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/collections/cases?property_id=${propId}`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const propsData = await propRes.json();
      const billing   = await billingRes.json();
      const casesData = await casesRes.json();
      const prop = Array.isArray(propsData) ? propsData.find(p => p.id === propId) : null;
      setPropData(prop);
      setBillingStatus(billing);
      setCaseCount(Array.isArray(casesData) ? casesData.length : 0);
      setChecklist(getChecklist(propId));
      const savedRules = JSON.parse(localStorage.getItem('collections_escalation_rules') || '[]');
      setRuleCount(savedRules.filter(r => r.active).length);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetch(`${API_URL}/api/properties`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setProperties(Array.isArray(d) ? d : [])).catch(() => {});
  }, [token]);

  const handlePropertyChange = (e) => {
    setSelectedProperty(e.target.value);
    loadPropertyData(e.target.value);
  };

  const toggleManual = (stepId) => {
    const updated = { ...checklist, [stepId]: !checklist[stepId] };
    setChecklist(updated);
    saveChecklist(selectedProperty, updated);
  };

  const completedCount = STEPS.filter(s => s.check()).length;
  const pct = Math.round((completedCount / STEPS.length) * 100);
  const allDone = completedCount === STEPS.length;

  const STATE_RULES = { TX: '3 days', OH: '3 days', MO: '3 days', TN: '14 days', WA: '14 days' };
  const propState = propData?.state;

  return (
    <div style={{ padding: '24px', fontFamily: 'Arial, sans-serif', backgroundColor: '#ffffff', minHeight: '100vh', color: '#1e293b' }}>

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: '700', color: '#0f172a' }}>Collections Onboarding</h1>
        <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>Complete each step to activate Collections for a property.</p>
      </div>

      {/* Property Selector */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
        <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Select Property to Onboard</label>
        <select value={selectedProperty} onChange={handlePropertyChange}
          style={{ padding: '9px 14px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#1e293b', fontSize: '14px', width: '100%', maxWidth: '400px' }}>
          <option value=''>Choose property...</option>
          {properties.map(p => <option key={p.id} value={p.id}>{p.name} ({p.state})</option>)}
        </select>
      </div>

      {selectedProperty && !loading && (
        <>
          {/* Progress Bar */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
                {propData?.name} — {allDone ? '🎉 Ready to Go' : `${completedCount} of ${STEPS.length} complete`}
              </div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: allDone ? '#15803d' : '#14B8A6' }}>{pct}%</div>
            </div>
            <div style={{ height: '10px', backgroundColor: '#ffffff', borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, height: '100%', backgroundColor: allDone ? '#15803d' : '#14B8A6', borderRadius: '5px', transition: 'width 0.4s ease' }} />
            </div>
            {propState && (
              <div style={{ marginTop: '10px', fontSize: '12px', color: '#94a3b8' }}>
                State: <span style={{ color: '#14B8A6', fontWeight: '600' }}>{propState}</span>
                {STATE_RULES[propState] && <span style={{ color: '#94a3b8' }}> · Notice period: <span style={{ color: '#facc15', fontWeight: '600' }}>{STATE_RULES[propState]}</span></span>}
              </div>
            )}
          </div>

          {/* Checklist */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {STEPS.map((step, i) => {
              const done = step.check();
              return (
                <div key={step.id} style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '16px 20px', borderLeft: `4px solid ${done ? '#15803d' : '#cbd5e1'}`, display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: done ? '#1c3a2e' : '#ffffff', border: `2px solid ${done ? '#15803d' : '#cbd5e1'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    {done ? <span style={{ color: '#15803d', fontSize: '14px', fontWeight: '900' }}>✓</span>
                           : <span style={{ color: '#475569', fontSize: '12px', fontWeight: '700' }}>{i + 1}</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: done ? '#15803d' : '#0f172a', marginBottom: '4px' }}>{step.label}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5' }}>{step.description}</div>
                    {step.manual && !done && (
                      <button onClick={() => toggleManual(step.id)}
                        style={{ marginTop: '10px', fontSize: '11px', padding: '4px 12px', backgroundColor: '#14B8A6', border: 'none', borderRadius: '5px', color: 'white', cursor: 'pointer', fontWeight: '600' }}>
                        Mark Complete
                      </button>
                    )}
                    {step.manual && done && (
                      <button onClick={() => toggleManual(step.id)}
                        style={{ marginTop: '10px', fontSize: '11px', padding: '4px 12px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '5px', color: '#94a3b8', cursor: 'pointer' }}>
                        Undo
                      </button>
                    )}
                  </div>
                  <div style={{ fontSize: '20px', flexShrink: 0 }}>{done ? '✅' : '⬜'}</div>
                </div>
              );
            })}
          </div>

          {allDone && (
            <div style={{ backgroundColor: '#1c3a2e', border: '1px solid #15803d', borderRadius: '12px', padding: '24px', marginTop: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>🎉</div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#15803d', marginBottom: '8px' }}>Collections Active for {propData?.name}</div>
              <div style={{ fontSize: '13px', color: '#94a3b8' }}>All onboarding steps complete. Your coordinator is ready to work cases.</div>
            </div>
          )}
        </>
      )}

      {loading && <div style={{ textAlign: 'center', color: '#475569', padding: '48px' }}>Loading property data...</div>}
      {!selectedProperty && !loading && (
        <div style={{ textAlign: 'center', color: '#cbd5e1', padding: '48px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
          <div style={{ fontSize: '15px', color: '#475569' }}>Select a property to start the onboarding checklist</div>
        </div>
      )}
    </div>
  );
}
// ── End Collections Onboarding Checklist ──────────────────────────────────────


// ── Collections Risk Tab ───────────────────────────────────────────────────────
function CollectionsRiskTab({ token }) {
  const [subView, setSubView] = useState('dashboard');
  const [dashboard, setDashboard] = useState(null);
  const [flags, setFlags] = useState([]);
  const [predictive, setPredictive] = useState(null);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scoring, setScoring] = useState(false);
  const [flagFilter, setFlagFilter] = useState({ status: 'open', severity: '', dimension: '' });
  const [showManualFlag, setShowManualFlag] = useState(false);
  const [manualForm, setManualForm] = useState({ case_id: '', flag_type: '', dimension: 'financial', severity: 'medium', description: '' });
  const [cases, setCases] = useState([]);
  const [seeding, setSeeding] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'https://servfixy-production.up.railway.app';
  const h = { Authorization: `Bearer ${token}` };

  const fetchDashboard = async () => {
    try {
      const r = await fetch(`${API_URL}/api/collections/risk/dashboard`, { headers: h });
      const d = await r.json();
      setDashboard(d);
    } catch (err) { console.error(err); }
  };

  const fetchFlags = async () => {
    try {
      const params = new URLSearchParams();
      if (flagFilter.status)    params.set('status', flagFilter.status);
      if (flagFilter.severity)  params.set('severity', flagFilter.severity);
      if (flagFilter.dimension) params.set('dimension', flagFilter.dimension);
      const r = await fetch(`${API_URL}/api/collections/risk/flags?${params}`, { headers: h });
      setFlags(await r.json());
    } catch (err) { console.error(err); }
  };

  const fetchPredictive = async () => {
    try {
      const r = await fetch(`${API_URL}/api/collections/risk/predictive`, { headers: h });
      setPredictive(await r.json());
    } catch (err) { console.error(err); }
  };

  const fetchRules = async () => {
    try {
      const r = await fetch(`${API_URL}/api/collections/risk/rules`, { headers: h });
      setRules(await r.json());
    } catch (err) { console.error(err); }
  };

  const fetchCases = async () => {
    try {
      const r = await fetch(`${API_URL}/api/collections/cases`, { headers: h });
      const d = await r.json();
      setCases(Array.isArray(d) ? d : []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchDashboard(), fetchRules(), fetchCases()]).finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (subView === 'register') fetchFlags();
    if (subView === 'predictive') fetchPredictive();
  }, [subView, flagFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleScoreAll = async () => {
    setScoring(true);
    try {
      await fetch(`${API_URL}/api/collections/risk/score-all`, { method: 'POST', headers: h });
      await fetchDashboard();
      alert('All cases rescored.');
    } catch (err) { console.error(err); }
    setScoring(false);
  };

  const handleSeedRules = async () => {
    setSeeding(true);
    try {
      await fetch(`${API_URL}/api/collections/risk/rules/seed`, { method: 'POST', headers: h });
      await fetchRules();
      alert('Default rules seeded.');
    } catch (err) { console.error(err); }
    setSeeding(false);
  };

  const handleToggleRule = async (ruleId, enabled) => {
    await fetch(`${API_URL}/api/collections/risk/rules/${ruleId}`, {
      method: 'PATCH', headers: { ...h, 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled })
    });
    fetchRules();
  };

  const handleUpdateFlag = async (flagId, status) => {
    await fetch(`${API_URL}/api/collections/risk/flags/${flagId}`, {
      method: 'PATCH', headers: { ...h, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchFlags();
    fetchDashboard();
  };

  const handleManualFlag = async () => {
    if (!manualForm.case_id || !manualForm.flag_type || !manualForm.description) {
      alert('Case, flag type, and description are required.'); return;
    }
    await fetch(`${API_URL}/api/collections/risk/flags`, {
      method: 'POST', headers: { ...h, 'Content-Type': 'application/json' },
      body: JSON.stringify(manualForm)
    });
    setShowManualFlag(false);
    setManualForm({ case_id: '', flag_type: '', dimension: 'financial', severity: 'medium', description: '' });
    fetchFlags(); fetchDashboard();
  };

  const scoreColor = (s) => {
    if (s >= 70) return '#dc2626';
    if (s >= 40) return '#ea580c';
    return '#15803d';
  };

  const severityColor = (s) => ({
    critical: '#dc2626', high: '#ea580c', medium: '#d97706', low: '#15803d'
  }[s] || '#94a3b8');

  const dimensionLabel = (d) => ({
    financial: '💰 Financial', legal: '⚖️ Legal', recovery: '🔍 Recovery', escalation: '⚡ Escalation'
  }[d] || d);

  const fmtCurrency = (v) => `$${parseFloat(v || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  const panelStyle = { backgroundColor: '#ffffff', border: '1px solid #1e293b', borderRadius: '10px', padding: '20px', marginBottom: '16px' };
  const inputStyle = { backgroundColor: '#ffffff', border: '1px solid #1e293b', borderRadius: '6px', color: '#0f172a', padding: '8px 10px', fontSize: '13px', width: '100%', boxSizing: 'border-box' };
  const btnPrimary = { background: '#1d4ed8', border: 'none', borderRadius: '6px', color: '#fff', padding: '8px 16px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' };
  const btnGhost = { backgroundColor: 'transparent', border: '1px solid #1e293b', borderRadius: '6px', color: '#94a3b8', padding: '7px 14px', fontSize: '12px', cursor: 'pointer' };

  const subTabs = [
    { id: 'dashboard',  label: '📊 Dashboard' },
    { id: 'register',   label: '🚩 Risk Register' },
    { id: 'predictive', label: '🔮 Predictive Alerts' },
    { id: 'rules',      label: '⚙️ Rules Engine' },
  ];

  return (
    <div style={{ padding: '28px', maxWidth: '1200px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: '#0f172a' }}>Collections Risk</h1>
          <div style={{ fontSize: '13px', color: '#2563eb', marginTop: '3px' }}>Risk scoring, flags, and predictive analysis</div>
        </div>
        <button onClick={handleScoreAll} disabled={scoring} style={btnPrimary}>
          {scoring ? 'Scoring...' : '↻ Rescore All Cases'}
        </button>
      </div>

      {/* Sub-tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '24px', borderBottom: '1px solid #1e293b', paddingBottom: '0' }}>
        {subTabs.map(t => (
          <div key={t.id} onClick={() => setSubView(t.id)}
            style={{ padding: '9px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: subView === t.id ? '700' : '400',
              color: subView === t.id ? '#1d4ed8' : '#94a3b8',
              borderBottom: subView === t.id ? '2px solid #3b82f6' : '2px solid transparent',
              marginBottom: '-1px' }}>
            {t.label}
          </div>
        ))}
      </div>

      {loading && <div style={{ color: '#94a3b8', fontSize: '14px' }}>Loading...</div>}

      {/* ── DASHBOARD ── */}
      {subView === 'dashboard' && dashboard && (
        <div>
          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '14px', marginBottom: '24px' }}>
            {[
              { label: 'Total Cases Scored', value: dashboard.summary?.total_cases || 0, color: '#7c3aed' },
              { label: 'Critical Risk (70+)', value: dashboard.summary?.critical_cases || 0, color: '#dc2626' },
              { label: 'Medium Risk (40-69)', value: dashboard.summary?.medium_cases || 0, color: '#ea580c' },
              { label: 'Low Risk (<40)', value: dashboard.summary?.low_cases || 0, color: '#15803d' },
              { label: 'Avg Risk Score', value: dashboard.summary?.avg_risk_score || '—', color: '#d97706' },
              { label: 'Open Flags', value: dashboard.summary?.open_flags || 0, color: '#dc2626' },
            ].map((k, i) => (
              <div key={i} style={{ ...panelStyle, padding: '16px', textAlign: 'center', marginBottom: 0 }}>
                <div style={{ fontSize: '26px', fontWeight: '800', color: k.color }}>{k.value}</div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>{k.label}</div>
              </div>
            ))}
          </div>

          {/* Top Risk Cases */}
          <div style={panelStyle}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '16px' }}>🔴 Highest Risk Cases</div>
            {!dashboard.top_cases?.length && <div style={{ color: '#94a3b8', fontSize: '13px' }}>No scored cases yet. Click "Rescore All Cases" to generate scores.</div>}
            {dashboard.top_cases?.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid #eff6ff' }}>
                {/* Risk badge */}
                <div style={{ minWidth: '48px', textAlign: 'center', background: scoreColor(c.total_score) + '22', border: `1px solid ${scoreColor(c.total_score)}`, borderRadius: '8px', padding: '6px 4px' }}>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: scoreColor(c.total_score) }}>{c.total_score ?? '—'}</div>
                  <div style={{ fontSize: '9px', color: '#94a3b8' }}>SCORE</div>
                </div>
                {/* Case info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>{c.resident_name}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Unit {c.unit_number} · {c.property_name}</div>
                </div>
                <div style={{ fontSize: '13px', color: '#ea580c', fontWeight: '600' }}>{fmtCurrency(c.balance_owed)}</div>
                {/* Dimension bars */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: '140px' }}>
                  {[['F', c.financial_score,'#7c3aed'],['L', c.legal_score,'#dc2626'],['R', c.recovery_score,'#ea580c'],['E', c.escalation_score,'#d97706']].map(([lbl,val,col]) => (
                    <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div style={{ width: '10px', fontSize: '9px', color: '#94a3b8' }}>{lbl}</div>
                      <div style={{ flex: 1, height: '5px', backgroundColor: '#eff6ff', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${val || 0}%`, height: '100%', backgroundColor: col, borderRadius: '3px' }} />
                      </div>
                      <div style={{ width: '22px', fontSize: '9px', color: col, textAlign: 'right' }}>{val ?? '—'}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Upcoming Deadlines */}
          {dashboard.upcoming_deadlines?.length > 0 && (
            <div style={panelStyle}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#dc2626', marginBottom: '14px' }}>⏰ Deadlines This Week</div>
              {dashboard.upcoming_deadlines.map((d, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #eff6ff' }}>
                  <div>
                    <div style={{ fontSize: '13px', color: '#0f172a', fontWeight: '600' }}>{d.resident_name} · Unit {d.unit_number}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>{d.property_name}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {d.possession_date && <div style={{ fontSize: '12px', color: '#dc2626' }}>Possession: {fmtDate(d.possession_date)}</div>}
                    {d.court_date && <div style={{ fontSize: '12px', color: '#ea580c' }}>Court: {fmtDate(d.court_date)}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── RISK REGISTER ── */}
      {subView === 'register' && (
        <div>
          {/* Filters + Add Flag */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <select value={flagFilter.status} onChange={e => setFlagFilter(f => ({...f, status: e.target.value}))} style={{ ...inputStyle, width: 'auto' }}>
              <option value="">All Statuses</option>
              <option value="open">Open</option>
              <option value="mitigated">Mitigated</option>
              <option value="accepted">Accepted</option>
              <option value="resolved">Resolved</option>
            </select>
            <select value={flagFilter.severity} onChange={e => setFlagFilter(f => ({...f, severity: e.target.value}))} style={{ ...inputStyle, width: 'auto' }}>
              <option value="">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select value={flagFilter.dimension} onChange={e => setFlagFilter(f => ({...f, dimension: e.target.value}))} style={{ ...inputStyle, width: 'auto' }}>
              <option value="">All Dimensions</option>
              <option value="financial">Financial</option>
              <option value="legal">Legal</option>
              <option value="recovery">Recovery</option>
              <option value="escalation">Escalation</option>
            </select>
            <div style={{ flex: 1 }} />
            <button onClick={() => setShowManualFlag(true)} style={btnPrimary}>+ Manual Flag</button>
          </div>

          {/* Manual Flag Modal */}
          {showManualFlag && (
            <div style={{ ...panelStyle, border: '1px solid #2563eb', marginBottom: '20px' }}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '14px' }}>Add Manual Flag</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Case</div>
                  <select value={manualForm.case_id} onChange={e => setManualForm(f => ({...f, case_id: e.target.value}))} style={inputStyle}>
                    <option value="">Select case...</option>
                    {cases.map(c => <option key={c.id} value={c.id}>{c.resident_name} — Unit {c.unit_number}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Flag Type</div>
                  <input value={manualForm.flag_type} onChange={e => setManualForm(f => ({...f, flag_type: e.target.value}))} placeholder="e.g. fdcpa_risk" style={inputStyle} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Dimension</div>
                  <select value={manualForm.dimension} onChange={e => setManualForm(f => ({...f, dimension: e.target.value}))} style={inputStyle}>
                    <option value="financial">Financial</option>
                    <option value="legal">Legal</option>
                    <option value="recovery">Recovery</option>
                    <option value="escalation">Escalation</option>
                  </select>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Severity</div>
                  <select value={manualForm.severity} onChange={e => setManualForm(f => ({...f, severity: e.target.value}))} style={inputStyle}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Description</div>
                <textarea value={manualForm.description} onChange={e => setManualForm(f => ({...f, description: e.target.value}))}
                  rows={2} placeholder="Describe the risk..." style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handleManualFlag} style={btnPrimary}>Submit Flag</button>
                <button onClick={() => setShowManualFlag(false)} style={btnGhost}>Cancel</button>
              </div>
            </div>
          )}

          {/* Flags Table */}
          {!flags.length && <div style={{ color: '#94a3b8', fontSize: '13px' }}>No flags found for selected filters.</div>}
          {flags.map((f, i) => (
            <div key={i} style={{ ...panelStyle, padding: '14px 18px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              {/* Severity badge */}
              <div style={{ minWidth: '70px', textAlign: 'center', background: severityColor(f.severity) + '22', border: `1px solid ${severityColor(f.severity)}`, borderRadius: '6px', padding: '5px 4px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', color: severityColor(f.severity), textTransform: 'uppercase' }}>{f.severity}</div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '3px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>{f.flag_type.replace(/_/g,' ')}</span>
                  <span style={{ fontSize: '10px', color: '#2563eb', backgroundColor: '#eff6ff', borderRadius: '4px', padding: '2px 6px' }}>{dimensionLabel(f.dimension)}</span>
                  <span style={{ fontSize: '10px', color: '#94a3b8', backgroundColor: f.triggered_by === 'auto' ? '#eff6ff' : '#ffffff', borderRadius: '4px', padding: '2px 6px' }}>{f.triggered_by === 'auto' ? '🤖 Auto' : '✍️ Manual'}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>{f.description}</div>
                <div style={{ fontSize: '11px', color: '#475569' }}>{f.resident_name} · Unit {f.unit_number} · {f.property_name} · {fmtDate(f.created_at)}</div>
              </div>
              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', minWidth: '100px' }}>
                {f.status === 'open' && (
                  <>
                    <button onClick={() => handleUpdateFlag(f.id, 'mitigated')} style={{ ...btnGhost, fontSize: '11px', padding: '5px 8px', color: '#15803d', borderColor: '#15803d' }}>Mitigate</button>
                    <button onClick={() => handleUpdateFlag(f.id, 'accepted')} style={{ ...btnGhost, fontSize: '11px', padding: '5px 8px', color: '#d97706', borderColor: '#d97706' }}>Accept Risk</button>
                  </>
                )}
                {f.status !== 'open' && (
                  <span style={{ fontSize: '11px', color: '#15803d', textAlign: 'center' }}>✓ {f.status}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── PREDICTIVE ALERTS ── */}
      {subView === 'predictive' && predictive && (
        <div>
          {/* Payment Plan Break Risk */}
          <div style={panelStyle}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#dc2626', marginBottom: '14px' }}>💳 Payment Plan Break Risk</div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '14px' }}>Cases with an active payment plan and at least one prior broken plan — statistically high re-break probability.</div>
            {!predictive.payment_plan_risk?.length && <div style={{ color: '#94a3b8', fontSize: '13px' }}>No cases flagged.</div>}
            {predictive.payment_plan_risk?.map((c, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #eff6ff' }}>
                <div>
                  <div style={{ fontSize: '13px', color: '#0f172a', fontWeight: '600' }}>{c.resident_name} · Unit {c.unit_number}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>{c.property_name} · {c.broken_count} prior broken plan(s)</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', color: '#ea580c', fontWeight: '600' }}>{fmtCurrency(c.balance_owed)}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Next payment: {fmtDate(c.next_payment_date)}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Stalled Cases */}
          <div style={panelStyle}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#d97706', marginBottom: '14px' }}>⏸ Stalled Cases</div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '14px' }}>Active cases open 45+ days with fewer than 3 touchpoints — at risk of falling through the cracks.</div>
            {!predictive.stalled_cases?.length && <div style={{ color: '#94a3b8', fontSize: '13px' }}>No stalled cases.</div>}
            {predictive.stalled_cases?.map((c, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #eff6ff' }}>
                <div>
                  <div style={{ fontSize: '13px', color: '#0f172a', fontWeight: '600' }}>{c.resident_name} · Unit {c.unit_number}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>{c.property_name} · {Math.round(c.days_open)} days open · {c.touchpoint_count} touchpoints</div>
                </div>
                <div style={{ fontSize: '13px', color: '#d97706', fontWeight: '600' }}>{fmtCurrency(c.balance_owed)}</div>
              </div>
            ))}
          </div>

          {/* No Contact Risk */}
          <div style={panelStyle}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#7c3aed', marginBottom: '14px' }}>📵 No Contact Risk</div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '14px' }}>Open cases with no successful contact in 14+ days — recovery probability drops significantly beyond 21 days.</div>
            {!predictive.no_contact_risk?.length && <div style={{ color: '#94a3b8', fontSize: '13px' }}>No cases flagged.</div>}
            {predictive.no_contact_risk?.map((c, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #eff6ff' }}>
                <div>
                  <div style={{ fontSize: '13px', color: '#0f172a', fontWeight: '600' }}>{c.resident_name} · Unit {c.unit_number}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>{c.property_name}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', color: '#7c3aed', fontWeight: '600' }}>{fmtCurrency(c.balance_owed)}</div>
                  <div style={{ fontSize: '11px', color: '#dc2626' }}>{c.days_since_contact ? `${Math.round(c.days_since_contact)}d no contact` : 'Never contacted'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── RULES ENGINE ── */}
      {subView === 'rules' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginBottom: '16px' }}>
            <button onClick={handleSeedRules} disabled={seeding} style={btnGhost}>{seeding ? 'Seeding...' : '↻ Seed Default Rules'}</button>
          </div>
          {!rules.length && <div style={{ color: '#94a3b8', fontSize: '13px' }}>No rules yet. Click "Seed Default Rules" to load the 6 built-in rules.</div>}
          {rules.map((r, i) => (
            <div key={i} style={{ ...panelStyle, display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>{r.rule_name.replace(/_/g,' ')}</span>
                  <span style={{ fontSize: '10px', color: '#2563eb', backgroundColor: '#eff6ff', borderRadius: '4px', padding: '2px 6px' }}>{dimensionLabel(r.dimension)}</span>
                  <span style={{ fontSize: '10px', color: severityColor(r.severity), backgroundColor: severityColor(r.severity) + '22', borderRadius: '4px', padding: '2px 6px', textTransform: 'uppercase' }}>{r.severity}</span>
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Score impact: +{r.score_impact} pts</div>
              </div>
              {/* Toggle */}
              <div onClick={() => handleToggleRule(r.id, !r.enabled)}
                style={{ width: '40px', height: '22px', borderRadius: '11px', backgroundColor: r.enabled ? '#1d4ed8' : '#ffffff', position: 'relative', cursor: 'pointer', transition: 'background 0.2s', border: '1px solid #1e293b' }}>
                <div style={{ position: 'absolute', top: '2px', left: r.enabled ? '18px' : '2px', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: r.enabled ? '#fff' : '#475569', transition: 'left 0.2s' }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
// ── End Collections Risk Tab ───────────────────────────────────────────────────

const PMS_CATALOG = [
  { name: 'appfolio', label: 'AppFolio',       color: '#6366f1', note: 'Partner approval pending' },
  { name: 'resman',   label: 'ResMan',          color: '#f59e0b', note: 'Partner application pending' },
  { name: 'entrata',  label: 'Entrata',         color: '#10b981', note: 'Requires mutual client sponsor' },
  { name: 'onesite',  label: 'RealPage OneSite',color: '#ef4444', note: 'Requires RPX registration + active client' },
  { name: 'yardi',    label: 'Yardi Voyager',   color: '#8b5cf6', note: 'Requires SIPP (3 active Voyager clients)' },
];

function ConnectorStatusBadge({ status }) {
  const map = {
    active:   { bg: '#064e3b', color: '#34d399', label: 'Active' },
    inactive: { bg: '#1e293b', color: '#94a3b8', label: 'Inactive' },
    error:    { bg: '#7f1d1d', color: '#fca5a5', label: 'Error' },
  };
  const s = map[status] || map.inactive;
  return (
    <span style={{ backgroundColor: s.bg, color: s.color, padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
      {s.label}
    </span>
  );
}

function SyncJobRow({ job }) {
  const statusColor = { completed: '#34d399', failed: '#fca5a5', running: '#60a5fa', pending: '#94a3b8' };
  const d = s => s ? new Date(s).toLocaleString() : '—';
  return (
    <tr style={{ borderBottom: '1px solid #1e293b' }}>
      <td style={{ padding: '10px 12px', color: '#94a3b8', fontSize: '12px' }}>{d(job.created_at)}</td>
      <td style={{ padding: '10px 12px', color: '#374151', fontSize: '12px', textTransform: 'capitalize' }}>{job.job_type}</td>
      <td style={{ padding: '10px 12px', color: '#94a3b8', fontSize: '12px' }}>{job.entity_type || 'all'}</td>
      <td style={{ padding: '10px 12px' }}>
        <span style={{ color: statusColor[job.status] || '#94a3b8', fontSize: '12px', fontWeight: 'bold', textTransform: 'capitalize' }}>{job.status}</span>
      </td>
      <td style={{ padding: '10px 12px', color: '#34d399', fontSize: '12px' }}>{job.records_created || 0} new</td>
      <td style={{ padding: '10px 12px', color: '#60a5fa', fontSize: '12px' }}>{job.records_updated || 0} updated</td>
      <td style={{ padding: '10px 12px', color: '#fca5a5', fontSize: '12px' }}>{job.records_failed || 0} failed</td>
      <td style={{ padding: '10px 12px', color: '#94a3b8', fontSize: '12px' }}>{job.completed_at ? Math.round((new Date(job.completed_at) - new Date(job.started_at)) / 1000) + 's' : '—'}</td>
    </tr>
  );
}

function ConnectorCard({ connector, catalogEntry, token, onRefresh }) {
  const [syncing, setSyncing] = useState(false);
  const [testing, setTesting] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [showJobs, setShowJobs] = useState(false);
  const [msg, setMsg] = useState('');

  const api = (path, opts = {}) => fetch(`${API_URL}${path}`, {
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    ...opts
  });

  const loadJobs = async () => {
    const r = await api(`/api/integrations/${connector.id}/jobs?limit=10`);
    const d = await r.json();
    setJobs(d.jobs || []);
  };

  const handleTest = async () => {
    setTesting(true); setMsg('');
    try {
      const r = await api(`/api/integrations/${connector.id}/test`, { method: 'POST' });
      const d = await r.json();
      setMsg(d.message || (d.success ? 'Connection verified.' : 'Test failed.'));
      onRefresh();
    } catch { setMsg('Test request failed.'); }
    finally { setTesting(false); }
  };

  const handleSync = async (type) => {
    setSyncing(true); setMsg('');
    try {
      const r = await api(`/api/integrations/${connector.id}/sync`, {
        method: 'POST', body: JSON.stringify({ type })
      });
      const d = await r.json();
      setMsg(d.message || 'Sync started.');
      setTimeout(() => { loadJobs(); onRefresh(); }, 2000);
    } catch { setMsg('Sync request failed.'); }
    finally { setSyncing(false); }
  };

  const handleToggle = async () => {
    const newStatus = connector.status === 'active' ? 'inactive' : 'active';
    await api(`/api/integrations/${connector.id}/status`, {
      method: 'PATCH', body: JSON.stringify({ status: newStatus })
    });
    onRefresh();
  };

  const handleDisconnect = async () => {
    if (!window.confirm(`Disconnect ${catalogEntry.label}? This removes all credentials and sync history.`)) return;
    await api(`/api/integrations/${connector.id}`, { method: 'DELETE' });
    onRefresh();
  };

  const fmt = d => d ? new Date(d).toLocaleString() : 'Never';

  return (
    <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', border: `1px solid ${catalogEntry.color}33` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: catalogEntry.color }} />
          <span style={{ color: '#1e293b', fontSize: '16px', fontWeight: 'bold' }}>{catalogEntry.label}</span>
          <ConnectorStatusBadge status={connector.status} />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleTest} disabled={testing}
            style={{ padding: '6px 14px', backgroundColor: '#334155', color: '#94a3b8', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>
            {testing ? 'Testing...' : 'Test'}
          </button>
          <button onClick={() => handleSync('incremental')} disabled={syncing || connector.status !== 'active'}
            style={{ padding: '6px 14px', backgroundColor: '#14B8A6', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: connector.status !== 'active' ? 'not-allowed' : 'pointer', opacity: connector.status !== 'active' ? 0.5 : 1 }}>
            {syncing ? 'Syncing...' : 'Sync Now'}
          </button>
          <button onClick={() => handleSync('full')} disabled={syncing || connector.status !== 'active'}
            style={{ padding: '6px 14px', backgroundColor: '#1e40af', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: connector.status !== 'active' ? 'not-allowed' : 'pointer', opacity: connector.status !== 'active' ? 0.5 : 1 }}>
            Full Sync
          </button>
          <button onClick={handleToggle}
            style={{ padding: '6px 14px', backgroundColor: '#334155', color: '#94a3b8', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>
            {connector.status === 'active' ? 'Disable' : 'Enable'}
          </button>
          <button onClick={handleDisconnect}
            style={{ padding: '6px 14px', backgroundColor: '#7f1d1d', color: '#fca5a5', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>
            Remove
          </button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
        <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '12px' }}>
          <div style={{ color: '#64748b', fontSize: '11px', marginBottom: '4px' }}>FULL SYNC</div>
          <div style={{ color: '#374151', fontSize: '13px' }}>{fmt(connector.last_full_sync_at)}</div>
        </div>
        <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '12px' }}>
          <div style={{ color: '#64748b', fontSize: '11px', marginBottom: '4px' }}>LAST INCREMENTAL</div>
          <div style={{ color: '#374151', fontSize: '13px' }}>{fmt(connector.last_incremental_sync_at)}</div>
        </div>
        <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '12px' }}>
          <div style={{ color: '#64748b', fontSize: '11px', marginBottom: '4px' }}>CONNECTED</div>
          <div style={{ color: '#374151', fontSize: '13px' }}>{fmt(connector.created_at)}</div>
        </div>
      </div>
      {msg && <div style={{ backgroundColor: '#f8fafc', color: '#60a5fa', padding: '8px 12px', borderRadius: '6px', fontSize: '13px', marginBottom: '12px' }}>{msg}</div>}
      <button onClick={() => { setShowJobs(!showJobs); if (!showJobs) loadJobs(); }}
        style={{ backgroundColor: 'transparent', border: 'none', color: '#94a3b8', fontSize: '13px', cursor: 'pointer', padding: '0' }}>
        {showJobs ? '▲ Hide' : '▼ Show'} sync history
      </button>
      {showJobs && (
        <div style={{ marginTop: '12px', overflowX: 'auto' }}>
          {jobs.length === 0 ? (
            <div style={{ color: '#475569', fontSize: '13px', padding: '12px 0' }}>No sync jobs yet.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  {['Time','Type','Entity','Status','Created','Updated','Failed','Duration'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', color: '#64748b', fontSize: '11px', textAlign: 'left', fontWeight: 'normal' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>{jobs.map(j => <SyncJobRow key={j.id} job={j} />)}</tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

function ConnectModal({ entry, token, onClose, onConnected }) {
  const fields = {
    appfolio: [
      { key: 'clientId',     label: 'Client ID',     type: 'text' },
      { key: 'clientSecret', label: 'Client Secret', type: 'password' },
    ],
    resman: [
      { key: 'partnerId', label: 'Integration Partner ID', type: 'text' },
      { key: 'apiKey',    label: 'API Key',                type: 'password' },
      { key: 'accountId', label: 'ResMan Account ID',      type: 'text' },
    ],
    entrata: [
      { key: 'domain',   label: 'Entrata Domain (e.g. mycompany)', type: 'text' },
      { key: 'username', label: 'Username',                         type: 'text' },
      { key: 'password', label: 'Password',                         type: 'password' },
      { key: 'clientId', label: 'Client ID',                        type: 'text' },
    ],
    onesite: [
      { key: 'apiKey', label: 'RealPage Exchange API Key', type: 'password' },
      { key: 'pmcId',  label: 'PMC ID',                   type: 'text' },
      { key: 'siteId', label: 'Site ID',                  type: 'text' },
    ],
    yardi: [
      { key: 'serverUrl', label: 'Voyager Server URL', type: 'text' },
      { key: 'username',  label: 'Username',           type: 'text' },
      { key: 'password',  label: 'Password',           type: 'password' },
      { key: 'database',  label: 'Database Name',      type: 'text' },
      { key: 'entity',    label: 'Entity',             type: 'text' },
    ],
  };

  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true); setError('');
    try {
      const r = await fetch(`${API_URL}/api/integrations/connect`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ connector: entry.name, displayName: entry.label, credentials: form })
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Connection failed.');
      onConnected();
      onClose();
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '32px', width: '480px', maxWidth: '90vw' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <h3 style={{ color: '#1e293b', margin: 0, fontSize: '18px' }}>Connect {entry.label}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer' }}>×</button>
        </div>
        <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', color: '#94a3b8', fontSize: '13px' }}>
          {entry.note}
        </div>
        {(fields[entry.name] || []).map(f => (
          <div key={f.key} style={{ marginBottom: '14px' }}>
            <label style={{ color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '5px' }}>{f.label}</label>
            <input type={f.type} value={form[f.key] || ''} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #e5e7eb', backgroundColor: '#f8fafc', color: 'white', fontSize: '13px', boxSizing: 'border-box' }} />
          </div>
        ))}
        {error && <div style={{ color: '#fca5a5', fontSize: '13px', marginBottom: '14px' }}>{error}</div>}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
          <button onClick={onClose} style={{ padding: '9px 20px', backgroundColor: '#334155', color: '#94a3b8', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading}
            style={{ padding: '9px 20px', backgroundColor: '#14B8A6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
            {loading ? 'Connecting...' : 'Connect'}
          </button>
        </div>
      </div>
    </div>
  );
}


// ─── COMPLIANCE TAB ──────────────────────────────────────────────────────────
function ComplianceTab({ token }) {
  const API = 'https://servfixy-production.up.railway.app';

  const DEFAULT_CONTROLS = [
    {id:'c1',domain:'Access Control',control:'MFA enforced on all admin systems',soc2:'CC6.1',iso:'A.8.5',status:'implemented',evidence:'GitHub, Supabase, Railway, Vercel, Stripe all require MFA'},
    {id:'c2',domain:'Access Control',control:'Least-privilege access — role-based by property_id',soc2:'CC6.3',iso:'A.8.2',status:'implemented',evidence:'All DB queries scoped by property_id; technicians see assigned work only'},
    {id:'c3',domain:'Access Control',control:'Access review for all personnel',soc2:'CC6.2',iso:'A.5.18',status:'partial',evidence:'No formal quarterly review process documented yet'},
    {id:'c4',domain:'Access Control',control:'Offboarding procedure (access revocation)',soc2:'CC6.2',iso:'A.6.5',status:'gap',evidence:''},
    {id:'c5',domain:'Encryption',control:'Encryption in transit (TLS 1.2+)',soc2:'CC6.7',iso:'A.8.24',status:'implemented',evidence:'Enforced by Railway, Vercel, Supabase — no plain HTTP in production'},
    {id:'c6',domain:'Encryption',control:'Encryption at rest',soc2:'CC6.7',iso:'A.8.24',status:'implemented',evidence:'Supabase managed PostgreSQL encryption at rest; Supabase Storage S3-compatible'},
    {id:'c7',domain:'Secrets Management',control:'No secrets in source code',soc2:'CC6.1',iso:'A.8.10',status:'implemented',evidence:'All secrets in Railway env vars; GitHub PAT scoped to required repos'},
    {id:'c8',domain:'Secrets Management',control:'Secret rotation policy',soc2:'CC6.1',iso:'A.8.10',status:'partial',evidence:'Policy: rotate on personnel change or breach — not yet formally documented'},
    {id:'c9',domain:'Incident Response',control:'Incident response plan documented',soc2:'CC7.3',iso:'A.5.24',status:'gap',evidence:''},
    {id:'c10',domain:'Incident Response',control:'Incident response tested',soc2:'CC7.4',iso:'A.5.26',status:'gap',evidence:''},
    {id:'c11',domain:'Change Management',control:'Code review before production merge',soc2:'CC8.1',iso:'A.8.32',status:'partial',evidence:'Solo founder build — no formal peer review; CI/CD via Railway + Vercel on main push'},
    {id:'c12',domain:'Change Management',control:'Branch protection on main',soc2:'CC8.1',iso:'A.8.32',status:'gap',evidence:'Recommended but not confirmed enforced'},
    {id:'c13',domain:'Logging & Monitoring',control:'Audit logging of user actions',soc2:'CC7.2',iso:'A.8.15',status:'implemented',evidence:'audit_logs table in Supabase; user actions logged in backend middleware'},
    {id:'c14',domain:'Logging & Monitoring',control:'Log retention policy (2 years)',soc2:'CC7.2',iso:'A.8.17',status:'partial',evidence:'Audit logs in Supabase; retention period not formally enforced'},
    {id:'c15',domain:'Logging & Monitoring',control:'Alerting on anomalous activity',soc2:'CC7.1',iso:'A.8.16',status:'gap',evidence:''},
    {id:'c16',domain:'Vulnerability Management',control:'Penetration test',soc2:'CC7.1',iso:'A.8.8',status:'gap',evidence:'Required for SOC 2 — pending budget'},
    {id:'c17',domain:'Vulnerability Management',control:'Dependency vulnerability scanning',soc2:'CC7.1',iso:'A.8.8',status:'gap',evidence:''},
    {id:'c18',domain:'Vendor Management',control:'Vendor risk assessment documented',soc2:'CC9.2',iso:'A.5.21',status:'partial',evidence:'Vendor register built — no formal DPA review completed for AI vendors'},
    {id:'c19',domain:'Vendor Management',control:'DPAs in place with data processors',soc2:'CC9.2',iso:'A.5.21',status:'gap',evidence:'OpenAI/Anthropic DPA not confirmed'},
    {id:'c20',domain:'Business Continuity',control:'Backup and recovery plan',soc2:'A1.2',iso:'A.8.13',status:'partial',evidence:'Supabase manages automated backups; no formal RTO/RPO defined'},
    {id:'c21',domain:'Business Continuity',control:'Disaster recovery tested',soc2:'A1.3',iso:'A.5.30',status:'gap',evidence:''},
    {id:'c22',domain:'Security Policies',control:'Information Security Policy',soc2:'CC1.1',iso:'A.5.1',status:'implemented',evidence:'SFXY-SEC-002 complete — July 2026'},
    {id:'c23',domain:'Security Policies',control:'Data Classification Policy',soc2:'CC6.5',iso:'A.5.12',status:'partial',evidence:'Data classification documented in Asset Inventory (SFXY-SEC-001)'},
    {id:'c24',domain:'Security Policies',control:'Acceptable Use Policy',soc2:'CC1.1',iso:'A.5.10',status:'gap',evidence:''},
    {id:'c25',domain:'API Security',control:'Rate limiting on all endpoints',soc2:'CC6.1',iso:'A.8.20',status:'implemented',evidence:'Rate limiting implemented in backend middleware (Phase 2 security hardening)'},
    {id:'c26',domain:'API Security',control:'Input validation',soc2:'CC6.1',iso:'A.8.20',status:'implemented',evidence:'Input validation in backend middleware'},
    {id:'c27',domain:'Training',control:'Security awareness training for all personnel',soc2:'CC1.4',iso:'A.6.3',status:'gap',evidence:''},
  ];

  const DEFAULT_RISKS = [
    {id:'r1',asset:'Supabase PostgreSQL',threat:'Unauthorized DB access via SQL injection',likelihood:2,impact:5,treatment:'mitigate',notes:'Input validation + parameterized queries in place; pentest pending'},
    {id:'r2',asset:'Railway env vars',threat:'Secret exposure via misconfigured repo',likelihood:2,impact:5,treatment:'mitigate',notes:'No secrets in source code policy implemented; GitHub PAT scoped'},
    {id:'r3',asset:'Resident PII',threat:'Data breach — unauthorized export',likelihood:2,impact:5,treatment:'mitigate',notes:'Access scoped by property_id; MFA on all admin systems'},
    {id:'r4',asset:'Supabase Storage',threat:'Photo/PDF access without authorization',likelihood:2,impact:3,treatment:'mitigate',notes:'Signed URLs implemented for photo access'},
    {id:'r5',asset:'Railway backend',threat:'Service outage / availability failure',likelihood:3,impact:4,treatment:'mitigate',notes:'No formal RTO/RPO; Supabase backups automated'},
    {id:'r6',asset:'Stripe integration',threat:'Payment processing failure / fraud',likelihood:2,impact:4,treatment:'transfer',notes:'Stripe PCI DSS Level 1; Servfixy does not store card data'},
    {id:'r7',asset:'GitHub repos',threat:'Malicious code injection via compromised account',likelihood:2,impact:5,treatment:'mitigate',notes:'MFA on GitHub; branch protection recommended'},
    {id:'r8',asset:'Twilio A2P SMS',threat:'Resident SMS spoofing / spam',likelihood:2,impact:2,treatment:'mitigate',notes:'A2P carrier approval pending'},
    {id:'r9',asset:'AI triage features',threat:'PII sent to third-party AI without DPA',likelihood:3,impact:4,treatment:'mitigate',notes:'DPA with OpenAI/Anthropic not confirmed — action required'},
    {id:'r10',asset:'PMS connectors',threat:'Credential theft exposing AppFolio/Yardi data',likelihood:2,impact:5,treatment:'mitigate',notes:'Credentials not yet received; framework built with env var pattern'},
  ];

  const DEFAULT_DOCS = [
    {id:'d1',name:'Asset Inventory & System Description',docId:'SFXY-SEC-001',status:'complete',lastReview:'2026-07',nextReview:'2026-10',framework:'SOC 2 + ISO 27001',notes:'v1.0 complete'},
    {id:'d2',name:'Information Security Policy',docId:'SFXY-SEC-002',status:'complete',lastReview:'2026-07',nextReview:'2027-07',framework:'SOC 2 + ISO 27001',notes:'v1.0 complete'},
    {id:'d3',name:'Access Control Policy',docId:'SFXY-SEC-003',status:'pending',lastReview:'',nextReview:'',framework:'SOC 2 + ISO 27001',notes:''},
    {id:'d4',name:'Incident Response Plan',docId:'SFXY-SEC-004',status:'pending',lastReview:'',nextReview:'',framework:'SOC 2 + ISO 27001',notes:''},
    {id:'d5',name:'Change Management Policy',docId:'SFXY-SEC-005',status:'pending',lastReview:'',nextReview:'',framework:'SOC 2 + ISO 27001',notes:''},
    {id:'d6',name:'Vendor Management Policy',docId:'SFXY-SEC-006',status:'pending',lastReview:'',nextReview:'',framework:'SOC 2 + ISO 27001',notes:''},
    {id:'d7',name:'Data Classification Policy',docId:'SFXY-SEC-007',status:'partial',lastReview:'2026-07',nextReview:'2026-10',framework:'SOC 2 + ISO 27001',notes:'Partially covered in SFXY-SEC-001'},
    {id:'d8',name:'Business Continuity & DR Plan',docId:'SFXY-SEC-008',status:'pending',lastReview:'',nextReview:'',framework:'SOC 2 + ISO 27001',notes:''},
    {id:'d9',name:'Acceptable Use Policy',docId:'SFXY-SEC-009',status:'pending',lastReview:'',nextReview:'',framework:'SOC 2',notes:''},
    {id:'d10',name:'Risk Assessment & Risk Register',docId:'SFXY-SEC-010',status:'partial',lastReview:'2026-07',nextReview:'2026-10',framework:'ISO 27001',notes:'Live in compliance tab'},
  ];

  const DEFAULT_VENDORS = [
    {id:'v1',vendor:'Supabase',service:'Database + Storage + Auth',dataTier:'Critical',soc2Status:'SOC 2 Type II',isoStatus:'Not certified',dpa:'Confirm',notes:'Primary data store — highest priority'},
    {id:'v2',vendor:'Railway',service:'Backend hosting',dataTier:'Critical',soc2Status:'SOC 2 Type II',isoStatus:'Not certified',dpa:'Confirm',notes:'API runtime; env vars and secrets'},
    {id:'v3',vendor:'Vercel',service:'Frontend hosting / CDN',dataTier:'High',soc2Status:'SOC 2 Type II',isoStatus:'Not certified',dpa:'Confirm',notes:'No persistent data stored'},
    {id:'v4',vendor:'Stripe',service:'Payment processing',dataTier:'High',soc2Status:'SOC 2 Type I',isoStatus:'PCI DSS L1',dpa:'Confirm',notes:'No raw card data stored by Servfixy'},
    {id:'v5',vendor:'Firebase (Google)',service:'Push notifications (FCM)',dataTier:'Medium',soc2Status:'N/A',isoStatus:'ISO 27001',dpa:'Google DPA',notes:'Device tokens + notification payloads'},
    {id:'v6',vendor:'Twilio',service:'SMS (A2P pending)',dataTier:'Medium',soc2Status:'SOC 2 Type II',isoStatus:'ISO 27001',dpa:'Confirm',notes:'Phone numbers and message content'},
    {id:'v7',vendor:'GitHub (Microsoft)',service:'Source control',dataTier:'High',soc2Status:'SOC 2 Type II',isoStatus:'ISO 27001',dpa:'Microsoft DPA',notes:'Application source code across 4 repos'},
    {id:'v8',vendor:'OpenAI',service:'AI triage / analysis',dataTier:'Medium',soc2Status:'SOC 2 Type II',isoStatus:'Not certified',dpa:'MISSING',notes:'Maintenance request content — DPA required urgently'},
    {id:'v9',vendor:'Anthropic',service:'AI features',dataTier:'Medium',soc2Status:'SOC 2 (in progress)',isoStatus:'Not certified',dpa:'MISSING',notes:'Confirm DPA before audit'},
    {id:'v10',vendor:'Framer',service:'Marketing website',dataTier:'Low',soc2Status:'Unknown',isoStatus:'Unknown',dpa:'Not required',notes:'No customer data — out of scope'},
  ];

  const STORAGE_KEY = 'sfxy-compliance-v2';

  const [activeSection, setActiveSection] = React.useState('dashboard');
  const [controls, setControls] = React.useState(DEFAULT_CONTROLS);
  const [risks, setRisks] = React.useState(DEFAULT_RISKS);
  const [docs, setDocs] = React.useState(DEFAULT_DOCS);
  const [vendors, setVendors] = React.useState(DEFAULT_VENDORS);
  const [saved, setSaved] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s.controls) setControls(s.controls);
        if (s.risks) setRisks(s.risks);
        if (s.docs) setDocs(s.docs);
        if (s.vendors) setVendors(s.vendors);
      }
    } catch(e) {}
    setLoaded(true);
  }, []);

  const saveAll = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ controls, risks, docs, vendors }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch(e) {}
  };

  const updateControl = (id, field, value) => {
    setControls(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };
  const updateRisk = (id, field, value) => {
    setRisks(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };
  const updateDoc = (id, field, value) => {
    setDocs(prev => prev.map(d => d.id === id ? { ...d, [field]: value } : d));
  };
  const updateVendor = (id, field, value) => {
    setVendors(prev => prev.map(v => v.id === id ? { ...v, [field]: value } : v));
  };
  const addRisk = () => {
    setRisks(prev => [...prev, { id: 'r' + Date.now(), asset: 'New asset', threat: 'New threat', likelihood: 2, impact: 2, treatment: 'mitigate', notes: '' }]);
  };

  // ── Stats ──
  const total = controls.length;
  const impl = controls.filter(c => c.status === 'implemented').length;
  const partial = controls.filter(c => c.status === 'partial').length;
  const gap = controls.filter(c => c.status === 'gap').length;
  const score = Math.round((impl + partial * 0.5) / total * 100);
  const soc2c = controls.filter(c => c.soc2);
  const soc2score = Math.round((soc2c.filter(c=>c.status==='implemented').length + soc2c.filter(c=>c.status==='partial').length*0.5) / soc2c.length * 100);
  const isoc = controls.filter(c => c.iso);
  const isoscore = Math.round((isoc.filter(c=>c.status==='implemented').length + isoc.filter(c=>c.status==='partial').length*0.5) / isoc.length * 100);
  const vendorGaps = vendors.filter(v => v.dpa === 'MISSING').length;
  const docsComplete = docs.filter(d => d.status === 'complete').length;
  const gaps = controls.filter(c => c.status === 'gap');

  const domains = [...new Set(controls.map(c => c.domain))];
  const domainColors = {
    'Access Control':'#1B3A6B','Encryption':'#14B8A6','Secrets Management':'#7C3AED',
    'Incident Response':'#DC2626','Change Management':'#D97706','Logging & Monitoring':'#0284C7',
    'Vulnerability Management':'#EA580C','Vendor Management':'#6366F1','Business Continuity':'#059669',
    'Security Policies':'#475569','API Security':'#0891B2','Training':'#9333EA'
  };

  const statusBadge = (s) => {
    const map = { implemented: ['#166534','#dcfce7','Implemented'], partial: ['#854d0e','#fef9c3','Partial'], gap: ['#991b1b','#fee2e2','Gap'], complete: ['#166534','#dcfce7','Complete'], pending: ['#991b1b','#fee2e2','Pending'] };
    const [tc,bg,label] = map[s] || ['#374151','#f3f4f6',s];
    return <span style={{backgroundColor:bg,color:tc,padding:'2px 8px',borderRadius:'4px',fontSize:'11px',fontWeight:'bold'}}>{label}</span>;
  };

  const dpaBadge = (d) => {
    if (d === 'MISSING') return <span style={{backgroundColor:'#fee2e2',color:'#991b1b',padding:'2px 8px',borderRadius:'4px',fontSize:'11px',fontWeight:'bold'}}>Missing</span>;
    if (d === 'Not required') return <span style={{backgroundColor:'#f1f5f9',color:'#64748b',padding:'2px 8px',borderRadius:'4px',fontSize:'11px'}}>N/A</span>;
    return <span style={{backgroundColor:'#fef9c3',color:'#854d0e',padding:'2px 8px',borderRadius:'4px',fontSize:'11px',fontWeight:'bold'}}>{d}</span>;
  };

  const tierBadge = (t) => {
    const map = {Critical:['#fee2e2','#991b1b'],High:['#fef9c3','#854d0e'],Medium:['#dbeafe','#1e40af'],Low:['#f1f5f9','#475569']};
    const [bg,tc] = map[t] || ['#f1f5f9','#475569'];
    return <span style={{backgroundColor:bg,color:tc,padding:'2px 8px',borderRadius:'4px',fontSize:'11px',fontWeight:'bold'}}>{t}</span>;
  };

  const riskScore = (r) => {
    const s = r.likelihood * r.impact;
    const [bg,tc] = s>=15?['#fee2e2','#991b1b']:s>=9?['#fef9c3','#854d0e']:s>=4?['#fef3c7','#92400e']:['#dcfce7','#166534'];
    return <span style={{backgroundColor:bg,color:tc,width:'28px',height:'28px',borderRadius:'50%',display:'inline-flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:'bold'}}>{s}</span>;
  };

  const sty = {
    wrap: { padding: '24px', backgroundColor: '#f8fafc', minHeight: '100vh', color: '#374151' },
    hdr: { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px' },
    title: { fontSize:'20px', fontWeight:'bold', color:'#f1f5f9' },
    subnav: { display:'flex', gap:'4px', marginBottom:'20px', borderBottom:'1px solid #1e293b', paddingBottom:'0' },
    snbtn: (active) => ({ padding:'10px 16px', background:'none', border:'none', borderBottom: active ? '2px solid #14B8A6' : '2px solid transparent', color: active ? '#14B8A6' : '#94a3b8', fontSize:'13px', fontWeight: active ? '600' : 'normal', cursor:'pointer' }),
    saveBtn: { padding:'8px 16px', backgroundColor:'#14B8A6', color:'#fff', border:'none', borderRadius:'6px', fontSize:'13px', fontWeight:'bold', cursor:'pointer' },
    card: { backgroundColor:'#1e293b', borderRadius:'8px', padding:'16px', marginBottom:'12px' },
    metaCard: { backgroundColor:'#1e293b', borderRadius:'8px', padding:'16px 20px' },
    metaNum: { fontSize:'26px', fontWeight:'bold', color:'#f1f5f9', marginBottom:'4px' },
    metaLbl: { fontSize:'12px', color:'#94a3b8' },
    grid4: { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px', marginBottom:'20px' },
    grid2: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' },
    sectionTitle: { fontSize:'13px', fontWeight:'600', color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'12px' },
    table: { width:'100%', borderCollapse:'collapse', fontSize:'13px' },
    th: { textAlign:'left', padding:'8px 10px', fontSize:'11px', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.04em', color:'#64748b', borderBottom:'1px solid #1e293b' },
    td: { padding:'9px 10px', borderBottom:'1px solid #1e293b', color:'#e2e8f0', verticalAlign:'top' },
    select: { background:'#0f172a', border:'1px solid #334155', borderRadius:'4px', color:'#e2e8f0', padding:'3px 6px', fontSize:'12px', width:'100%' },
    textarea: { background:'#0f172a', border:'1px solid #334155', borderRadius:'4px', color:'#e2e8f0', padding:'4px 6px', fontSize:'12px', width:'100%', minHeight:'40px', resize:'vertical' },
    input: { background:'#0f172a', border:'1px solid #334155', borderRadius:'4px', color:'#e2e8f0', padding:'3px 6px', fontSize:'12px' },
    gapItem: { padding:'10px 12px', borderLeft:'3px solid #ef4444', backgroundColor:'#1e293b', borderRadius:'0 6px 6px 0', marginBottom:'6px' },
    progRow: { display:'flex', alignItems:'center', gap:'10px', marginBottom:'6px' },
    progBg: { flex:1, height:'5px', backgroundColor:'#1e293b', borderRadius:'3px', overflow:'hidden' },
    addBtn: { width:'100%', padding:'8px', background:'none', border:'1px dashed #334155', borderRadius:'6px', color:'#64748b', cursor:'pointer', fontSize:'13px', marginTop:'8px' },
  };

  const domainPct = (domain) => {
    const dc = controls.filter(c => c.domain === domain);
    return dc.length ? Math.round((dc.filter(c=>c.status==='implemented').length + dc.filter(c=>c.status==='partial').length*0.5)/dc.length*100) : 0;
  };

  const progColor = (pct) => pct >= 80 ? '#22c55e' : pct >= 50 ? '#eab308' : '#ef4444';

  if (!loaded) return <div style={sty.wrap}><p style={{color:'#94a3b8'}}>Loading compliance data...</p></div>;

  return (
    <div style={sty.wrap}>
      <div style={sty.hdr}>
        <div>
          <div style={sty.title}>🛡 Compliance</div>
          <div style={{fontSize:'12px',color:'#64748b',marginTop:'2px'}}>SOC 2 + ISO 27001 — Internal tracking</div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
          {saved && <span style={{fontSize:'12px',color:'#22c55e'}}>✓ Saved</span>}
          <button style={sty.saveBtn} onClick={saveAll}>Save changes</button>
        </div>
      </div>

      <div style={sty.subnav}>
        {['dashboard','controls','risks','documents','vendors'].map(s => (
          <button key={s} style={sty.snbtn(activeSection===s)} onClick={() => setActiveSection(s)}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {activeSection === 'dashboard' && (
        <div>
          <div style={sty.grid4}>
            <div style={sty.metaCard}><div style={{...sty.metaNum, color: score>=80?'#22c55e':score>=50?'#eab308':'#ef4444'}}>{score}%</div><div style={sty.metaLbl}>Overall score</div></div>
            <div style={sty.metaCard}><div style={{...sty.metaNum, color:'#38bdf8'}}>{soc2score}%</div><div style={sty.metaLbl}>SOC 2 readiness</div></div>
            <div style={sty.metaCard}><div style={{...sty.metaNum, color:'#a78bfa'}}>{isoscore}%</div><div style={sty.metaLbl}>ISO 27001 readiness</div></div>
            <div style={sty.metaCard}><div style={{...sty.metaNum, color: vendorGaps>0?'#ef4444':'#22c55e'}}>{vendorGaps}</div><div style={sty.metaLbl}>Vendor DPA gaps</div></div>
          </div>
          <div style={sty.grid2}>
            <div style={sty.card}>
              <div style={sty.sectionTitle}>Domain progress</div>
              {domains.map(d => {
                const pct = domainPct(d);
                return (
                  <div key={d} style={sty.progRow}>
                    <span style={{fontSize:'12px',color:domainColors[d]||'#94a3b8',width:'140px',flexShrink:0,fontWeight:'500'}}>{d}</span>
                    <div style={sty.progBg}><div style={{height:'100%',width:pct+'%',backgroundColor:progColor(pct),borderRadius:'3px'}}></div></div>
                    <span style={{fontSize:'12px',fontWeight:'500',color:'#f1f5f9',width:'32px',textAlign:'right'}}>{pct}%</span>
                  </div>
                );
              })}
            </div>
            <div>
              <div style={sty.card}>
                <div style={sty.sectionTitle}>Open gaps ({gaps.length})</div>
                {gaps.slice(0,6).map(c => (
                  <div key={c.id} style={sty.gapItem}>
                    <div style={{fontSize:'13px',fontWeight:'500',color:'#fca5a5'}}>{c.control}</div>
                    <div style={{fontSize:'11px',color:'#94a3b8',marginTop:'2px'}}>{c.domain} · {c.soc2} · {c.iso}</div>
                  </div>
                ))}
                {gaps.length > 6 && <div style={{fontSize:'12px',color:'#64748b',marginTop:'6px'}}>+{gaps.length-6} more — see Controls tab</div>}
              </div>
              <div style={sty.card}>
                <div style={sty.sectionTitle}>Documents</div>
                <div style={sty.progRow}>
                  <span style={{fontSize:'12px',color:'#94a3b8',width:'100px'}}>Complete</span>
                  <div style={sty.progBg}><div style={{height:'100%',width:Math.round(docs.filter(d=>d.status==='complete').length/docs.length*100)+'%',backgroundColor:'#22c55e',borderRadius:'3px'}}></div></div>
                  <span style={{fontSize:'12px',color:'#f1f5f9',width:'40px',textAlign:'right'}}>{docs.filter(d=>d.status==='complete').length}/{docs.length}</span>
                </div>
                <div style={sty.progRow}>
                  <span style={{fontSize:'12px',color:'#94a3b8',width:'100px'}}>In progress</span>
                  <div style={sty.progBg}><div style={{height:'100%',width:Math.round(docs.filter(d=>d.status==='partial').length/docs.length*100)+'%',backgroundColor:'#eab308',borderRadius:'3px'}}></div></div>
                  <span style={{fontSize:'12px',color:'#f1f5f9',width:'40px',textAlign:'right'}}>{docs.filter(d=>d.status==='partial').length}/{docs.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'controls' && (
        <div>
          <div style={{marginBottom:'12px',fontSize:'13px',color:'#94a3b8'}}>{impl} implemented · {partial} partial · {gap} gaps</div>
          {domains.map(domain => {
            const dc = controls.filter(c => c.domain === domain);
            return (
              <div key={domain} style={{marginBottom:'24px'}}>
                <div style={{fontSize:'12px',fontWeight:'600',color:domainColors[domain]||'#94a3b8',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:'8px',paddingBottom:'6px',borderBottom:'1px solid #1e293b'}}>{domain}</div>
                <table style={sty.table}>
                  <thead><tr>
                    <th style={{...sty.th,width:'35%'}}>Control</th>
                    <th style={sty.th}>SOC 2</th>
                    <th style={sty.th}>ISO 27001</th>
                    <th style={{...sty.th,width:'120px'}}>Status</th>
                    <th style={{...sty.th,width:'28%'}}>Evidence / Notes</th>
                  </tr></thead>
                  <tbody>
                    {dc.map(c => (
                      <tr key={c.id}>
                        <td style={sty.td}>{c.control}</td>
                        <td style={{...sty.td,fontSize:'11px',color:'#64748b',whiteSpace:'nowrap'}}>{c.soc2||'—'}</td>
                        <td style={{...sty.td,fontSize:'11px',color:'#64748b',whiteSpace:'nowrap'}}>{c.iso||'—'}</td>
                        <td style={sty.td}>
                          <select style={sty.select} value={c.status} onChange={e => updateControl(c.id,'status',e.target.value)}>
                            <option value="implemented">✓ Implemented</option>
                            <option value="partial">~ Partial</option>
                            <option value="gap">✗ Gap</option>
                          </select>
                        </td>
                        <td style={sty.td}>
                          <textarea style={sty.textarea} value={c.evidence} onChange={e => updateControl(c.id,'evidence',e.target.value)} placeholder="Add evidence..." />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      )}

      {activeSection === 'risks' && (
        <div>
          <div style={{marginBottom:'12px',fontSize:'12px',color:'#64748b'}}>Score = Likelihood (1–5) × Impact (1–5). Critical ≥15, High ≥9, Medium ≥4</div>
          <table style={sty.table}>
            <thead><tr>
              <th style={sty.th}>Score</th>
              <th style={sty.th}>Asset</th>
              <th style={sty.th}>Threat</th>
              <th style={sty.th}>L</th>
              <th style={sty.th}>I</th>
              <th style={sty.th}>Treatment</th>
              <th style={{...sty.th,width:'28%'}}>Notes</th>
            </tr></thead>
            <tbody>
              {[...risks].sort((a,b)=>(b.likelihood*b.impact)-(a.likelihood*a.impact)).map(r => (
                <tr key={r.id}>
                  <td style={sty.td}>{riskScore(r)}</td>
                  <td style={{...sty.td,fontWeight:'500',fontSize:'12px'}}>{r.asset}</td>
                  <td style={{...sty.td,fontSize:'12px'}}>{r.threat}</td>
                  <td style={sty.td}><select style={{...sty.select,width:'48px'}} value={r.likelihood} onChange={e=>updateRisk(r.id,'likelihood',parseInt(e.target.value))}>{[1,2,3,4,5].map(n=><option key={n}>{n}</option>)}</select></td>
                  <td style={sty.td}><select style={{...sty.select,width:'48px'}} value={r.impact} onChange={e=>updateRisk(r.id,'impact',parseInt(e.target.value))}>{[1,2,3,4,5].map(n=><option key={n}>{n}</option>)}</select></td>
                  <td style={sty.td}><select style={sty.select} value={r.treatment} onChange={e=>updateRisk(r.id,'treatment',e.target.value)}>
                    <option value="mitigate">Mitigate</option>
                    <option value="transfer">Transfer</option>
                    <option value="accept">Accept</option>
                    <option value="avoid">Avoid</option>
                  </select></td>
                  <td style={sty.td}><textarea style={sty.textarea} value={r.notes} onChange={e=>updateRisk(r.id,'notes',e.target.value)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button style={sty.addBtn} onClick={addRisk}>+ Add risk</button>
        </div>
      )}

      {activeSection === 'documents' && (
        <div>
          <div style={{marginBottom:'12px',fontSize:'13px',color:'#94a3b8'}}>{docsComplete} of {docs.length} documents complete</div>
          <table style={sty.table}>
            <thead><tr>
              <th style={sty.th}>ID</th>
              <th style={sty.th}>Document</th>
              <th style={sty.th}>Framework</th>
              <th style={sty.th}>Status</th>
              <th style={sty.th}>Last review</th>
              <th style={sty.th}>Next review</th>
              <th style={sty.th}>Notes</th>
            </tr></thead>
            <tbody>
              {docs.map(d => (
                <tr key={d.id}>
                  <td style={{...sty.td,fontSize:'11px',color:'#64748b',whiteSpace:'nowrap'}}>{d.docId}</td>
                  <td style={{...sty.td,fontWeight:'500'}}>{d.name}</td>
                  <td style={{...sty.td,fontSize:'11px',color:'#64748b'}}>{d.framework}</td>
                  <td style={sty.td}><select style={sty.select} value={d.status} onChange={e=>updateDoc(d.id,'status',e.target.value)}>
                    <option value="complete">Complete</option>
                    <option value="partial">In progress</option>
                    <option value="pending">Pending</option>
                  </select></td>
                  <td style={sty.td}><input type="month" style={sty.input} value={d.lastReview} onChange={e=>updateDoc(d.id,'lastReview',e.target.value)} /></td>
                  <td style={sty.td}><input type="month" style={sty.input} value={d.nextReview} onChange={e=>updateDoc(d.id,'nextReview',e.target.value)} /></td>
                  <td style={sty.td}><textarea style={sty.textarea} value={d.notes} onChange={e=>updateDoc(d.id,'notes',e.target.value)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeSection === 'vendors' && (
        <div>
          <div style={{marginBottom:'12px',fontSize:'13px',color:'#ef4444'}}>{vendorGaps} vendors with missing DPAs — action required</div>
          <table style={sty.table}>
            <thead><tr>
              <th style={sty.th}>Vendor</th>
              <th style={sty.th}>Service</th>
              <th style={sty.th}>Tier</th>
              <th style={sty.th}>SOC 2</th>
              <th style={sty.th}>ISO 27001</th>
              <th style={sty.th}>DPA</th>
              <th style={sty.th}>Notes</th>
            </tr></thead>
            <tbody>
              {[...vendors].sort((a,b)=>({'Critical':0,'High':1,'Medium':2,'Low':3}[a.dataTier]||9)-({'Critical':0,'High':1,'Medium':2,'Low':3}[b.dataTier]||9)).map(v => (
                <tr key={v.id}>
                  <td style={{...sty.td,fontWeight:'500'}}>{v.vendor}</td>
                  <td style={{...sty.td,fontSize:'12px',color:'#94a3b8'}}>{v.service}</td>
                  <td style={sty.td}>{tierBadge(v.dataTier)}</td>
                  <td style={{...sty.td,fontSize:'12px'}}>{v.soc2Status}</td>
                  <td style={{...sty.td,fontSize:'12px'}}>{v.isoStatus}</td>
                  <td style={sty.td}>{dpaBadge(v.dpa)}</td>
                  <td style={sty.td}><textarea style={sty.textarea} value={v.notes} onChange={e=>updateVendor(v.id,'notes',e.target.value)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
// ─── END COMPLIANCE TAB ───────────────────────────────────────────────────────

function IntegrationsTab({ token }) {
  const [connectors, setConnectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API_URL}/api/integrations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const d = await r.json();
      setConnectors(d.connectors || []);
    } catch { setConnectors([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const connectedNames = new Set(connectors.map(c => c.connector));

  return (
    <div style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ color: '#1e293b', fontSize: '22px', fontWeight: 'bold' }}>PMS Integrations</div>
      </div>
      <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '32px', marginTop: '4px' }}>
        Connect Servfixy to your property management system. Each connector syncs properties, units, residents, and work orders automatically.
      </p>

      {loading ? (
        <div style={{ color: '#475569', fontSize: '14px' }}>Loading connectors...</div>
      ) : (
        <>
          {connectors.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <div style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '16px' }}>CONNECTED</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {connectors.map(c => {
                  const entry = PMS_CATALOG.find(p => p.name === c.connector) || { label: c.connector, color: '#94a3b8', note: '' };
                  return <ConnectorCard key={c.id} connector={c} catalogEntry={entry} token={token} onRefresh={load} />;
                })}
              </div>
            </div>
          )}

          <div>
            <div style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '16px' }}>
              {connectors.length > 0 ? 'ADD ANOTHER' : 'AVAILABLE CONNECTORS'}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }}>
              {PMS_CATALOG.filter(p => !connectedNames.has(p.name)).map(entry => (
                <div key={entry.name} style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '20px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: entry.color }} />
                    <span style={{ color: '#1e293b', fontSize: '15px', fontWeight: 'bold' }}>{entry.label}</span>
                  </div>
                  <div style={{ color: '#475569', fontSize: '12px' }}>{entry.note}</div>
                  <button onClick={() => setModal(entry)}
                    style={{ marginTop: '4px', padding: '8px 16px', backgroundColor: '#14B8A6', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', alignSelf: 'flex-start' }}>
                    Connect
                  </button>
                </div>
              ))}
              {PMS_CATALOG.filter(p => !connectedNames.has(p.name)).length === 0 && (
                <div style={{ color: '#475569', fontSize: '14px', gridColumn: '1 / -1' }}>All available connectors are connected.</div>
              )}
            </div>
          </div>
        </>
      )}

      {modal && <ConnectModal entry={modal} token={token} onClose={() => setModal(null)} onConnected={load} />}
    </div>
  );
}
// ── End Integrations Tab ──────────────────────────────────────────────────────

// ── Collections Analytics Tab ──────────────────────────────────────────────────

// ── Root App ───────────────────────────────────────────────────────────────────
function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('collections_user')); } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('collections_token') || '');
  const [activeTab, setActiveTab] = useState('Collections Analytics');
  const [collectionsCaseFilter, setCollectionsCaseFilter] = useState({ status: '', property_id: '', aging_bucket: '' });

  const handleLogin = (u, t) => { setUser(u); setToken(t); };
  const handleLogout = () => {
    localStorage.removeItem('collections_token');
    localStorage.removeItem('collections_user');
    setUser(null); setToken('');
  };

  if (!user || !token) return <Login onLogin={handleLogin} />;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'Arial, sans-serif' }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={handleLogout} />
      <div style={{ flex: 1, overflowY: 'auto', minWidth: 0 }}>
        {activeTab === 'Collections Analytics' && <CollectionsAnalyticsTab token={token} onNavigate={(tab, filters) => { if (filters) setCollectionsCaseFilter(f => ({...f, ...filters})); setActiveTab(tab); }} />}
        {activeTab === 'Collections Cases' && <CollectionsCasesTab token={token} initialFilters={collectionsCaseFilter} onBack={() => { setCollectionsCaseFilter({ status: '', property_id: '', aging_bucket: '' }); setActiveTab('Collections Analytics'); }} />}
        {activeTab === 'Collections Reports' && <CollectionsReportsTab token={token} onBack={() => setActiveTab('Collections Analytics')} />}
        {activeTab === 'Coordinator Workspace' && <CollectionsWorkspaceTab token={token} />}
        {activeTab === 'Escalation Rules' && <CollectionsEscalationTab token={token} />}
        {activeTab === 'Document Vault' && <CollectionsDocumentVault token={token} />}
        {activeTab === 'Import Cases' && <CollectionsImportTab token={token} />}
        {activeTab === 'Court Calendar' && <CollectionsCalendarTab token={token} />}
        {activeTab === 'Owner Summary' && <CollectionsOwnerSummaryTab token={token} />}
        {activeTab === 'Onboarding' && <CollectionsOnboardingTab token={token} />}
        {activeTab === 'Collections Risk' && <CollectionsRiskTab token={token} />}
      </div>
    </div>
  );
}

export default App;
