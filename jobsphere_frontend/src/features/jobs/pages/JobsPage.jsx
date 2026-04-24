import { useEffect, useState } from "react";
import JobForm from "../components/JobForm";
import JobList from "../components/JobList";
import { emptyCreateJobRequest } from "../dto/jobDto";
import { createJob, fetchJobs, removeJob } from "../service/jobService";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState(emptyCreateJobRequest);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
      await createJob(formData);
      setMessage("Job created successfully.");
      setFormData(emptyCreateJobRequest);
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
      <h1>jobSphere - Jobs Module</h1>
      <p className="subtitle">Chunk 3: Frontend + Backend full flow for job creation and listing.</p>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      <div className="grid">
        <JobForm
          formData={formData}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          loading={loading}
        />
        <JobList
          jobs={jobs}
          loading={loading}
          onDelete={handleDelete}
          deletingId={deletingId}
        />
      </div>
    </main>
  );
}
