const menuByRole = {
  RECRUITER: [
    { key: "dashboard", label: "Home", icon: "⬡" },
    { key: "post-job", label: "Post Job", icon: "+" },
    { key: "my-jobs", label: "My Jobs", icon: "📋" },
    { key: "browse-jobs", label: "Browse", icon: "🔍" },
    { key: "applicants", label: "Applicants", icon: "👥" },
    { key: "profile", label: "Profile", icon: "👤" }
  ],
  STUDENT: [
    { key: "dashboard", label: "Home", icon: "⬡" },
    { key: "browse-jobs", label: "Find Jobs", icon: "🔍" },
    { key: "my-applications", label: "Applications", icon: "📋" },
    { key: "profile", label: "Profile", icon: "👤" }
  ]
};

export default function AppNavigation({ user, activeView, onChangeView, onSignOut }) {
  const menu = menuByRole[user?.role] || menuByRole.STUDENT;
  const initials = (user?.fullName || user?.username || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="portal-nav">
      <div className="portal-nav-inner">
        <button type="button" className="portal-nav-brand" onClick={() => onChangeView("dashboard")}>
          <span className="pn-job">Job</span>
          <span className="pn-sphere">Sphere</span>
        </button>

        <nav className="portal-nav-links" aria-label="App navigation">
          {menu.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`portal-nav-link${activeView === item.key ? " portal-nav-link--active" : ""}`}
              onClick={() => onChangeView(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="portal-nav-user">
          <div className="portal-nav-avatar" title={user?.fullName || user?.username}>
            {initials}
          </div>
          <div className="portal-nav-info">
            <span className="portal-nav-name">{user?.fullName || user?.username}</span>
            <span className="portal-nav-role">{user?.role === "RECRUITER" ? "Recruiter" : "Job Seeker"}</span>
          </div>
          <button type="button" className="portal-nav-signout" onClick={onSignOut}>
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
