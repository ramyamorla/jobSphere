const CURRENCY_SYMBOLS = { INR: "₹", USD: "$" };

function formatSalary(val, currency) {
  const n = Number(val);
  if (!n) return "";
  const sym = CURRENCY_SYMBOLS[currency] || currency;
  if (n >= 100000) return `${sym}${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `${sym}${(n / 1000).toFixed(0)}K`;
  return `${sym}${n}`;
}

function relativeTime(value) {
  if (!value) return "Recently";
  const then = new Date(value).getTime();
  if (!then) return "Recently";
  const diff = Date.now() - then;
  const days = Math.floor(diff / 86400000);
  if (days < 1) return "Today";
  if (days < 2) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default function JobList({
  jobs,
  loading,
  onDelete,
  deletingId,
  canDelete,
  showApply = false,
  onApply,
  applyingId = ""
}) {
  if (loading) {
    return (
      <div className="jl-loading">
        <div className="jl-spinner" />
        <p>Loading opportunities…</p>
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="jl-empty">
        <div className="jl-empty-icon">🔍</div>
        <h3>No jobs found</h3>
        <p>Try adjusting your filters or searching for something else.</p>
      </div>
    );
  }

  return (
    <div className="jl-grid">
      {jobs.map((job) => {
        const skills = Array.isArray(job.requiredSkills)
          ? job.requiredSkills
          : (job.requiredSkills || "").toString().split(",").map((s) => s.trim()).filter(Boolean);
        const initial = (job.companyName || "C")[0].toUpperCase();
        const isClosed = (job.openPositions ?? 0) <= 0;
        const salaryText = job.minSalary || job.maxSalary
          ? `${formatSalary(job.minSalary, job.salaryCurrency)} – ${formatSalary(job.maxSalary, job.salaryCurrency)}`
          : "Salary not disclosed";

        return (
          <article key={job.id} className="jl-card">
            <div className="jl-card-head">
              <div className="jl-logo">{initial}</div>
              <div className="jl-card-head-text">
                <h3 className="jl-title">{job.title}</h3>
                <div className="jl-company-line">
                  <span className="jl-company">{job.companyName}</span>
                  <span className="jl-dot">•</span>
                  <span className="jl-location">📍 {job.location}</span>
                </div>
              </div>
              <span className={`jl-status ${isClosed ? "jl-status--closed" : "jl-status--open"}`}>
                <span className="jl-status-dot" />
                {isClosed ? "Closed" : "Open"}
              </span>
            </div>

            <div className="jl-tags">
              {job.jobType && <span className="jl-tag">{job.jobType}</span>}
              {job.workMode && <span className="jl-tag">{job.workMode}</span>}
              {job.experienceLevel && <span className="jl-tag">{job.experienceLevel}</span>}
            </div>

            <div className="jl-meta-grid">
              <div className="jl-meta">
                <span className="jl-meta-lbl">💰 Salary</span>
                <span className="jl-meta-val">{salaryText}</span>
              </div>
              <div className="jl-meta">
                <span className="jl-meta-lbl">👥 Openings</span>
                <span className="jl-meta-val">
                  <strong>{job.openPositions ?? 0}</strong>
                  <span className="jl-meta-sub"> / {job.totalPositions ?? 0}</span>
                </span>
              </div>
              <div className="jl-meta">
                <span className="jl-meta-lbl">⏱ Posted</span>
                <span className="jl-meta-val">{relativeTime(job.postedAt || job.createdAt)}</span>
              </div>
            </div>

            {skills.length > 0 && (
              <div className="jl-skills">
                {skills.slice(0, 5).map((s) => (
                  <span key={s} className="jl-skill-chip">{s}</span>
                ))}
                {skills.length > 5 && <span className="jl-skill-more">+{skills.length - 5}</span>}
              </div>
            )}

            {(canDelete || showApply) && (
              <div className="jl-card-actions">
                {canDelete && (
                  <button
                    type="button"
                    className="jl-btn jl-btn--danger"
                    onClick={() => onDelete(job.id)}
                    disabled={deletingId === job.id}
                  >
                    {deletingId === job.id ? "Deleting…" : "Delete listing"}
                  </button>
                )}
                {showApply && (
                  <button
                    type="button"
                    className="jl-btn jl-btn--primary"
                    onClick={() => onApply(job.id)}
                    disabled={applyingId === job.id || isClosed}
                  >
                    {isClosed ? "Position Closed" : applyingId === job.id ? "Applying…" : "Apply Now →"}
                  </button>
                )}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
