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

function resolveApiPath(path) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const root = API_BASE_URL.replace(/\/api$/, "");
  return `${root}${path}`;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const STATUS_META = {
  APPLIED:     { label: "Applied",     color: "#2563eb" },
  SHORTLISTED: { label: "Shortlisted", color: "#10b981" },
  REJECTED:    { label: "Rejected",    color: "#ef4444" },
  PENDING:     { label: "Pending",     color: "#f59e0b" }
};

/* ── Tiny inline SVG icons (no emojis) ── */
function Icon({ name }) {
  const icons = {
    post:    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10 4v12M4 10h12" strokeLinecap="round"/></svg>,
    jobs:    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="6" width="14" height="11" rx="2"/><path d="M7 6V5a3 3 0 016 0v1" strokeLinecap="round"/></svg>,
    people:  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="8" cy="7" r="3"/><path d="M2 17c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="15" cy="7" r="2.5"/><path d="M18 17c0-2.7-1.8-4.9-4-5.5" strokeLinecap="round"/></svg>,
    browse:  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="9" cy="9" r="5"/><path d="M16 16l-3-3" strokeLinecap="round"/></svg>,
    company: <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="8" width="16" height="10" rx="1"/><path d="M6 8V5a4 4 0 018 0v3"/><path d="M10 12v3" strokeLinecap="round"/></svg>,
    chart:   <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 14l4-4 3 3 5-6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    user:    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="10" cy="7" r="4"/><path d="M2 18c0-4.4 3.6-8 8-8s8 3.6 8 8" strokeLinecap="round"/></svg>,
    resume:  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="2" width="12" height="16" rx="2"/><path d="M7 7h6M7 10h6M7 13h4" strokeLinecap="round"/></svg>,
    upload:  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10 13V4m0 0L7 7m3-3l3 3" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 17h14" strokeLinecap="round"/></svg>,
    school:  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10 2l8 4-8 4-8-4 8-4z"/><path d="M4 10v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" strokeLinecap="round"/></svg>,
    tip:     <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="10" cy="10" r="7"/><path d="M10 6v4l2 2" strokeLinecap="round"/></svg>,
    inbox:   <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="5" width="16" height="12" rx="2"/><path d="M2 9h16M6 5V3m8 2V3" strokeLinecap="round"/></svg>,
  };
  return (
    <span className="pj-svg-icon">{icons[name] || icons.jobs}</span>
  );
}

