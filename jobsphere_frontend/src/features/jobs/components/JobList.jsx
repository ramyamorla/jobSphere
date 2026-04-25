export default function JobList({
  jobs,
  loading,
  onDelete,
  deletingId,
  canDelete,
  embedded = false,
  showApply = false,
  onApply,
  applyingId = ""
}) {
  const tableBlock = (
    <>
      {loading && <p className="job-table-status">Loading…</p>}
      {!loading && jobs.length === 0 && <p className="job-table-status">No jobs match your criteria.</p>}
      <div className="table-wrap">
        <table className="jobs-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Company</th>
              <th>Location</th>
              <th>Type</th>
              <th>Mode</th>
              <th>Experience</th>
              <th>Salary</th>
              <th>Openings</th>
              <th>Skills</th>
              {(canDelete || showApply) && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>{job.title}</td>
                <td>{job.companyName}</td>
                <td>{job.location}</td>
                <td>{job.jobType}</td>
                <td>{job.workMode}</td>
                <td>{job.experienceLevel}</td>
                <td>
                  {job.salaryCurrency} {job.minSalary?.toLocaleString()} - {job.maxSalary?.toLocaleString()}
                </td>
                <td>
                  <span className="openings-pill">
                    {job.openPositions} left / {job.totalPositions}
                  </span>
                </td>
                <td>{(job.requiredSkills || []).join(", ") || "—"}</td>
                {(canDelete || showApply) && (
                  <td>
                    {canDelete ? (
                      <button
                        type="button"
                        className="danger-btn danger-btn--table"
                        onClick={() => onDelete(job.id)}
                        disabled={deletingId === job.id}
                      >
                        {deletingId === job.id ? "…" : "Delete"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="primary-btn"
                        onClick={() => onApply(job.id)}
                        disabled={applyingId === job.id || job.openPositions <= 0}
                      >
                        {job.openPositions <= 0 ? "Closed" : applyingId === job.id ? "Applying…" : "Apply"}
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  if (embedded) {
    return tableBlock;
  }

  return (
    <section className="card">
      <h2>Available Jobs ({jobs.length})</h2>
      {tableBlock}
    </section>
  );
}
