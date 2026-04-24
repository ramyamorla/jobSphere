import { useState } from "react";

const MODES = [
  { id: "signin", label: "Sign in" },
  { id: "signup", label: "Sign up" },
  { id: "access", label: "Access" }
];

export default function AuthEntryCard({
  formData,
  onChange,
  onCheckUsername,
  onQuickSignIn,
  onCreateAccount,
  loading,
  statusTone,
  onClearStatus
}) {
  const [mode, setMode] = useState("signin");
  const isRecruiter = formData.role === "RECRUITER";
  const toneClass = statusTone ? `auth-formal-card--${statusTone}` : "";

  function selectMode(next) {
    setMode(next);
    onClearStatus?.();
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    if (mode === "signup") {
      onCreateAccount(e);
    }
  }

  const headerLabel = MODES.find((m) => m.id === mode)?.label ?? "Sign in";

  return (
    <section className={`auth-formal-card auth-formal-card--dark ${toneClass}`.trim()}>
      <header className="auth-formal-head auth-formal-head--dark">
        <h2 className="auth-formal-title auth-formal-title--dark">{headerLabel}</h2>
      </header>

      <div className="auth-formal-centered">
        <div className="auth-mode-seg" role="tablist">
          {MODES.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={mode === id}
              className={`auth-mode-seg__btn ${mode === id ? "auth-mode-seg__btn--active" : ""}`}
              onClick={() => selectMode(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <form className="auth-formal-grid auth-formal-grid--dark" onSubmit={handleFormSubmit} noValidate>
          <div className="auth-formal-row auth-formal-row--dark">
            <label className="field-block auth-field-dark">
              <span className="auth-field-dark__label">Username</span>
              <input
                name="username"
                value={formData.username}
                onChange={onChange}
                autoComplete="username"
                required
              />
            </label>
            <label className="field-block auth-field-dark">
              <span className="auth-field-dark__label">Role</span>
              <select name="role" value={formData.role} onChange={onChange}>
                <option value="STUDENT">Student</option>
                <option value="RECRUITER">Recruiter</option>
              </select>
            </label>
          </div>

          {mode === "signup" && (
            <div className="auth-formal-row auth-formal-row--triple auth-formal-row--dark">
              <label className="field-block auth-field-dark">
                <span className="auth-field-dark__label">Full name</span>
                <input name="fullName" value={formData.fullName} onChange={onChange} autoComplete="name" required />
              </label>
              <label className="field-block auth-field-dark">
                <span className="auth-field-dark__label">Email</span>
                <input type="email" name="email" value={formData.email} onChange={onChange} autoComplete="email" required />
              </label>
              {isRecruiter ? (
                <label className="field-block auth-field-dark">
                  <span className="auth-field-dark__label">Company</span>
                  <input name="companyName" value={formData.companyName} onChange={onChange} autoComplete="organization" required />
                </label>
              ) : (
                <label className="field-block auth-field-dark">
                  <span className="auth-field-dark__label">College</span>
                  <input name="collegeName" value={formData.collegeName} onChange={onChange} required />
                </label>
              )}
            </div>
          )}

          <div className="auth-formal-cta">
            {mode === "signin" && (
              <button type="button" className="auth-btn auth-btn--dark-primary" onClick={onQuickSignIn} disabled={loading}>
                {loading ? "…" : "Sign in"}
              </button>
            )}
            {mode === "signup" && (
              <button type="submit" className="auth-btn auth-btn--dark-primary" disabled={loading}>
                {loading ? "…" : "Sign up"}
              </button>
            )}
            {mode === "access" && (
              <button type="button" className="auth-btn auth-btn--dark-primary" onClick={onCheckUsername} disabled={loading}>
                {loading ? "…" : "Check username"}
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
