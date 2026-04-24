export default function AuthEntryCard({
  formData,
  onChange,
  onCheckUsername,
  onSignIn,
  loading
}) {
  return (
    <section className="entry-card">
      <h2>Enter jobSphere</h2>
      <p className="entry-subtitle">Choose your role and continue with your username.</p>
      <form onSubmit={onSignIn} className="form-grid">
        <label className="field-block">
          Username
          <input
            name="username"
            value={formData.username}
            onChange={onChange}
            placeholder="ramya"
            required
          />
        </label>
        <label className="field-block">
          I am joining as
          <select name="role" value={formData.role} onChange={onChange}>
            <option value="STUDENT">Student</option>
            <option value="RECRUITER">Recruiter</option>
          </select>
        </label>
        <div className="actions-row">
          <button type="button" className="secondary-btn" onClick={onCheckUsername} disabled={loading}>
            Check Username
          </button>
          <button type="submit" disabled={loading}>
            {loading ? "Please wait..." : "Sign In / Register"}
          </button>
        </div>
      </form>
    </section>
  );
}
