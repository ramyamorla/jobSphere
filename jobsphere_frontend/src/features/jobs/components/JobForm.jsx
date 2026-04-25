import {
  experienceOptions,
  jobTypeOptions,
  locationOptions,
  workModeOptions
} from "../dto/jobDto";

const CURRENCY_SYMBOLS = { INR: "₹", USD: "$" };

function formatSalary(val, currency) {
  const n = Number(val);
  if (!n) return "—";
  const sym = CURRENCY_SYMBOLS[currency] || currency;
  if (n >= 100000) return `${sym}${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `${sym}${(n / 1000).toFixed(0)}K`;
  return `${sym}${n}`;
}

export default function JobForm({ formData, onChange, onSubmit, loading, recruiterProfileId }) {
  const skills = (formData.requiredSkills || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const salaryRange =
    formData.minSalary || formData.maxSalary
      ? `${formatSalary(formData.minSalary, formData.salaryCurrency)} – ${formatSalary(formData.maxSalary, formData.salaryCurrency)}`
      : "Not specified";

  return (
    <div className="jf-shell">

      {/* ── Left: Form ── */}
      <form className="jf-form" onSubmit={onSubmit}>

        {/* Role Details */}
        <div className="jf-group">
          <p className="jf-group-label">Role Details</p>
          <div className="jf-group-fields">
            <div className="jf-field jf-field--full">
              <label className="jf-label" htmlFor="jf-title">
                Job Title <span className="jf-required">*</span>
              </label>
              <input
                id="jf-title"
                className="jf-input"
                name="title"
                value={formData.title}
                onChange={onChange}
                placeholder="e.g. Senior Software Engineer"
                required
              />
            </div>
            <div className="jf-field jf-field--full">
              <label className="jf-label" htmlFor="jf-company">
                Company Name <span className="jf-required">*</span>
              </label>
              <input
                id="jf-company"
                className="jf-input"
                name="companyName"
                value={formData.companyName ?? ""}
                onChange={onChange}
                placeholder="Your company name"
                required
              />
            </div>
            <div className="jf-field">
              <label className="jf-label" htmlFor="jf-skills">Required Skills</label>
              <input
                id="jf-skills"
                className="jf-input"
                name="requiredSkills"
                value={formData.requiredSkills}
                onChange={onChange}
                placeholder="React, Node.js, Python..."
              />
              <p className="jf-hint">Separate with commas</p>
            </div>
            <div className="jf-field">
              <label className="jf-label" htmlFor="jf-openings">
                Total Openings <span className="jf-required">*</span>
              </label>
              <input
                id="jf-openings"
                className="jf-input"
                type="number"
                name="totalPositions"
                value={formData.totalPositions}
                onChange={onChange}
                min="1"
                required
              />
            </div>
          </div>
        </div>

        <div className="jf-divider" />

        {/* Work Setup */}
        <div className="jf-group">
          <p className="jf-group-label">Work Setup</p>
          <div className="jf-group-fields">
            <div className="jf-field">
              <label className="jf-label" htmlFor="jf-location">
                Location <span className="jf-required">*</span>
              </label>
              <select id="jf-location" className="jf-select" name="location" value={formData.location} onChange={onChange} required>
                {locationOptions.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div className="jf-field">
              <label className="jf-label" htmlFor="jf-workmode">
                Work Mode <span className="jf-required">*</span>
              </label>
              <select id="jf-workmode" className="jf-select" name="workMode" value={formData.workMode} onChange={onChange} required>
                {workModeOptions.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div className="jf-field">
              <label className="jf-label" htmlFor="jf-jobtype">
                Job Type <span className="jf-required">*</span>
              </label>
              <select id="jf-jobtype" className="jf-select" name="jobType" value={formData.jobType} onChange={onChange} required>
                {jobTypeOptions.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div className="jf-field">
              <label className="jf-label" htmlFor="jf-exp">
                Experience Level <span className="jf-required">*</span>
              </label>
              <select id="jf-exp" className="jf-select" name="experienceLevel" value={formData.experienceLevel} onChange={onChange} required>
                {experienceOptions.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="jf-divider" />

        {/* Compensation */}
        <div className="jf-group">
          <p className="jf-group-label">Compensation</p>
          <div className="jf-group-fields">
            <div className="jf-field">
              <label className="jf-label" htmlFor="jf-currency">Currency</label>
              <select id="jf-currency" className="jf-select" name="salaryCurrency" value={formData.salaryCurrency} onChange={onChange}>
                <option value="INR">INR — Indian Rupee</option>
                <option value="USD">USD — US Dollar</option>
              </select>
            </div>
            <div className="jf-field" />
            <div className="jf-field">
              <label className="jf-label" htmlFor="jf-minsal">
                Min Salary <span className="jf-required">*</span>
              </label>
              <div className="jf-salary-wrap">
                <span className="jf-salary-sym">{CURRENCY_SYMBOLS[formData.salaryCurrency] || formData.salaryCurrency}</span>
                <input
                  id="jf-minsal"
                  className="jf-input jf-input--salary"
                  type="number"
                  name="minSalary"
                  value={formData.minSalary}
                  onChange={onChange}
                  required
                />
              </div>
            </div>
            <div className="jf-field">
              <label className="jf-label" htmlFor="jf-maxsal">
                Max Salary <span className="jf-required">*</span>
              </label>
              <div className="jf-salary-wrap">
                <span className="jf-salary-sym">{CURRENCY_SYMBOLS[formData.salaryCurrency] || formData.salaryCurrency}</span>
                <input
                  id="jf-maxsal"
                  className="jf-input jf-input--salary"
                  type="number"
                  name="maxSalary"
                  value={formData.maxSalary}
                  onChange={onChange}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <input type="hidden" name="postedByRecruiterId" value={recruiterProfileId || formData.postedByRecruiterId} />

        <div className="jf-form-footer">
          <button className="jf-submit" type="submit" disabled={loading}>
            {loading ? <><span className="jf-spin" />Publishing...</> : "Publish Listing"}
          </button>
          <p className="jf-footer-note">Your listing goes live immediately after publishing.</p>
        </div>
      </form>

      {/* ── Right: Live Preview ── */}
      <aside className="jf-preview">
        <div className="jf-preview-label">
          <span className="jf-preview-dot" />
          Live Preview
        </div>
        <div className="jf-preview-card">
          <div className="jf-preview-card-top">
            <div className="jf-preview-logo">
              {(formData.companyName || "C")[0].toUpperCase()}
            </div>
            <div>
              <p className="jf-preview-company">{formData.companyName || "Company name"}</p>
              <p className="jf-preview-posted">
                Just now · {formData.totalPositions || 1} opening{Number(formData.totalPositions) !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <h3 className="jf-preview-title">{formData.title || "Job Title"}</h3>
          <div className="jf-preview-tags">
            {formData.location && <span className="jf-preview-tag">{formData.location}</span>}
            {formData.workMode && <span className="jf-preview-tag">{formData.workMode}</span>}
            {formData.jobType && <span className="jf-preview-tag">{formData.jobType}</span>}
            {formData.experienceLevel && <span className="jf-preview-tag">{formData.experienceLevel}</span>}
          </div>
          <div className="jf-preview-salary">
            <span className="jf-preview-salary-label">Salary Range</span>
            <span className="jf-preview-salary-val">{salaryRange}</span>
          </div>
          {skills.length > 0 && (
            <div className="jf-preview-skills">
              {skills.slice(0, 6).map((s) => (
                <span key={s} className="jf-skill-chip">{s}</span>
              ))}
              {skills.length > 6 && <span className="jf-skill-more">+{skills.length - 6}</span>}
            </div>
          )}
          <button className="jf-preview-apply" tabIndex="-1" disabled>Apply Now</button>
        </div>

        <div className="jf-preview-tips">
          <p className="jf-tip-head">Tips for a great listing</p>
          <ul className="jf-tip-list">
            <li>Use a specific title to attract relevant applicants</li>
            <li>Clear salary ranges get 40% more applications</li>
            <li>List 4–6 key skills to target the right talent</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
