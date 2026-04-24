import { useEffect, useState } from "react";
import JobForm from "../components/JobForm";
import JobList from "../components/JobList";
import { emptyCreateJobRequest } from "../dto/jobDto";
import { createJob, fetchJobs, removeJob } from "../service/jobService";

export default function JobsPage({ user, onSignOut }) {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    ...emptyCreateJobRequest,
    postedByRecruiterId: user?.profileId || ""
  });
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const isRecruiter = user?.role === "RECRUITER";

  async function loadJobs() {
    setLoading(true);
    setError("");
    try {
      const data = await fetchJobs();
      setJobs(data);
    } catch (err) {
      setError("Unable to load jobs. Check backend server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      await createJob({
        ...formData,
        postedByRecruiterId: user?.profileId || formData.postedByRecruiterId
      });
      setMessage("Job created successfully.");
      setFormData({
        ...emptyCreateJobRequest,
        postedByRecruiterId: user?.profileId || ""
      });
      await loadJobs();
    } catch (err) {
      setError("Job creation failed. Verify backend and request fields.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(jobId) {
    setError("");
    setMessage("");
    setDeletingId(jobId);
    try {
      await removeJob(jobId);
      setMessage("Job deleted successfully.");
      await loadJobs();
    } catch (err) {
      setError("Job deletion failed. Try again.");
    } finally {
      setDeletingId("");
    }
  }

  return (
    <main className="container">
      <div className="jobs-header">
        <div>
          <h2>Jobs Module</h2>
          <p className="subtitle">
            Signed in as <strong>{user?.username}</strong> ({user?.role})
          </p>
        </div>
        <button type="button" className="secondary-btn" onClick={onSignOut}>
          Sign Out
        </button>
      </div>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      <div className="grid">
        {isRecruiter ? (
          <JobForm
            formData={formData}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            loading={loading}
            recruiterProfileId={user?.profileId}
          />
        ) : (
          <section className="card info-card">
            <h2>Student Mode</h2>
            <p className="subtitle">You can browse jobs. Posting and deleting are recruiter-only actions.</p>
          </section>
        )}
        <JobList
          jobs={jobs}
          loading={loading}
          onDelete={handleDelete}
          deletingId={deletingId}
          canDelete={isRecruiter}
        />
      </div>
    </main>
  );
}
