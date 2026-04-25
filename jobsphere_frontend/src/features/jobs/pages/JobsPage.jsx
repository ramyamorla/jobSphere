import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../../../config/apiConfig";
import {
  applyToJob,
  fetchRecruiterApplications,
  fetchStudentApplications,
  updateApplicationStatus
} from "../../applications/service/applicationService";
import {
  fetchRecruiterProfile,
  fetchStudentProfile,
  updateRecruiterProfile,
  updateStudentProfile,
  uploadStudentResume
} from "../../profile/api/profileApi";
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

function resolveApiPath(path) {
  if (!path) {
    return "";
  }
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const root = API_BASE_URL.replace(/\/api$/, "");
  return `${root}${path}`;
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
  const [applyingId, setApplyingId] = useState("");
  const [statusUpdatingId, setStatusUpdatingId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [filters, setFilters] = useState(emptyJobFilters);
  const [studentProfile, setStudentProfile] = useState({
    displayName: "",
    email: "",
    collegeName: "",
    bio: "",
    skills: "",
    resumeUrl: ""
  });
  const [recruiterProfile, setRecruiterProfile] = useState({
    displayName: "",
    email: "",
    companyName: ""
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [applications, setApplications] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
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

  useEffect(() => {
    if (activeView !== "profile" || !user?.profileId) {
      return;
    }
    const loadProfile = async () => {
      setProfileLoading(true);
      setError("");
      try {
        if (isRecruiter) {
          const profile = await fetchRecruiterProfile(user.profileId);
          setRecruiterProfile(profile);
        } else {
          const profile = await fetchStudentProfile(user.profileId);
          setStudentProfile({ ...profile, skills: (profile.skills || []).join(", ") });
        }
      } catch {
        setError("Unable to load profile.");
      } finally {
        setProfileLoading(false);
      }
    };
    loadProfile();
  }, [activeView, isRecruiter, user?.profileId]);

  useEffect(() => {
    if (activeView !== "my-applications" || isRecruiter || !user?.profileId) {
      return;
    }
    loadStudentApplications();
  }, [activeView, isRecruiter, user?.profileId]);

  useEffect(() => {
    if (activeView !== "applicants" || !isRecruiter || !user?.profileId) {
      return;
    }
    loadRecruiterApplicants();
  }, [activeView, isRecruiter, user?.profileId]);

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

  async function handleApplyToJob(jobId) {
    if (!user?.profileId) {
      return;
    }
    setApplyingId(jobId);
    setError("");
    setMessage("");
    try {
      await applyToJob({
        jobId,
        studentProfileId: user.profileId,
        coverLetter: ""
      });
      setMessage("Application submitted.");
      await loadJobs();
      await loadStudentApplications();
    } catch (err) {
      setError(err?.message || "Application failed.");
    } finally {
      setApplyingId("");
    }
  }

  async function loadStudentApplications() {
    if (!user?.profileId) {
      return;
    }
    setApplicationsLoading(true);
    try {
      const rows = await fetchStudentApplications(user.profileId);
      setApplications(rows);
    } catch {
      setError("Unable to load applications.");
    } finally {
      setApplicationsLoading(false);
    }
  }

  async function loadRecruiterApplicants() {
    if (!user?.profileId) {
      return;
    }
    setApplicationsLoading(true);
    try {
      const rows = await fetchRecruiterApplications(user.profileId);
      setApplicants(rows);
    } catch {
      setError("Unable to load applicants.");
    } finally {
      setApplicationsLoading(false);
    }
  }

  async function handleUpdateApplicationStatus(applicationId, status) {
    setStatusUpdatingId(applicationId);
    setError("");
    try {
      await updateApplicationStatus(applicationId, status);
      await loadRecruiterApplicants();
      setMessage("Applicant status updated.");
    } catch {
      setError("Unable to update status.");
    } finally {
      setStatusUpdatingId("");
    }
  }

  function handleStudentProfileField(event) {
    const { name, value } = event.target;
    setStudentProfile((prev) => ({ ...prev, [name]: value }));
  }

  function handleRecruiterProfileField(event) {
    const { name, value } = event.target;
    setRecruiterProfile((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSaveStudentProfile(event) {
    event.preventDefault();
    setProfileSaving(true);
    setError("");
    try {
      const payload = {
        ...studentProfile,
        skills: (studentProfile.skills || "")
          .toString()
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      };
      const updated = await updateStudentProfile(user.profileId, payload);
      setStudentProfile({ ...updated, skills: (updated.skills || []).join(", ") });
      setMessage("Profile updated.");
    } catch {
      setError("Unable to save student profile.");
    } finally {
      setProfileSaving(false);
    }
  }

  async function handleSaveRecruiterProfile(event) {
    event.preventDefault();
    setProfileSaving(true);
    setError("");
    try {
      const updated = await updateRecruiterProfile(user.profileId, recruiterProfile);
      setRecruiterProfile(updated);
      setMessage("Profile updated.");
    } catch {
      setError("Unable to save recruiter profile.");
    } finally {
      setProfileSaving(false);
    }
  }

  async function handleResumeFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setResumeUploading(true);
    setError("");
    try {
      const updated = await uploadStudentResume(user.profileId, file);
      setStudentProfile((prev) => ({ ...prev, resumeUrl: updated.resumeUrl }));
      setMessage("Resume uploaded.");
    } catch {
      setError("Resume upload failed.");
    } finally {
      setResumeUploading(false);
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
            showApply={!isRecruiter}
            onApply={handleApplyToJob}
            applyingId={applyingId}
          />
        </div>
      )}

      {activeView === "applicants" && (
        <section className="card view-full">
          <h2>Applicants</h2>
          {applicationsLoading && <p className="page-subtitle">Loading applicants...</p>}
          {!applicationsLoading && applicants.length === 0 && <p className="page-subtitle">No applicants yet.</p>}
          {!applicationsLoading && applicants.length > 0 && (
            <div className="table-wrap">
              <table className="jobs-table">
                <thead>
                  <tr>
                    <th>Job</th>
                    <th>Student Profile</th>
                    <th>Status</th>
                    <th>Resume</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applicants.map((row) => (
                    <tr key={row.id}>
                      <td>{row.jobTitle}</td>
                      <td>{row.studentProfileId}</td>
                      <td>{row.status}</td>
                      <td>{row.resumeUrl ? <a href={resolveApiPath(row.resumeUrl)}>View</a> : "—"}</td>
                      <td>
                        <button
                          type="button"
                          className="secondary-btn"
                          disabled={statusUpdatingId === row.id}
                          onClick={() => handleUpdateApplicationStatus(row.id, "SHORTLISTED")}
                        >
                          Shortlist
                        </button>
                        <button
                          type="button"
                          className="danger-btn danger-btn--table"
                          disabled={statusUpdatingId === row.id}
                          onClick={() => handleUpdateApplicationStatus(row.id, "REJECTED")}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {activeView === "my-applications" && (
        <section className="card view-full">
          <h2>My applications</h2>
          {applicationsLoading && <p className="page-subtitle">Loading applications...</p>}
          {!applicationsLoading && applications.length === 0 && (
            <p className="page-subtitle">No applications yet.</p>
          )}
          {!applicationsLoading && applications.length > 0 && (
            <div className="table-wrap">
              <table className="jobs-table">
                <thead>
                  <tr>
                    <th>Job</th>
                    <th>Company</th>
                    <th>Status</th>
                    <th>Applied</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((row) => (
                    <tr key={row.id}>
                      <td>{row.jobTitle}</td>
                      <td>{row.companyName}</td>
                      <td>{row.status}</td>
                      <td>{row.appliedAt ? new Date(row.appliedAt).toLocaleString() : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {activeView === "profile" && (
        <section className="card view-full">
          <h2>Profile</h2>
          {profileLoading && <p className="page-subtitle">Loading profile...</p>}
          {!profileLoading && !isRecruiter && (
            <form className="form-grid" onSubmit={handleSaveStudentProfile}>
              <label>
                Full name
                <input name="displayName" value={studentProfile.displayName || ""} onChange={handleStudentProfileField} />
              </label>
              <label>
                Email
                <input name="email" value={studentProfile.email || ""} onChange={handleStudentProfileField} />
              </label>
              <label>
                College
                <input name="collegeName" value={studentProfile.collegeName || ""} onChange={handleStudentProfileField} />
              </label>
              <label>
                Skills (comma separated)
                <input
                  name="skills"
                  value={studentProfile.skills || ""}
                  onChange={handleStudentProfileField}
                />
              </label>
              <label>
                Bio
                <input name="bio" value={studentProfile.bio || ""} onChange={handleStudentProfileField} />
              </label>
              <label>
                Resume
                <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeFileChange} disabled={resumeUploading} />
              </label>
              {studentProfile.resumeUrl && (
                <p>
                  <a href={resolveApiPath(studentProfile.resumeUrl)} target="_blank" rel="noreferrer">
                    View uploaded resume
                  </a>
                </p>
              )}
              <button type="submit" disabled={profileSaving || resumeUploading}>
                {profileSaving ? "Saving..." : "Save Profile"}
              </button>
            </form>
          )}
          {!profileLoading && isRecruiter && (
            <form className="form-grid" onSubmit={handleSaveRecruiterProfile}>
              <label>
                Full name
                <input
                  name="displayName"
                  value={recruiterProfile.displayName || ""}
                  onChange={handleRecruiterProfileField}
                />
              </label>
              <label>
                Email
                <input name="email" value={recruiterProfile.email || ""} onChange={handleRecruiterProfileField} />
              </label>
              <label>
                Company name
                <input
                  name="companyName"
                  value={recruiterProfile.companyName || ""}
                  onChange={handleRecruiterProfileField}
                />
              </label>
              <button type="submit" disabled={profileSaving}>
                {profileSaving ? "Saving..." : "Save Profile"}
              </button>
            </form>
          )}
        </section>
      )}
    </main>
  );
}
