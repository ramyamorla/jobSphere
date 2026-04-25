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
  return (
    <section className="card job-grid-panel">
      <div className="job-grid-panel-head">
        <h2>{title}</h2>
        <span className="job-grid-count">{loading ? "…" : `${jobs.length} result${jobs.length === 1 ? "" : "s"}`}</span>
      </div>

      <form
        className="job-grid-toolbar"
        onSubmit={(e) => {
          e.preventDefault();
          onApplyFilters();
        }}
      >
        <div className="job-grid-toolbar-fields">
          <label className="job-grid-field">
            <span>Search</span>
            <input
              name="keyword"
              value={filters.keyword}
              onChange={onFilterChange}
              placeholder="Title or company"
            />
          </label>
          <label className="job-grid-field">
            <span>Location</span>
            <select name="location" value={filters.location} onChange={onFilterChange}>
              <option value="">All</option>
              {locationOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>
          <label className="job-grid-field">
            <span>Type</span>
            <select name="jobType" value={filters.jobType} onChange={onFilterChange}>
              <option value="">All</option>
              {jobTypeOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>
          <label className="job-grid-field">
            <span>Mode</span>
            <select name="workMode" value={filters.workMode} onChange={onFilterChange}>
              <option value="">All</option>
              {workModeOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>
          <label className="job-grid-field job-grid-field--salary">
            <span>Min salary</span>
            <input
              type="number"
              name="minSalary"
              value={filters.minSalary}
              onChange={onFilterChange}
              placeholder="Min"
            />
          </label>
        </div>
        <div className="job-grid-toolbar-actions">
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Updating…" : "Apply"}
          </button>
          <button type="button" className="secondary-btn" onClick={onResetFilters} disabled={loading}>
            Clear
          </button>
        </div>
      </form>

      <div className="job-grid-table-region">
        <JobList
          jobs={jobs}
          loading={loading}
          onDelete={onDelete}
          deletingId={deletingId}
          canDelete={canDelete}
          showApply={showApply}
          onApply={onApply}
          applyingId={applyingId}
          embedded
        />
      </div>
    </section>
  );
}
