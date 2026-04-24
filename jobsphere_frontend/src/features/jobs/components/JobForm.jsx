export default function JobForm({ formData, onChange, onSubmit, loading, recruiterProfileId }) {
  return (
    <section className="card">
      <h2>Create Job</h2>
      <form onSubmit={onSubmit} className="form-grid">
        <label>
          Title
          <input
            name="title"
            value={formData.title}
            onChange={onChange}
            placeholder="Software Engineer"
            required
          />
        </label>
        <label>
          Company Name
          <input
            name="companyName"
            value={formData.companyName}
            onChange={onChange}
            placeholder="JobSphere Inc"
            required
          />
        </label>
        <label>
          Location
          <input
            name="location"
            value={formData.location}
            onChange={onChange}
            placeholder="Hyderabad"
            required
          />
        </label>
        <label>
          Job Type
          <input
            name="jobType"
            value={formData.jobType}
            onChange={onChange}
            placeholder="Full-time"
            required
          />
        </label>
        <label>
          Recruiter ID
          <input
            name="postedByRecruiterId"
            value={recruiterProfileId || formData.postedByRecruiterId}
            onChange={onChange}
            placeholder="recruiter-profile-id"
            readOnly={Boolean(recruiterProfileId)}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Job"}
        </button>
      </form>
    </section>
  );
}
