import { useEffect, useMemo, useState } from "react";
import JobForm from "../components/JobForm";
import JobGridPanel from "../components/JobGridPanel";
import { fetchRecruiterProfileById } from "../../profile/api/recruiterApi";
import { emptyCreateJobRequest, emptyJobFilters } from "../dto/jobDto";
import { createJob, fetchJobs, removeJob } from "../service/jobService";

function viewTitle(activeView) {
  const map = {
    dashboard: "Dashboard",
    "post-job": "Post a job",
    "my-jobs": "My job postings",
    "browse-jobs": "Browse jobs",
    "my-applications": "My applications",
    profile: "Profile",
    applicants: "Applicants"
  };
  return map[activeView] || "jobSphere";
}

export default function JobsPage({ user, onSignOut, activeView }) {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    ...emptyCreateJobRequest,
    postedByRecruiterId: user?.profileId || "",
    companyName: user?.companyName || ""
  });
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [filters, setFilters] = useState(emptyJobFilters);
  const isRecruiter = user?.role === "RECRUITER";

  const myPostedJobs = useMemo(
    () => jobs.filter((j) => j.postedByRecruiterId === user?.profileId),
    [jobs, user?.profileId]
  );

  const openPositionsTotal = useMemo(
    () => jobs.reduce((sum, j) => sum + (j.openPositions || 0), 0),
    [jobs]
  );

  async function loadJobs(overrideFilters) {
    const f = overrideFilters !== undefined ? overrideFilters : filters;
    setLoading(true);
    setError("");
    try {
      const data = await fetchJobs(f);
      setJobs(data);
    } catch (err) {
      setError("Unable to load jobs. Check the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobs(emptyJobFilters);
  }, []);

  /**
   * Pre-fill company from the recruiter document (source of truth), not only session JSON.
   * Session from localStorage may omit companyName; the GET always matches Mongo.
   */
  useEffect(() => {
    if (activeView !== "post-job" || !isRecruiter || !user?.profileId) {
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const profile = await fetchRecruiterProfileById(user.profileId);
        if (cancelled) {
          return;
        }
        setFormData((prev) => {
          const fromProfile = (profile?.companyName ?? "").trim();
          const fromUser = (user?.companyName ?? "").trim();
          const keepTyped = (prev.companyName ?? "").trim().length > 0;
          return {
            ...prev,
            companyName: keepTyped ? prev.companyName : fromProfile || fromUser || prev.companyName,
            postedByRecruiterId: user.profileId
          };
        });
      } catch {
        if (cancelled) {
          return;
        }
        setFormData((prev) => {
          const fromUser = (user?.companyName ?? "").trim();
          const keepTyped = (prev.companyName ?? "").trim().length > 0;
          return {
            ...prev,
            companyName: keepTyped ? prev.companyName : fromUser || prev.companyName,
            postedByRecruiterId: user.profileId || prev.postedByRecruiterId
          };
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeView, isRecruiter, user?.profileId]);

  /** If company is still empty, apply session (e.g. after App enriches localStorage) without re-calling the API. */
  useEffect(() => {
    if (activeView !== "post-job" || !isRecruiter) {
      return;
    }
    const fromSession = (user?.companyName ?? "").trim();
    if (!fromSession) {
      return;
    }
    setFormData((prev) => {
      if ((prev.companyName ?? "").trim()) {
        return prev;
      }
      return { ...prev, companyName: fromSession, postedByRecruiterId: user?.profileId || prev.postedByRecruiterId };
    });
  }, [activeView, isRecruiter, user?.companyName, user?.profileId]);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleFilterChange(event) {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  async function handleApplyFilters() {
    await loadJobs(filters);
  }

  async function handleResetFilters() {
    setFilters(emptyJobFilters);
    await loadJobs(emptyJobFilters);
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
      setMessage("Job posted successfully.");
      setFormData({
        ...emptyCreateJobRequest,
        postedByRecruiterId: user?.profileId || "",
        companyName: user?.companyName || ""
      });
      await loadJobs();
    } catch (err) {
      setError("Post failed. Check all fields and try again.");
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
      setMessage("Job removed.");
      await loadJobs();
    } catch (err) {
      setError("Delete failed.");
    } finally {
      setDeletingId("");
    }
  }

  const showMetrics = activeView === "dashboard";
  const listForRecruiterMyJobs = myPostedJobs;

  return (
    <main className="page-main">
      <div className="page-toolbar">
        <div>
          <h1 className="page-title">{viewTitle(activeView)}</h1>
          <p className="page-subtitle">
            {user?.fullName || user?.username} · {user?.role}
          </p>
        </div>
        {showMetrics && (
          <div className="header-metrics page-toolbar-metrics">
            <div className="metric-card">
              <span>Listings (current search)</span>
              <strong>{jobs.length}</strong>
            </div>
            <div className="metric-card">
              <span>Open positions</span>
              <strong>{openPositionsTotal}</strong>
            </div>
            {isRecruiter && (
              <div className="metric-card">
                <span>Your postings</span>
                <strong>{listForRecruiterMyJobs.length}</strong>
              </div>
            )}
          </div>
        )}
        <button type="button" className="secondary-btn" onClick={onSignOut}>
          Sign out
        </button>
      </div>

      {message && <p className="flash flash--ok">{message}</p>}
      {error && <p className="flash flash--err">{error}</p>}

      {activeView === "dashboard" && (
        <section className="card dashboard-card">
          <h2>Overview</h2>
          <p className="dashboard-lead">
            {isRecruiter
              ? "Choose an item in the left menu. Each screen uses the full work area: one task per view."
              : "Open Browse Jobs to search every listing in a single table with built-in filters."}
          </p>
          <ul className="dashboard-checklist">
            {isRecruiter ? (
              <>
                <li>
                  <strong>Post Job</strong> — full-width posting form
                </li>
                <li>
                  <strong>My Jobs</strong> — your rows only, filters + table together
                </li>
                <li>
                  <strong>Browse Jobs</strong> — full market, read-only
                </li>
              </>
            ) : (
              <>
                <li>
                  <strong>Browse Jobs</strong> — search, location, type, mode, and minimum salary in the bar above
                  the grid
                </li>
                <li>
                  <strong>My Applications &amp; Profile</strong> — coming next
                </li>
              </>
            )}
          </ul>
        </section>
      )}

      {activeView === "post-job" && isRecruiter && (
        <div className="view-full">
          <JobForm
            formData={formData}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            loading={loading}
            recruiterProfileId={user?.profileId}
          />
        </div>
      )}

      {activeView === "my-jobs" && isRecruiter && (
        <div className="view-full">
          <JobGridPanel
            title="Your job postings"
            jobs={listForRecruiterMyJobs}
            loading={loading}
            filters={filters}
            onFilterChange={handleFilterChange}
            onApplyFilters={handleApplyFilters}
            onResetFilters={handleResetFilters}
            onDelete={handleDelete}
            deletingId={deletingId}
            canDelete
          />
        </div>
      )}

      {activeView === "browse-jobs" && (
        <div className="view-full">
          {isRecruiter && (
            <p className="view-hint">
              All open roles. For edit/delete, open <strong>My Jobs</strong>.
            </p>
          )}
          <JobGridPanel
            title={isRecruiter ? "All open roles" : "Open roles"}
            jobs={jobs}
            loading={loading}
            filters={filters}
            onFilterChange={handleFilterChange}
            onApplyFilters={handleApplyFilters}
            onResetFilters={handleResetFilters}
            onDelete={handleDelete}
            deletingId={deletingId}
            canDelete={false}
          />
        </div>
      )}

      {activeView === "applicants" && (
        <section className="card view-full">
          <h2>Applicants</h2>
          <p className="page-subtitle">Pipeline view will land here in the next release.</p>
        </section>
      )}

      {activeView === "my-applications" && (
        <section className="card view-full">
          <h2>My applications</h2>
          <p className="page-subtitle">Application status will appear here next.</p>
        </section>
      )}

      {activeView === "profile" && (
        <section className="card view-full">
          <h2>Profile</h2>
          <p className="page-subtitle">Profile and resume management coming next.</p>
        </section>
      )}
    </main>
  );
}
