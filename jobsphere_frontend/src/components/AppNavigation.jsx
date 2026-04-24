const menuByRole = {
  RECRUITER: [
    { key: "dashboard", label: "Dashboard" },
    { key: "post-job", label: "Post Job" },
    { key: "my-jobs", label: "My Jobs" },
    { key: "applicants", label: "Applicants" }
  ],
  STUDENT: [
    { key: "dashboard", label: "Dashboard" },
    { key: "browse-jobs", label: "Browse Jobs" },
    { key: "my-applications", label: "My Applications" },
    { key: "profile", label: "Profile" }
  ]
};

export default function AppNavigation({ user, activeView, onChangeView }) {
  const menuItems = menuByRole[user?.role] || [{ key: "dashboard", label: "Dashboard" }];

  return (
    <aside className="app-sidebar">
      <div className="sidebar-title">Menu</div>
      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`sidebar-item ${activeView === item.key ? "active" : ""}`}
            onClick={() => onChangeView(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <p>{user?.fullName || user?.username}</p>
        <span>{user?.role}</span>
      </div>
    </aside>
  );
}
