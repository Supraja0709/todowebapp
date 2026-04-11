import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

const PRIORITY_COLORS = {
  High:   '#ef4444',
  Medium: '#f59e0b',
  Low:    '#10b981',
};

const STATUS_COLORS = ['#6366f1', '#10b981'];

const CATEGORY_PALETTE = [
  '#6366f1','#a855f7','#ec4899','#f59e0b',
  '#10b981','#3b82f6','#14b8a6','#f97316',
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    return (
      <div style={{
        background: 'rgba(15,23,42,0.95)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '10px',
        padding: '10px 16px',
        fontSize: '0.85rem',
        color: '#f9fafb',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      }}>
        <p style={{ fontWeight: 700 }}>{name}</p>
        <p style={{ color: '#9ca3af' }}>{value} task{value !== 1 ? 's' : ''}</p>
      </div>
    );
  }
  return null;
};

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.06) return null;
  const RADIAN = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
      fontSize={12} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

function StatCard({ label, value, color, icon }) {
  return (
    <div className="stat-card" style={{ borderColor: `${color}33` }}>
      <div className="stat-icon" style={{ background: `${color}20`, color }}>{icon}</div>
      <div>
        <p className="stat-value" style={{ color }}>{value}</p>
        <p className="stat-label">{label}</p>
      </div>
    </div>
  );
}

function Analytics({ todos }) {
  const total     = todos.length;
  const completed = todos.filter(t => t.is_completed).length;
  const active    = total - completed;
  const rate      = total ? Math.round((completed / total) * 100) : 0;

  // ── Completion Status ──────────────────────────────────────
  const statusData = [
    { name: 'Completed', value: completed },
    { name: 'Active',    value: active    },
  ].filter(d => d.value > 0);

  // ── Priority Breakdown ─────────────────────────────────────
  const priorityMap = {};
  todos.forEach(t => {
    const p = t.priority || 'Medium';
    priorityMap[p] = (priorityMap[p] || 0) + 1;
  });
  const priorityData = Object.entries(priorityMap).map(([name, value]) => ({ name, value }));

  // ── Category Breakdown ─────────────────────────────────────
  const catMap = {};
  todos.forEach(t => {
    const c = t.category || 'General';
    catMap[c] = (catMap[c] || 0) + 1;
  });
  const categoryData = Object.entries(catMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }));

  // ── Completion by Category ─────────────────────────────────
  const catCompMap = {};
  todos.forEach(t => {
    const c = t.category || 'General';
    if (!catCompMap[c]) catCompMap[c] = { done: 0, total: 0 };
    catCompMap[c].total++;
    if (t.is_completed) catCompMap[c].done++;
  });
  const barData = Object.entries(catCompMap)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 7)
    .map(([name, v]) => ({
      name: name.length > 10 ? name.slice(0, 9) + '…' : name,
      Completed: v.done,
      Active: v.total - v.done,
    }));

  if (total === 0) {
    return (
      <div className="analytics-empty">
        <div className="analytics-empty-icon">📊</div>
        <p>No tasks yet — add some tasks to see your analytics!</p>
      </div>
    );
  }

  return (
    <div className="analytics-container">

      {/* ── Stat Cards ─────────────────────── */}
      <div className="stat-cards">
        <StatCard label="Total Tasks"   value={total}       color="#6366f1" icon="📋" />
        <StatCard label="Completed"     value={completed}   color="#10b981" icon="✅" />
        <StatCard label="Active"        value={active}      color="#f59e0b" icon="⚡" />
        <StatCard label="Completion Rate" value={`${rate}%`} color="#a855f7" icon="🎯" />
      </div>

      {/* ── Row 1: Status + Priority pie charts ─── */}
      <div className="chart-row">

        {/* Completion Status */}
        <div className="chart-card">
          <h3 className="chart-title">Task Status</h3>
          <p className="chart-subtitle">Completed vs Active breakdown</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%" cy="50%"
                innerRadius={55} outerRadius={85}
                paddingAngle={4}
                dataKey="value"
                labelLine={false}
                label={renderCustomLabel}
              >
                {statusData.map((_, i) => (
                  <Cell key={i} fill={STATUS_COLORS[i]} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => (
                  <span style={{ color: '#9ca3af', fontSize: '0.8rem', fontWeight: 600 }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Breakdown */}
        <div className="chart-card">
          <h3 className="chart-title">Priority Split</h3>
          <p className="chart-subtitle">Tasks by priority level</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%" cy="50%"
                innerRadius={55} outerRadius={85}
                paddingAngle={4}
                dataKey="value"
                labelLine={false}
                label={renderCustomLabel}
              >
                {priorityData.map((entry) => (
                  <Cell key={entry.name} fill={PRIORITY_COLORS[entry.name] || '#6366f1'} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => (
                  <span style={{ color: '#9ca3af', fontSize: '0.8rem', fontWeight: 600 }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Category Distribution pie ─────────── */}
      {categoryData.length > 0 && (
        <div className="chart-card chart-card--wide">
          <h3 className="chart-title">Category Distribution</h3>
          <p className="chart-subtitle">How your tasks are grouped by subject / topic</p>
          <div className="category-chart-layout">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%" cy="50%"
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  labelLine={false}
                  label={renderCustomLabel}
                >
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={CATEGORY_PALETTE[i % CATEGORY_PALETTE.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  formatter={(value) => (
                    <span style={{ color: '#9ca3af', fontSize: '0.78rem', fontWeight: 600 }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── Completion by Category bar chart ─── */}
      {barData.length > 0 && (
        <div className="chart-card chart-card--wide">
          <h3 className="chart-title">Progress by Category</h3>
          <p className="chart-subtitle">Completed vs active tasks per subject</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} barCategoryGap="30%" barGap={2}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                content={({ active, payload, label }) => {
                  if (!active || !payload) return null;
                  return (
                    <div style={{
                      background: 'rgba(15,23,42,0.95)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px',
                      padding: '10px 16px',
                      fontSize: '0.82rem',
                      color: '#f9fafb',
                    }}>
                      <p style={{ fontWeight: 700, marginBottom: 6 }}>{label}</p>
                      {payload.map(p => (
                        <p key={p.name} style={{ color: p.fill }}>
                          {p.name}: <strong>{p.value}</strong>
                        </p>
                      ))}
                    </div>
                  );
                }}
              />
              <Legend
                formatter={(value) => (
                  <span style={{ color: '#9ca3af', fontSize: '0.8rem', fontWeight: 600 }}>{value}</span>
                )}
              />
              <Bar dataKey="Completed" fill="#10b981" radius={[6,6,0,0]} />
              <Bar dataKey="Active"    fill="#6366f1" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

    </div>
  );
}

export default Analytics;
