import { jobTypeOptions, locationOptions, workModeOptions } from "../dto/jobDto";
import JobList from "./JobList";

export default function JobGridPanel({
  title,
  jobs,
  loading,
  filters,
  onFilterChange,
  onApplyFilters,
  onResetFilters,
  onDelete,
  deletingId,
  canDelete,
  showApply = false,
  onApply,
  applyingId = ""
}) {
  const activeFilterCount = Object.values(filters || {}).filter((v) => v && v !== "").length;

  return (
    <div className="jgp-shell">
      {/* Filter bar */}
      <form
        className="jgp-filters"
        onSubmit={(e) => {
          e.preventDefault();
          onApplyFilters();
        }}
      >
        <div className="jgp-filters-row">
          <label className="jgp-field jgp-field--search">
            <span className="jgp-field-icon">🔍</span>
            <input
              name="keyword"
              value={filters.keyword}
              onChange={onFilterChange}
              placeholder="Search by title or company..."
            />
          </label>
          <label className="jgp-field">
            <select name="location" value={filters.location} onChange={onFilterChange}>
              <option value="">All locations</option>
              {locationOptions.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </label>
          <label className="jgp-field">
            <select name="jobType" value={filters.jobType} onChange={onFilterChange}>
              <option value="">Any type</option>
              {jobTypeOptions.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </label>
          <label className="jgp-field">
            <select name="workMode" value={filters.workMode} onChange={onFilterChange}>
              <option value="">Any mode</option>
              {workModeOptions.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </label>
          <label className="jgp-field jgp-field--mini">
            <input
              type="number"
              name="minSalary"
              value={filters.minSalary}
              onChange={onFilterChange}
              placeholder="Min salary"
            />
          </label>
          <button type="submit" className="jgp-btn-apply" disabled={loading}>
            {loading ? "…" : "Apply"}
          </button>
          {activeFilterCount > 0 && (
            <button type="button" className="jgp-btn-clear" onClick={onResetFilters} disabled={loading}>
              Clear
            </button>
          )}
        </div>
      </form>

      {/* Result count */}
      <div className="jgp-results-bar">
        <span className="jgp-results-count">
          {loading ? "Loading…" : `${jobs.length} ${jobs.length === 1 ? "result" : "results"}`}
        </span>
      </div>

      {/* Job cards */}
      <JobList
        jobs={jobs}
        loading={loading}
        onDelete={onDelete}
        deletingId={deletingId}
        canDelete={canDelete}
        showApply={showApply}
        onApply={onApply}
        applyingId={applyingId}
      />
    </div>
  );
}
