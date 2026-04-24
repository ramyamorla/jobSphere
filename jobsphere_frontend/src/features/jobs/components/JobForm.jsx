import {
  experienceOptions,
  jobTypeOptions,
  locationOptions,
  workModeOptions
} from "../dto/jobDto";

export default function JobForm({ formData, onChange, onSubmit, loading, recruiterProfileId }) {
  return (
    <section className="card">
      <h2>Post New Job</h2>
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
            value={formData.companyName ?? ""}
            onChange={onChange}
            placeholder=""
            required
          />
        </label>
        <label>
          Location
          <select
            name="location"
            value={formData.location}
            onChange={onChange}
            required
          >
            {locationOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          Job Type
          <select
            name="jobType"
            value={formData.jobType}
            onChange={onChange}
            required
          >
            {jobTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          Work Mode
          <select name="workMode" value={formData.workMode} onChange={onChange} required>
            {workModeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          Experience Level
          <select name="experienceLevel" value={formData.experienceLevel} onChange={onChange} required>
            {experienceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          Min Salary
          <input type="number" name="minSalary" value={formData.minSalary} onChange={onChange} required />
        </label>
        <label>
          Max Salary
          <input type="number" name="maxSalary" value={formData.maxSalary} onChange={onChange} required />
        </label>
        <label>
          Salary Currency
          <select name="salaryCurrency" value={formData.salaryCurrency} onChange={onChange} required>
            <option value="INR">INR</option>
            <option value="USD">USD</option>
          </select>
        </label>
        <label>
          Total Openings
          <input type="number" name="totalPositions" value={formData.totalPositions} onChange={onChange} required />
        </label>
        <label>
          Skills (comma separated)
          <input
            name="requiredSkills"
            value={formData.requiredSkills}
            onChange={onChange}
            placeholder="Java, Spring Boot, MongoDB"
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
          {loading ? "Posting..." : "Post Job"}
        </button>
      </form>
    </section>
  );
}
