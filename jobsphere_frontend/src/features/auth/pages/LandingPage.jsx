import { useState } from "react";
import AuthEntryCard from "../components/AuthEntryCard";
import { authEntryInitialState } from "../dto/authDto";
import { checkUsername, signIn } from "../service/authService";

export default function LandingPage({ onAuthSuccess }) {
  const [formData, setFormData] = useState(authEntryInitialState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [hideLogo, setHideLogo] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleCheckUsername() {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const response = await checkUsername(formData);
      if (response.exists) {
        setMessage("Username already exists for selected role. You can sign in.");
      } else {
        setMessage("Username not found for this role. Sign in to create a new account.");
      }
    } catch (err) {
      setError("Unable to check username. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignIn(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const response = await signIn(formData);
      onAuthSuccess(response);
    } catch (err) {
      setError("Sign in failed. Verify username/role and backend connectivity.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="landing-shell no-topbar">
      <div className="landing-overlay" />
      <section className="brand-panel logo-centric-panel">
        {!hideLogo && (
          <img
            src="/assets/jobsphere_logo.png"
            alt="jobSphere logo"
            className="landing-big-logo"
            onError={() => setHideLogo(true)}
          />
        )}
        <h1 className="landing-hero-title">jobSphere</h1>
        <p className="landing-hero-subtitle">Smart hiring and career hub</p>
        <p className="brand-tagline">Connect students with the right opportunities and empower recruiters.</p>
      </section>
      <section className="entry-panel">
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
        <AuthEntryCard
          formData={formData}
          onChange={handleChange}
          onCheckUsername={handleCheckUsername}
          onSignIn={handleSignIn}
          loading={loading}
        />
      </section>
    </main>
  );
}
