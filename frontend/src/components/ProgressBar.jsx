function ProgressBar({ todos }) {
  const total = todos.length;
  const completed = todos.filter(t => t.is_completed).length;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  const color =
    pct === 100 ? '#10b981' :
    pct >= 60   ? '#6366f1' :
    pct >= 30   ? '#f59e0b' : '#ef4444';

  return (
    <div className="progress-section">
      <div className="progress-header">
        <span className="progress-label">
          {total === 0 ? 'No tasks yet' : `${completed} of ${total} tasks completed`}
        </span>
        <span className="progress-pct" style={{ color }}>{pct}%</span>
      </div>
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      {pct === 100 && total > 0 && (
        <p className="progress-congrats">🎉 All done! You crushed it today!</p>
      )}
    </div>
  );
}

export default ProgressBar;