export default function JobsPage({ user, activeView, onChangeView }) {
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
    displayName: "", email: "", collegeName: "", bio: "", skills: "", resumeUrl: ""
  });
  const [recruiterProfile, setRecruiterProfile] = useState({
    displayName: "", email: "", companyName: ""
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
    setLoading(true); setError("");
    try { const data = await fetchJobs(f); setJobs(data); }
    catch { setError("Unable to load jobs. Check the backend is running."); }
    finally { setLoading(false); }
  }

  useEffect(() => { loadJobs(emptyJobFilters); }, []);

  useEffect(() => {
    if (activeView !== "post-job" || !isRecruiter || !user?.profileId) return;
    let cancelled = false;
    (async () => {
      try {
        const profile = await fetchRecruiterProfileById(user.profileId);
        if (cancelled) return;
        setFormData((prev) => {
          const fromProfile = (profile?.companyName ?? "").trim();
          const fromUser = (user?.companyName ?? "").trim();
          const keepTyped = (prev.companyName ?? "").trim().length > 0;
          return { ...prev, companyName: keepTyped ? prev.companyName : fromProfile || fromUser || prev.companyName, postedByRecruiterId: user.profileId };
        });
      } catch {
        if (cancelled) return;
        setFormData((prev) => {
          const fromUser = (user?.companyName ?? "").trim();
          const keepTyped = (prev.companyName ?? "").trim().length > 0;
          return { ...prev, companyName: keepTyped ? prev.companyName : fromUser || prev.companyName, postedByRecruiterId: user.profileId || prev.postedByRecruiterId };
        });
      }
    })();
    return () => { cancelled = true; };
  }, [activeView, isRecruiter, user?.profileId]);

  useEffect(() => {
    if (activeView !== "post-job" || !isRecruiter) return;
    const fromSession = (user?.companyName ?? "").trim();
    if (!fromSession) return;
    setFormData((prev) => {
      if ((prev.companyName ?? "").trim()) return prev;
      return { ...prev, companyName: fromSession, postedByRecruiterId: user?.profileId || prev.postedByRecruiterId };
    });
  }, [activeView, isRecruiter, user?.companyName, user?.profileId]);

  useEffect(() => {
    if (activeView !== "profile" || !user?.profileId) return;
    const load = async () => {
      setProfileLoading(true); setError("");
      try {
        if (isRecruiter) {
          const profile = await fetchRecruiterProfile(user.profileId);
          setRecruiterProfile(profile);
        } else {
          const profile = await fetchStudentProfile(user.profileId);
          setStudentProfile({ ...profile, skills: (profile.skills || []).join(", ") });
        }
      } catch { setError("Unable to load profile."); }
      finally { setProfileLoading(false); }
    };
    load();
  }, [activeView, isRecruiter, user?.profileId]);

  useEffect(() => {
    if (activeView !== "my-applications" || isRecruiter || !user?.profileId) return;
    loadStudentApplications();
  }, [activeView, isRecruiter, user?.profileId]);

  useEffect(() => {
    if (activeView !== "applicants" || !isRecruiter || !user?.profileId) return;
    loadRecruiterApplicants();
  }, [activeView, isRecruiter, user?.profileId]);

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }
  function handleFilterChange(e) {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }
  async function handleApplyFilters() { await loadJobs(filters); }
  async function handleResetFilters() { setFilters(emptyJobFilters); await loadJobs(emptyJobFilters); }

  async function handleSubmit(e) {
    e.preventDefault(); setLoading(true); setMessage(""); setError("");
    try {
      await createJob({ ...formData, postedByRecruiterId: user?.profileId || formData.postedByRecruiterId });
      setMessage("Job posted successfully!");
      setFormData({ ...emptyCreateJobRequest, postedByRecruiterId: user?.profileId || "", companyName: user?.companyName || "" });
      await loadJobs();
    } catch { setError("Post failed. Check all fields and try again."); }
    finally { setLoading(false); }
  }

  async function handleDelete(jobId) {
    setError(""); setMessage(""); setDeletingId(jobId);
    try { await removeJob(jobId); setMessage("Job removed."); await loadJobs(); }
    catch { setError("Delete failed."); }
    finally { setDeletingId(""); }
  }

  async function handleApplyToJob(jobId) {
    if (!user?.profileId) return;
    setApplyingId(jobId); setError(""); setMessage("");
    try {
      await applyToJob({ jobId, studentProfileId: user.profileId, coverLetter: "" });
      setMessage("Application submitted!");
      await loadJobs();
      await loadStudentApplications();
    } catch (err) { setError(err?.message || "Application failed."); }
    finally { setApplyingId(""); }
  }

  async function loadStudentApplications() {
    if (!user?.profileId) return;
    setApplicationsLoading(true);
    try { const rows = await fetchStudentApplications(user.profileId); setApplications(rows); }
    catch { setError("Unable to load applications."); }
    finally { setApplicationsLoading(false); }
  }

  async function loadRecruiterApplicants() {
    if (!user?.profileId) return;
    setApplicationsLoading(true);
    try { const rows = await fetchRecruiterApplications(user.profileId); setApplicants(rows); }
    catch { setError("Unable to load applicants."); }
    finally { setApplicationsLoading(false); }
  }

  async function handleUpdateApplicationStatus(applicationId, status) {
    setStatusUpdatingId(applicationId); setError("");
    try { await updateApplicationStatus(applicationId, status); await loadRecruiterApplicants(); setMessage("Status updated."); }
    catch { setError("Unable to update status."); }
    finally { setStatusUpdatingId(""); }
  }

  function handleStudentProfileField(e) {
    const { name, value } = e.target;
    setStudentProfile((prev) => ({ ...prev, [name]: value }));
  }
  function handleRecruiterProfileField(e) {
    const { name, value } = e.target;
    setRecruiterProfile((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSaveStudentProfile(e) {
    e.preventDefault(); setProfileSaving(true); setError("");
    try {
      const payload = { ...studentProfile, skills: (studentProfile.skills || "").toString().split(",").map((s) => s.trim()).filter(Boolean) };
      const updated = await updateStudentProfile(user.profileId, payload);
      setStudentProfile({ ...updated, skills: (updated.skills || []).join(", ") });
      setMessage("Profile updated!");
    } catch { setError("Unable to save profile."); }
    finally { setProfileSaving(false); }
  }

  async function handleSaveRecruiterProfile(e) {
    e.preventDefault(); setProfileSaving(true); setError("");
    try {
      const updated = await updateRecruiterProfile(user.profileId, recruiterProfile);
      setRecruiterProfile(updated);
      setMessage("Profile updated!");
    } catch { setError("Unable to save profile."); }
    finally { setProfileSaving(false); }
  }

  async function handleResumeFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setResumeUploading(true); setError("");
    try {
      const updated = await uploadStudentResume(user.profileId, file);
      setStudentProfile((prev) => ({ ...prev, resumeUrl: updated.resumeUrl }));
      setMessage("Resume uploaded!");
    } catch { setError("Resume upload failed."); }
    finally { setResumeUploading(false); }
  }

  const firstName = (user?.fullName || user?.username || "").split(" ")[0];

  return (
    <div className="pj-wrap">
      {message && (
        <div className="pj-toast pj-toast--ok" onClick={() => setMessage("")}>
          <span>&#10003;</span> {message}
        </div>
      )}
      {error && (
        <div className="pj-toast pj-toast--err" onClick={() => setError("")}>
          <span>&#10005;</span> {error}
        </div>
      )}

      {/* ── DASHBOARD ── */}
      {activeView === "dashboard" && (
        <div className="pj-dashboard">
          <div className="pj-dash-hero">
            <div className="pj-dash-hero-bg" />
            <div className="pj-dash-hero-content">
              <p className="pj-dash-greeting">{getGreeting()},</p>
              <h1 className="pj-dash-name">{firstName}</h1>
              <p className="pj-dash-sub">
                {isRecruiter
                  ? "Manage your postings, review applicants, and build your team."
                  : "Discover opportunities that match your skills and aspirations."}
              </p>
            </div>
            <div className="pj-dash-stats">
              <div className="pj-dash-stat">
                <span className="pj-dash-stat-num">{jobs.length}</span>
                <span className="pj-dash-stat-lbl">Live Listings</span>
              </div>
              <div className="pj-dash-stat">
                <span className="pj-dash-stat-num">{openPositionsTotal}</span>
                <span className="pj-dash-stat-lbl">Open Positions</span>
              </div>
              {isRecruiter && (
                <div className="pj-dash-stat">
                  <span className="pj-dash-stat-num">{myPostedJobs.length}</span>
                  <span className="pj-dash-stat-lbl">Your Postings</span>
                </div>
              )}
              {!isRecruiter && (
                <div className="pj-dash-stat">
                  <span className="pj-dash-stat-num">{applications.length}</span>
                  <span className="pj-dash-stat-lbl">Applications</span>
                </div>
              )}
            </div>
          </div>

          <div className="pj-dash-actions-grid">
            {isRecruiter ? (
              <>
                <button className="pj-action-card" onClick={() => onChangeView("post-job")}>
                  <div className="pj-ac-icon"><Icon name="post" /></div>
                  <div className="pj-ac-body">
                    <strong>Post a New Job</strong>
                    <p>Create a listing and start receiving qualified applicants</p>
                  </div>
                  <span className="pj-ac-arrow">&#8594;</span>
                </button>
                <button className="pj-action-card" onClick={() => onChangeView("my-jobs")}>
                  <div className="pj-ac-icon"><Icon name="jobs" /></div>
                  <div className="pj-ac-body">
                    <strong>Manage My Jobs</strong>
                    <p>Edit, delete, and track your active listings</p>
                  </div>
                  <span className="pj-ac-arrow">&#8594;</span>
                </button>
                <button className="pj-action-card" onClick={() => onChangeView("applicants")}>
                  <div className="pj-ac-icon"><Icon name="people" /></div>
                  <div className="pj-ac-body">
                    <strong>Review Applicants</strong>
                    <p>Shortlist or reject candidates across all your postings</p>
                  </div>
                  <span className="pj-ac-arrow">&#8594;</span>
                </button>
                <button className="pj-action-card" onClick={() => onChangeView("browse-jobs")}>
                  <div className="pj-ac-icon"><Icon name="browse" /></div>
                  <div className="pj-ac-body">
                    <strong>Browse Market</strong>
                    <p>See all open roles across the platform</p>
                  </div>
                  <span className="pj-ac-arrow">&#8594;</span>
                </button>
                <button className="pj-action-card" onClick={() => onChangeView("profile")}>
                  <div className="pj-ac-icon"><Icon name="company" /></div>
                  <div className="pj-ac-body">
                    <strong>Company Profile</strong>
                    <p>Update your company information and branding</p>
                  </div>
                  <span className="pj-ac-arrow">&#8594;</span>
                </button>
              </>
            ) : (
              <>
                <button className="pj-action-card" onClick={() => onChangeView("browse-jobs")}>
                  <div className="pj-ac-icon"><Icon name="browse" /></div>
                  <div className="pj-ac-body">
                    <strong>Find Opportunities</strong>
                    <p>Search roles filtered by title, location, and salary</p>
                  </div>
                  <span className="pj-ac-arrow">&#8594;</span>
                </button>
                <button className="pj-action-card" onClick={() => onChangeView("my-applications")}>
                  <div className="pj-ac-icon"><Icon name="chart" /></div>
                  <div className="pj-ac-body">
                    <strong>Track Applications</strong>
                    <p>Monitor your application statuses in real time</p>
                  </div>
                  <span className="pj-ac-arrow">&#8594;</span>
                </button>
                <button className="pj-action-card" onClick={() => onChangeView("profile")}>
                  <div className="pj-ac-icon"><Icon name="user" /></div>
                  <div className="pj-ac-body">
                    <strong>Update Profile</strong>
                    <p>Add skills, bio, and resume to stand out to recruiters</p>
                  </div>
                  <span className="pj-ac-arrow">&#8594;</span>
                </button>
              </>
            )}
          </div>

          <div className="pj-dash-tips">
            {isRecruiter ? (
              <>
                <div className="pj-tip-card">
                  <span className="pj-tip-icon"><Icon name="tip" /></span>
                  <div>
                    <strong>Pro tip</strong>
                    <p>Listings with a detailed description get 3× more applications.</p>
                  </div>
                </div>
                <div className="pj-tip-card">
                  <span className="pj-tip-icon"><Icon name="tip" /></span>
                  <div>
                    <strong>Fast hiring</strong>
                    <p>Respond to applicants within 48 hours to boost your acceptance rate.</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="pj-tip-card">
                  <span className="pj-tip-icon"><Icon name="tip" /></span>
                  <div>
                    <strong>Stand out</strong>
                    <p>Profiles with a resume uploaded get 5× more recruiter views.</p>
                  </div>
                </div>
                <div className="pj-tip-card">
                  <span className="pj-tip-icon"><Icon name="tip" /></span>
                  <div>
                    <strong>Stay active</strong>
                    <p>New jobs are posted daily — check Browse Jobs regularly.</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── POST JOB ── */}
      {activeView === "post-job" && isRecruiter && (
        <div className="pj-view-page">
          <div className="pj-view-head">
            <div>
              <h2 className="pj-view-title">Post a New Job</h2>
              <p className="pj-view-sub">Fill in the details below to start receiving applications</p>
            </div>
          </div>
          <JobForm
            formData={formData}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            loading={loading}
            recruiterProfileId={user?.profileId}
          />
        </div>
      )}

      {/* ── MY JOBS ── */}
      {activeView === "my-jobs" && isRecruiter && (
        <div className="pj-view-page">
          <div className="pj-view-head">
            <div>
              <h2 className="pj-view-title">My Job Postings</h2>
              <p className="pj-view-sub">{myPostedJobs.length} listing{myPostedJobs.length !== 1 ? "s" : ""} from your account</p>
            </div>
          </div>
          <JobGridPanel
            title=""
            jobs={myPostedJobs}
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

      {/* ── BROWSE JOBS ── */}
      {activeView === "browse-jobs" && (
        <div className="pj-view-page">
          <div className="pj-view-head">
            <div>
              <h2 className="pj-view-title">{isRecruiter ? "All Open Roles" : "Find Opportunities"}</h2>
              <p className="pj-view-sub">
                {isRecruiter
                  ? "Full market view — use My Jobs to manage your own listings"
                  : `${jobs.length} open role${jobs.length !== 1 ? "s" : ""} available right now`}
              </p>
            </div>
          </div>
          <JobGridPanel
            title=""
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

      {/* ── APPLICANTS ── */}
      {activeView === "applicants" && (
        <div className="pj-view-page">
          <div className="pj-view-head">
            <div>
              <h2 className="pj-view-title">Review Applicants</h2>
              <p className="pj-view-sub">{applicants.length} candidate{applicants.length !== 1 ? "s" : ""} across your postings</p>
            </div>
          </div>
          {applicationsLoading && (
            <div className="pj-loading-state">
              <div className="pj-spinner" />
              <p>Loading applicants...</p>
            </div>
          )}
          {!applicationsLoading && applicants.length === 0 && (
            <div className="pj-empty-state">
              <div className="pj-empty-icon"><Icon name="inbox" /></div>
              <h3>No applicants yet</h3>
              <p>Applications will appear here once candidates apply to your postings.</p>
              <button className="pj-btn-primary" onClick={() => onChangeView("post-job")}>Post a Job</button>
            </div>
          )}
          {!applicationsLoading && applicants.length > 0 && (
            <div className="pj-table-card">
              <div className="pj-table-scroll">
                <table className="pj-table">
                  <thead>
                    <tr>
                      <th>Job Title</th>
                      <th>Candidate</th>
                      <th>Status</th>
                      <th>Resume</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicants.map((row) => {
                      const meta = STATUS_META[row.status] || STATUS_META.PENDING;
                      return (
                        <tr key={row.id}>
                          <td><strong>{row.jobTitle}</strong></td>
                          <td className="pj-td-candidate">
                            <div className="pj-mini-avatar">{(row.studentProfileId || "?")[0].toUpperCase()}</div>
                            <span>{row.studentProfileId}</span>
                          </td>
                          <td>
                            <span className="pj-status-badge" style={{ background: meta.color + "1a", color: meta.color, border: `1px solid ${meta.color}40` }}>
                              {meta.label}
                            </span>
                          </td>
                          <td>
                            {row.resumeUrl
                              ? <a className="pj-table-link" href={resolveApiPath(row.resumeUrl)} target="_blank" rel="noreferrer">View Resume</a>
                              : <span className="pj-table-na">—</span>}
                          </td>
                          <td className="pj-td-actions">
                            <button
                              className="pj-btn-shortlist"
                              disabled={statusUpdatingId === row.id}
                              onClick={() => handleUpdateApplicationStatus(row.id, "SHORTLISTED")}
                            >
                              {statusUpdatingId === row.id ? "..." : "Shortlist"}
                            </button>
                            <button
                              className="pj-btn-reject"
                              disabled={statusUpdatingId === row.id}
                              onClick={() => handleUpdateApplicationStatus(row.id, "REJECTED")}
                            >
                              {statusUpdatingId === row.id ? "..." : "Reject"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── MY APPLICATIONS ── */}
      {activeView === "my-applications" && (
        <div className="pj-view-page">
          <div className="pj-view-head">
            <div>
              <h2 className="pj-view-title">My Applications</h2>
              <p className="pj-view-sub">{applications.length} application{applications.length !== 1 ? "s" : ""} tracked</p>
            </div>
          </div>
          {applicationsLoading && (
            <div className="pj-loading-state">
              <div className="pj-spinner" />
              <p>Loading applications...</p>
            </div>
          )}
          {!applicationsLoading && applications.length === 0 && (
            <div className="pj-empty-state">
              <div className="pj-empty-icon"><Icon name="browse" /></div>
              <h3>No applications yet</h3>
              <p>Start applying to roles and track your progress here.</p>
              <button className="pj-btn-primary" onClick={() => onChangeView("browse-jobs")}>Browse Jobs</button>
            </div>
          )}
          {!applicationsLoading && applications.length > 0 && (
            <div className="pj-apps-grid">
              {applications.map((row) => {
                const meta = STATUS_META[row.status] || STATUS_META.PENDING;
                return (
                  <div key={row.id} className="pj-app-card">
                    <div className="pj-app-card-top">
                      <div className="pj-app-company-dot" />
                      <strong className="pj-app-title">{row.jobTitle}</strong>
                      <span className="pj-status-badge" style={{ background: meta.color + "1a", color: meta.color, border: `1px solid ${meta.color}40` }}>
                        {meta.label}
                      </span>
                    </div>
                    <p className="pj-app-company">{row.companyName}</p>
                    <p className="pj-app-date">
                      {row.appliedAt
                        ? `Applied ${new Date(row.appliedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                        : "Date unknown"}
                    </p>
                    <div className="pj-app-progress">
                      <div
                        className="pj-app-progress-bar"
                        style={{
                          "--prog-color": meta.color,
                          "--prog-w": row.status === "SHORTLISTED" ? "100%" : row.status === "REJECTED" ? "100%" : "40%"
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── PROFILE ── */}
      {activeView === "profile" && (
        <div className="pj-view-page">
          <div className="pj-view-head">
            <div>
              <h2 className="pj-view-title">{isRecruiter ? "Company Profile" : "My Profile"}</h2>
              <p className="pj-view-sub">Keep your information up to date</p>
            </div>
          </div>

          {profileLoading && (
            <div className="pj-loading-state">
              <div className="pj-spinner" />
              <p>Loading profile...</p>
            </div>
          )}

          {!profileLoading && !isRecruiter && (
            <div className="pj-profile-shell">
              <div className="pj-profile-avatar-card">
                <div className="pj-profile-avatar">
                  {(studentProfile.displayName || user?.username || "?")[0].toUpperCase()}
                </div>
                <h3>{studentProfile.displayName || user?.username}</h3>
                <p className="pj-profile-badge">Job Seeker</p>
                {studentProfile.collegeName && (
                  <p className="pj-profile-college">
                    <Icon name="school" /> {studentProfile.collegeName}
                  </p>
                )}
                {studentProfile.resumeUrl && (
                  <a className="pj-profile-resume-link" href={resolveApiPath(studentProfile.resumeUrl)} target="_blank" rel="noreferrer">
                    <Icon name="resume" /> View Resume
                  </a>
                )}
              </div>

              <form className="pj-profile-form" onSubmit={handleSaveStudentProfile}>
                <div className="pj-form-section-title">Personal Information</div>
                <div className="pj-form-row">
                  <label className="pj-form-field">
                    <span>Full Name</span>
                    <input name="displayName" value={studentProfile.displayName || ""} onChange={handleStudentProfileField} placeholder="Your full name" />
                  </label>
                  <label className="pj-form-field">
                    <span>Email</span>
                    <input name="email" type="email" value={studentProfile.email || ""} onChange={handleStudentProfileField} placeholder="your@email.com" />
                  </label>
                </div>
                <div className="pj-form-row">
                  <label className="pj-form-field">
                    <span>College / University</span>
                    <input name="collegeName" value={studentProfile.collegeName || ""} onChange={handleStudentProfileField} placeholder="Your institution" />
                  </label>
                  <label className="pj-form-field">
                    <span>Skills</span>
                    <input name="skills" value={studentProfile.skills || ""} onChange={handleStudentProfileField} placeholder="React, Node.js, Python..." />
                  </label>
                </div>
                <label className="pj-form-field pj-form-field--full">
                  <span>Bio</span>
                  <textarea name="bio" value={studentProfile.bio || ""} onChange={handleStudentProfileField} placeholder="Tell recruiters about yourself..." rows={3} />
                </label>

                <div className="pj-form-section-title">Resume</div>
                <label className="pj-file-upload">
                  <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeFileChange} disabled={resumeUploading} />
                  <span className="pj-file-upload-inner">
                    <Icon name="upload" />
                    {resumeUploading ? "Uploading..." : "Upload PDF or Word document"}
                  </span>
                </label>

                <div className="pj-form-actions">
                  <button className="pj-btn-primary" type="submit" disabled={profileSaving || resumeUploading}>
                    {profileSaving ? "Saving..." : "Save Profile"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {!profileLoading && isRecruiter && (
            <div className="pj-profile-shell">
              <div className="pj-profile-avatar-card">
                <div className="pj-profile-avatar pj-profile-avatar--recruiter">
                  {(recruiterProfile.companyName || recruiterProfile.displayName || user?.username || "?")[0].toUpperCase()}
                </div>
                <h3>{recruiterProfile.companyName || "Your Company"}</h3>
                <p className="pj-profile-badge pj-profile-badge--recruiter">Recruiter</p>
                <p className="pj-profile-college">{recruiterProfile.displayName || user?.username}</p>
              </div>

              <form className="pj-profile-form" onSubmit={handleSaveRecruiterProfile}>
                <div className="pj-form-section-title">Recruiter Details</div>
                <div className="pj-form-row">
                  <label className="pj-form-field">
                    <span>Full Name</span>
                    <input name="displayName" value={recruiterProfile.displayName || ""} onChange={handleRecruiterProfileField} placeholder="Your full name" />
                  </label>
                  <label className="pj-form-field">
                    <span>Email</span>
                    <input name="email" type="email" value={recruiterProfile.email || ""} onChange={handleRecruiterProfileField} placeholder="your@company.com" />
                  </label>
                </div>
                <label className="pj-form-field pj-form-field--full">
                  <span>Company Name</span>
                  <input name="companyName" value={recruiterProfile.companyName || ""} onChange={handleRecruiterProfileField} placeholder="e.g. Acme Corp" />
                </label>
                <div className="pj-form-actions">
                  <button className="pj-btn-primary" type="submit" disabled={profileSaving}>
                    {profileSaving ? "Saving..." : "Save Profile"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
