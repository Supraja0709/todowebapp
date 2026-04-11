function SkeletonLoader({ count = 4 }) {
  return (
    <div className="skeleton-list">
      {Array.from({ length: count }).map((_, i) => (
        <div className="skeleton-item" key={i} style={{ animationDelay: `${i * 0.08}s` }}>
          <div className="skeleton-check" />
          <div className="skeleton-content">
            <div className="skeleton-line skeleton-line--long" />
            <div className="skeleton-tags">
              <div className="skeleton-tag" />
              <div className="skeleton-tag skeleton-tag--short" />
            </div>
          </div>
          <div className="skeleton-actions">
            <div className="skeleton-btn" />
            <div className="skeleton-btn" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default SkeletonLoader;
