import { useEffect, useState } from "react";
import AppNavigation from "./components/AppNavigation";
import BrandHeader from "./components/BrandHeader";
import LandingPage from "./features/auth/pages/LandingPage";
import JobsPage from "./features/jobs/pages/JobsPage";
import { fetchRecruiterProfileById } from "./features/profile/api/recruiterApi";

export default function App() {
  const [sessionUser, setSessionUser] = useState(null);
  const [activeView, setActiveView] = useState("dashboard");

  useEffect(() => {
    const stored = localStorage.getItem("jobsphere_session_user");
    if (stored) {
      setSessionUser(JSON.parse(stored));
    }
  }, []);

  /** Enrich session with company from DB (e.g. older localStorage without companyName). */
  useEffect(() => {
    if (sessionUser?.role !== "RECRUITER" || !sessionUser?.profileId) {
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const profile = await fetchRecruiterProfileById(sessionUser.profileId);
        if (cancelled) {
          return;
        }
        setSessionUser((prev) => {
          if (!prev || prev.profileId !== sessionUser.profileId) {
            return prev;
          }
          const next = { ...prev, companyName: profile.companyName ?? "" };
          localStorage.setItem("jobsphere_session_user", JSON.stringify(next));
          return next;
        });
      } catch {
        /* keep session; backend may be down */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sessionUser?.role, sessionUser?.profileId]);

  function handleAuthSuccess(user) {
    setSessionUser(user);
    localStorage.setItem("jobsphere_session_user", JSON.stringify(user));
    setActiveView("dashboard");
  }

  function handleSignOut() {
    setSessionUser(null);
    localStorage.removeItem("jobsphere_session_user");
    setActiveView("dashboard");
  }

  if (!sessionUser) {
    return <LandingPage onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="app-shell">
      <BrandHeader
        fixed
        centered={false}
        side="right"
        title="jobSphere"
        caption="Smart hiring and career hub"
      />
      <div className="app-page app-grid-layout">
        <AppNavigation user={sessionUser} activeView={activeView} onChangeView={setActiveView} />
        <section className="app-content-scroll">
          <JobsPage user={sessionUser} onSignOut={handleSignOut} activeView={activeView} />
        </section>
      </div>
    </div>
  );
}
