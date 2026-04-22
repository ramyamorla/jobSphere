const studentFeatures = [
  "Browse/search job listings with filters",
  "Apply to jobs (one-click flow)",
  "Track application status in dashboard",
  "Update profile (bio, skills, etc.)"
];

const recruiterFeatures = [
  "Register/manage companies",
  "Post new jobs",
  "View/manage applicants for each job",
  "Accept/reject applications",
  "Delete job postings"
];

function FeatureList({ title, items }) {
  return (
    <section className="card">
      <h2>{title}</h2>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

export default function App() {
  return (
    <main className="container">
      <h1>jobSphere</h1>
      <p className="subtitle">Starter UI for your student and recruiter workflows.</p>
      <div className="grid">
        <FeatureList title="Student Features" items={studentFeatures} />
        <FeatureList title="Recruiter Features" items={recruiterFeatures} />
      </div>
      <p className="note">
        Note: Web scraping integration is intentionally not implemented in this phase.
      </p>
    </main>
  );
}
