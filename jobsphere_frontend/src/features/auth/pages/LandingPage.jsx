import { useEffect, useRef, useState } from "react";
import { authEntryInitialState } from "../dto/authDto";
import { checkUsername, signIn } from "../service/authService";

function AnimatedCounter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const duration = 1600;
          const step = Math.ceil(target / (duration / 16));
          const timer = setInterval(() => {
            start = Math.min(start + step, target);
            setCount(start);
            if (start >= target) clearInterval(timer);
          }, 16);
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function LandingPage({ onAuthSuccess }) {
  const [formData, setFormData] = useState(authEntryInitialState);
  const [loading, setLoading] = useState(false);
  const [statusTone, setStatusTone] = useState(null);
  const [authPage, setAuthPage] = useState(null);
  const [typedText, setTypedText] = useState("");
  const [jobSearch, setJobSearch] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);

  const phrases = [
    "Dream Job. Find Talent.",
    "Apply Faster. Hire Smarter.",
    "Your Career Starts Here.",
    "All in One Place."
  ];
  const phraseRef = useRef({ p: 0, i: 0, deleting: false, pause: 0 });

  useEffect(() => {
    const tick = () => {
      const r = phraseRef.current;
      if (r.pause > 0) {
        r.pause--;
        return;
      }
      const current = phrases[r.p];
      if (!r.deleting) {
        r.i++;
        setTypedText(current.slice(0, r.i));
        if (r.i >= current.length) {
          r.deleting = true;
          r.pause = 28;
        }
      } else {
        r.i--;
        setTypedText(current.slice(0, r.i));
        if (r.i <= 0) {
          r.deleting = false;
          r.p = (r.p + 1) % phrases.length;
          r.pause = 6;
        }
      }
    };
    const timer = setInterval(tick, 68);
    return () => clearInterval(timer);
  }, []);

  function handleChange(e) {
    setStatusTone(null);
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleCheckUsername() {
    setLoading(true);
    setStatusTone(null);
    try {
      const r = await checkUsername(formData);
      setStatusTone(r.exists ? "registered" : "available");
    } catch {
      setStatusTone("fault");
    } finally {
      setLoading(false);
    }
  }

  async function handleQuickSignIn() {
    if (!formData.username.trim()) { setStatusTone("fault"); return; }
    setLoading(true);
    setStatusTone(null);
    try {
      const { exists } = await checkUsername({ username: formData.username, role: formData.role });
      if (!exists) { setStatusTone("fault"); return; }
      const r = await signIn({ username: formData.username, role: formData.role });
      onAuthSuccess(r);
    } catch {
      setStatusTone("fault");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateAccount(e) {
    e.preventDefault();
    const { fullName, email, username, role, companyName, collegeName } = formData;
    if (!username.trim() || !fullName.trim() || !email.trim()) { setStatusTone("fault"); return; }
    if (role === "RECRUITER" && !companyName.trim()) { setStatusTone("fault"); return; }
    if (role === "STUDENT" && !collegeName.trim()) { setStatusTone("fault"); return; }
    setLoading(true);
    setStatusTone(null);
    try {
      const r = await signIn(formData);
      onAuthSuccess(r);
    } catch {
      setStatusTone("fault");
    } finally {
      setLoading(false);
    }
  }

  function openAuth(mode, role) {
    setAuthPage(mode);
    if (role) setFormData((prev) => ({ ...prev, role }));
  }

  if (authPage === "signin") {
    return (
      <div className="js-auth-shell">
        <div className="js-auth-left">
          <div className="js-auth-left-content">
            <button type="button" className="js-brand js-auth-brand" onClick={() => setAuthPage(null)}>
              <span className="js-brand-job">Job</span><span className="js-brand-sphere">Sphere</span>
            </button>
            <h2 className="js-auth-left-title">Find your dream job today.</h2>
            <p className="js-auth-left-sub">Connecting ambitious people with great companies worldwide.</p>
            <div className="js-auth-left-stats">
              <div className="js-auth-left-stat"><strong>100K+</strong><span>Live jobs</span></div>
              <div className="js-auth-left-stat"><strong>12K+</strong><span>Companies</span></div>
              <div className="js-auth-left-stat"><strong>250K+</strong><span>Hired</span></div>
            </div>
            <div className="js-auth-left-orb js-auth-orb-1" aria-hidden />
            <div className="js-auth-left-orb js-auth-orb-2" aria-hidden />
          </div>
        </div>

        <div className="js-auth-right">
          <div className="js-auth-form-wrap">
            <button type="button" className="js-auth-back" onClick={() => setAuthPage(null)}>
              ← Back to home
            </button>
            <div className="js-auth-form-head">
              <h1>Welcome back</h1>
              <p>Sign in to continue your journey on JobSphere.</p>
            </div>

            {statusTone === "fault" && (
              <div className="js-auth-alert js-auth-alert--err">Username not found or invalid credentials.</div>
            )}
            {statusTone === "registered" && (
              <div className="js-auth-alert js-auth-alert--ok">Username found! Click sign in.</div>
            )}

            <form className="js-auth-form" onSubmit={(e) => { e.preventDefault(); handleQuickSignIn(); }}>
              <div className="js-auth-field">
                <label htmlFor="si-username">Username</label>
                <input
                  id="si-username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  autoComplete="username"
                  required
                />
              </div>
              <div className="js-auth-field">
                <label htmlFor="si-role">I am a</label>
                <select id="si-role" name="role" value={formData.role} onChange={handleChange}>
                  <option value="STUDENT">Student / Job Seeker</option>
                  <option value="RECRUITER">Recruiter / Employer</option>
                </select>
              </div>
              <div className="js-auth-forgot">
                <button type="button" className="js-auth-link">Forgot password?</button>
              </div>
              <button type="submit" className="js-btn js-btn-primary js-auth-submit" disabled={loading}>
                {loading ? <span className="js-auth-spinner" /> : "Sign In"}
              </button>
            </form>

            <p className="js-auth-switch">
              Don't have an account?{" "}
              <button type="button" className="js-auth-link" onClick={() => openAuth("signup", formData.role)}>
                Create one — it's free
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (authPage === "signup") {
    return (
      <div className="js-auth-shell">
        <div className="js-auth-left js-auth-left--green">
          <div className="js-auth-left-content">
            <button type="button" className="js-brand js-auth-brand" onClick={() => setAuthPage(null)}>
              <span className="js-brand-job">Job</span><span className="js-brand-sphere">Sphere</span>
            </button>
            <h2 className="js-auth-left-title">Your next opportunity starts here.</h2>
            <p className="js-auth-left-sub">Join thousands of ambitious professionals and top recruiters on JobSphere.</p>
            <ul className="js-auth-left-perks">
              <li>✓ Free forever — no hidden fees</li>
              <li>✓ Set up in under 2 minutes</li>
              <li>✓ 100,000+ live job openings</li>
              <li>✓ Smart match with top companies</li>
            </ul>
            <div className="js-auth-left-stats">
              <div className="js-auth-left-stat"><strong>Free</strong><span>Always</span></div>
              <div className="js-auth-left-stat"><strong>2 min</strong><span>Setup</span></div>
              <div className="js-auth-left-stat"><strong>100K+</strong><span>Jobs</span></div>
            </div>
            <div className="js-auth-left-orb js-auth-orb-1" aria-hidden />
            <div className="js-auth-left-orb js-auth-orb-2" aria-hidden />
          </div>
        </div>

        <div className="js-auth-right">
          <div className="js-auth-form-wrap js-auth-form-wrap--wide">
            <button type="button" className="js-auth-back" onClick={() => setAuthPage(null)}>
              ← Back to home
            </button>
            <div className="js-auth-form-head">
              <h1>Create your account</h1>
              <p>Join JobSphere — it's free and takes less than 2 minutes.</p>
            </div>

            {statusTone === "fault" && (
              <div className="js-auth-alert js-auth-alert--err">Please fill in all required fields correctly.</div>
            )}

            <form className="js-auth-form" onSubmit={handleCreateAccount}>
              <div className="js-auth-field">
                <label htmlFor="su-role">I am joining as</label>
                <div className="js-role-toggle">
                  <button
                    type="button"
                    className={`js-role-btn${formData.role === "STUDENT" ? " js-role-btn--active" : ""}`}
                    onClick={() => handleChange({ target: { name: "role", value: "STUDENT" } })}
                  >
                    👤 Job Seeker
                  </button>
                  <button
                    type="button"
                    className={`js-role-btn${formData.role === "RECRUITER" ? " js-role-btn--active" : ""}`}
                    onClick={() => handleChange({ target: { name: "role", value: "RECRUITER" } })}
                  >
                    🏢 Recruiter
                  </button>
                </div>
              </div>

              <div className="js-auth-row">
                <div className="js-auth-field">
                  <label htmlFor="su-name">Full name</label>
                  <input id="su-name" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Your full name" autoComplete="name" required />
                </div>
                <div className="js-auth-field">
                  <label htmlFor="su-username">Username</label>
                  <input id="su-username" name="username" value={formData.username} onChange={handleChange} placeholder="Pick a username" autoComplete="username" required />
                </div>
              </div>

              <div className="js-auth-field">
                <label htmlFor="su-email">Email address</label>
                <input id="su-email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@email.com" autoComplete="email" required />
              </div>

              {formData.role === "RECRUITER" ? (
                <div className="js-auth-field">
                  <label htmlFor="su-company">Company name</label>
                  <input id="su-company" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Your company" autoComplete="organization" required />
                </div>
              ) : (
                <div className="js-auth-field">
                  <label htmlFor="su-college">College / University</label>
                  <input id="su-college" name="collegeName" value={formData.collegeName} onChange={handleChange} placeholder="Your college or university" required />
                </div>
              )}

              <button type="submit" className="js-btn js-btn-primary js-auth-submit" disabled={loading}>
                {loading ? <span className="js-auth-spinner" /> : "Create Free Account →"}
              </button>
            </form>

            <p className="js-auth-switch">
              Already have an account?{" "}
              <button type="button" className="js-auth-link" onClick={() => openAuth("signin", formData.role)}>
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  const popularTags = ["Frontend", "Backend", "Data Science", "Remote", "Design", "DevOps"];
  const stats = [
    { label: "Live Jobs", value: 100, suffix: "K+" },
    { label: "Companies", value: 12, suffix: "K+" },
    { label: "Hired", value: 250, suffix: "K+" },
    { label: "Countries", value: 40, suffix: "+" }
  ];
  const categories = [
    { icon: "💻", name: "Engineering", count: "8,420" },
    { icon: "🎨", name: "Design", count: "3,210" },
    { icon: "📦", name: "Product", count: "2,140" },
    { icon: "🤖", name: "Data & AI", count: "5,600" },
    { icon: "📢", name: "Marketing", count: "1,980" },
    { icon: "💰", name: "Finance", count: "2,720" },
    { icon: "⚙️", name: "Operations", count: "1,540" },
    { icon: "🔐", name: "Security", count: "980" }
  ];
  const features = [
    { icon: "🎯", title: "Smart Matching", desc: "AI-powered role recommendations based on your skills and preferences.", color: "#7c3aed" },
    { icon: "⚡", title: "One-tap Apply", desc: "Apply in seconds with your saved profile — no re-filling forms.", color: "#2563eb" },
    { icon: "✅", title: "Verified Companies", desc: "Every employer is screened. Only quality opportunities reach you.", color: "#059669" },
    { icon: "📊", title: "Live Tracking", desc: "Know exactly where your application stands — in real time.", color: "#d97706" }
  ];
  const companies = ["Google", "Microsoft", "Amazon", "Atlassian", "Stripe", "Shopify", "Adobe", "Figma"];

  return (
    <main className="js-app">
      {/* Floating background orbs */}
      <div className="js-orb js-orb-1" aria-hidden />
      <div className="js-orb js-orb-2" aria-hidden />
      <div className="js-orb js-orb-3" aria-hidden />

      {/* Navbar */}
      <header className="js-nav">
        <div className="js-nav-inner">
          <a href="#home" className="js-brand">
            <span className="js-brand-job">Job</span><span className="js-brand-sphere">Sphere</span>
          </a>
          <div className="js-nav-right">
            <nav className="js-nav-links">
              <a href="#home">Home</a>
              <a href="#jobs">Jobs</a>
              <a href="#categories">Browse</a>
              <a href="#how">How it works</a>
            </nav>
            <div className="js-nav-actions">
              <button type="button" className="js-btn js-btn-ghost" onClick={() => openAuth("signin", "STUDENT")}>Sign In</button>
              <button type="button" className="js-btn js-btn-primary" onClick={() => openAuth("signup", "STUDENT")}>Get Started</button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="home" className="js-hero">
        <div className="js-hero-badge">
          <span className="js-badge-dot" />
          JobSphere Platform — Now Live
        </div>
        <h1 className="js-hero-title">
          <span className="js-hero-typed">{typedText}</span>
          <span className="js-cursor" aria-hidden>|</span>
        </h1>
        <p className="js-hero-sub">
          A smarter way to discover roles, apply instantly and hire top talent —<br />
          built for ambitious candidates and modern recruiters.
        </p>

        <div className="js-search-wrap">
          <form className="js-search" onSubmit={(e) => e.preventDefault()} role="search">
            <div className="js-search-field">
              <span className="js-search-icon">🔍</span>
              <input value={jobSearch} onChange={(e) => setJobSearch(e.target.value)} placeholder="Job title, skill or company" />
            </div>
            <div className="js-search-divider" aria-hidden />
            <div className="js-search-field">
              <span className="js-search-icon">📍</span>
              <input value={jobLocation} onChange={(e) => setJobLocation(e.target.value)} placeholder="City or Remote" />
            </div>
            <button type="submit" className="js-btn js-btn-primary js-search-btn">Search Jobs</button>
          </form>
        </div>

        <div className="js-tags-row">
          <span className="js-tags-label">Popular:</span>
          {popularTags.map((tag) => (
            <button key={tag} type="button" className="js-tag" onClick={() => setJobSearch(tag)}>{tag}</button>
          ))}
        </div>

        <div className="js-hero-cta-row">
          <button type="button" className="js-btn js-btn-primary js-btn-lg" onClick={() => openAuth("signin", "STUDENT")}>
            Find Jobs
          </button>
          <button type="button" className="js-btn js-btn-outline js-btn-lg" onClick={() => openAuth("signup", "RECRUITER")}>
            Post a Job
          </button>
        </div>
      </section>

      {/* Trusted by */}
      <section className="js-companies">
        <p className="js-companies-label">Trusted by teams at</p>
        <div className="js-companies-track">
          <div className="js-companies-scroll">
            {[...companies, ...companies].map((c, i) => (
              <span key={i} className="js-company-name">{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="js-stats">
        {stats.map((s) => (
          <div className="js-stat-card" key={s.label}>
            <strong className="js-stat-value">
              <AnimatedCounter target={s.value} suffix={s.suffix} />
            </strong>
            <span className="js-stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* Categories */}
      <section id="categories" className="js-section">
        <div className="js-section-head">
          <p className="js-eyebrow">Browse by category</p>
          <h2>Explore opportunities across industries</h2>
          <p className="js-section-sub">Pick your field and discover thousands of open roles waiting for you.</p>
        </div>
        <div className="js-cat-grid">
          {categories.map((cat) => (
            <button
              type="button"
              key={cat.name}
              className={`js-cat-card${activeCategory === cat.name ? " js-cat-card--active" : ""}`}
              onClick={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)}
            >
              <span className="js-cat-icon">{cat.icon}</span>
              <span className="js-cat-name">{cat.name}</span>
              <span className="js-cat-count">{cat.count} jobs</span>
              <span className="js-cat-arrow">→</span>
            </button>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="jobs" className="js-section js-features-section">
        <div className="js-section-head">
          <p className="js-eyebrow">Why JobSphere</p>
          <h2>Everything you need to succeed</h2>
          <p className="js-section-sub">From first search to final offer — we've got every step covered.</p>
        </div>
        <div className="js-feat-grid">
          {features.map((f) => (
            <article key={f.title} className="js-feat-card" style={{ "--feat-color": f.color }}>
              <span className="js-feat-icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <span className="js-feat-glow" aria-hidden />
            </article>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="js-section">
        <div className="js-section-head">
          <p className="js-eyebrow">How it works</p>
          <h2>Two journeys. One powerful platform.</h2>
        </div>
        <div className="js-how-grid">
          <div className="js-how-card js-how-card--candidate">
            <div className="js-how-badge">For Candidates</div>
            <ol className="js-how-steps">
              {["Create your profile", "Search & shortlist roles", "Apply in one tap", "Get hired faster"].map((step, i) => (
                <li key={step} className="js-how-step">
                  <span className="js-step-num">{i + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <button type="button" className="js-btn js-btn-primary" onClick={() => openAuth("signup", "STUDENT")}>
              Start Job Search →
            </button>
          </div>
          <div className="js-how-card js-how-card--recruiter">
            <div className="js-how-badge">For Recruiters</div>
            <ol className="js-how-steps">
              {["Post a job in minutes", "Review top candidates", "Schedule interviews", "Hire with confidence"].map((step, i) => (
                <li key={step} className="js-how-step">
                  <span className="js-step-num">{i + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <button type="button" className="js-btn js-btn-dark" onClick={() => openAuth("signup", "RECRUITER")}>
              Start Hiring →
            </button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="js-cta-band">
        <div className="js-cta-inner">
          <div className="js-cta-glow-1" aria-hidden />
          <div className="js-cta-glow-2" aria-hidden />
          <p className="js-eyebrow js-eyebrow-light">Get started today</p>
          <h2>Your next opportunity is one click away</h2>
          <p>Join thousands of candidates and companies already using JobSphere to make great matches.</p>
          <div className="js-cta-actions">
            <button type="button" className="js-btn js-btn-white" onClick={() => openAuth("signin", "STUDENT")}>Find Jobs</button>
            <button type="button" className="js-btn js-btn-outline-white" onClick={() => openAuth("signup", "RECRUITER")}>Post a Job</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="js-footer">
        <div className="js-footer-inner">
          <div className="js-footer-top">
            <div className="js-footer-brand">
              <span className="js-brand-job">Job</span><span className="js-brand-sphere">Sphere</span>
              <span className="js-footer-tagline">JobHunt</span>
            </div>
            <div className="js-footer-social">
              <span>Connect with us:</span>
              <a href="#" aria-label="LinkedIn">LinkedIn</a>
              <a href="#" aria-label="Instagram">Instagram</a>
              <a href="#" aria-label="Facebook">Facebook</a>
            </div>
          </div>
          <div className="js-footer-bottom">
            <span>Trademarks belong to their owners.</span>
            <span>All rights reserved 2026 JobsphereLtd.</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
