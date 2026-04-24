import { useEffect, useState } from "react";
import BrandHeader from "./components/BrandHeader";
import LandingPage from "./features/auth/pages/LandingPage";
import JobsPage from "./features/jobs/pages/JobsPage";

export default function App() {
  const [sessionUser, setSessionUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("jobsphere_session_user");
    if (stored) {
      setSessionUser(JSON.parse(stored));
    }
  }, []);

  function handleAuthSuccess(user) {
    setSessionUser(user);
    localStorage.setItem("jobsphere_session_user", JSON.stringify(user));
  }

  function handleSignOut() {
    setSessionUser(null);
    localStorage.removeItem("jobsphere_session_user");
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
      <div className="app-page">
        <JobsPage user={sessionUser} onSignOut={handleSignOut} />
      </div>
    </div>
  );
}
