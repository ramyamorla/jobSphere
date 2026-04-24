export default function JobList({ jobs, loading, onDelete, deletingId }) {
  return (
    <section className="card">
      <h2>Available Jobs</h2>
      {loading && <p>Loading jobs...</p>}
      {!loading && jobs.length === 0 && <p>No jobs posted yet.</p>}
      <ul className="jobs-list">
        {jobs.map((job) => (
          <li key={job.id} className="job-item">
            <h3>{job.title}</h3>
            <p>
              {job.companyName} - {job.location}
            </p>
            <p>
              Type: {job.jobType} | Recruiter: {job.postedByRecruiterId}
            </p>
            <button
              type="button"
              className="danger-btn"
              onClick={() => onDelete(job.id)}
              disabled={deletingId === job.id}
            >
              {deletingId === job.id ? "Deleting..." : "Delete Job"}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
