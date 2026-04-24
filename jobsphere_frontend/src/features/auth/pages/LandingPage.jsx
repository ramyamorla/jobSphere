import { useState } from "react";
import AuthEntryCard from "../components/AuthEntryCard";
import { authEntryInitialState } from "../dto/authDto";
import { checkUsername, signIn } from "../service/authService";

export default function LandingPage({ onAuthSuccess }) {
  const [formData, setFormData] = useState(authEntryInitialState);
  const [loading, setLoading] = useState(false);
  const [statusTone, setStatusTone] = useState(null);
  const [hideLogo, setHideLogo] = useState(false);

  function handleChange(event) {
    setStatusTone(null);
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleCheckUsername() {
    setLoading(true);
    setStatusTone(null);
    try {
      const response = await checkUsername(formData);
      setStatusTone(response.exists ? "registered" : "available");
    } catch {
      setStatusTone("fault");
    } finally {
      setLoading(false);
    }
  }

  async function handleQuickSignIn() {
    if (!formData.username.trim()) {
      setStatusTone("fault");
      return;
    }
    setLoading(true);
    setStatusTone(null);
    try {
      const { exists } = await checkUsername({
        username: formData.username,
        role: formData.role
      });
      if (!exists) {
        setStatusTone("fault");
        return;
      }
      const response = await signIn({
        username: formData.username,
        role: formData.role
      });
      onAuthSuccess(response);
    } catch {
      setStatusTone("fault");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateAccount(event) {
    event.preventDefault();
    const { fullName, email, username, role, companyName, collegeName } = formData;
    if (!username.trim() || !fullName.trim() || !email.trim()) {
      setStatusTone("fault");
      return;
    }
    if (role === "RECRUITER" && !companyName.trim()) {
      setStatusTone("fault");
      return;
    }
    if (role === "STUDENT" && !collegeName.trim()) {
      setStatusTone("fault");
      return;
    }
    setLoading(true);
    setStatusTone(null);
    try {
      const response = await signIn(formData);
      onAuthSuccess(response);
    } catch {
      setStatusTone("fault");
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
            alt="jobSphere"
            className="landing-big-logo"
            onError={() => setHideLogo(true)}
          />
        )}
        <h1 className="landing-hero-title">jobSphere</h1>
        <p className="landing-hero-subtitle">Smart hiring and career hub</p>
        <p className="brand-tagline">Connect students with the right opportunities and empower recruiters.</p>
      </section>
      <section className="entry-panel">
        <AuthEntryCard
          formData={formData}
          onChange={handleChange}
          onCheckUsername={handleCheckUsername}
          onQuickSignIn={handleQuickSignIn}
          onCreateAccount={handleCreateAccount}
          loading={loading}
          statusTone={statusTone}
          onClearStatus={() => setStatusTone(null)}
        />
      </section>
    </main>
  );
}
