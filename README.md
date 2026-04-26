# JobSphere

A full-stack hiring portal that connects **students** looking for jobs with **recruiters** posting openings. Built with React + Vite on the frontend and Spring Boot + MongoDB on the backend.

## Live Demo

- **App:** https://job-sphere-git-main-ramyamorlas-projects.vercel.app/
- **Backend API:** https://jobsphere-ubvv.onrender.com/api

> Note: the backend is hosted on Render's free tier, so the first request after inactivity may take ~50 seconds to spin up. Just wait a moment and it'll be up.

---

## Features

### For Recruiters
- Post job listings with title, company, skills, location, work mode, job type, experience level, salary range, and openings count
- Live preview of the job card while filling the form
- Manage and delete your own postings
- Review all applicants and update their status (Pending → Reviewed → Shortlisted → Rejected)
- Download applicant resumes directly

### For Students
- Browse and search jobs by keyword, location, job type, work mode, and minimum salary
- Apply to jobs with one click (disabled automatically when openings are full)
- Track application status in real time
- Upload and manage a resume on your profile

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 5 |
| Backend | Java 17, Spring Boot 3.3.5 |
| Database | MongoDB |
| Build tool | Maven 3.9+ |
| API base (local) | `http://localhost:8080/api` |
| API base (prod) | `https://jobsphere-ubvv.onrender.com/api` |
| Hosting (frontend) | Vercel |
| Hosting (backend) | Render |

---

## Project Structure

```
jobSphere/
├── jobsphere_frontend/     # React + Vite SPA
│   └── src/
│       ├── features/
│       │   ├── auth/       # Landing page, sign-in/register
│       │   └── jobs/       # Jobs page, job form, job list, grid panel
│       ├── components/     # AppNavigation, BrandHeader, InteractiveLogo
│       └── config/         # API base URL config
└── jobsphere_backend/      # Spring Boot REST API
    └── src/main/java/com/jobsphere/backend/
        ├── controller/     # AuthController, JobController, ApplicationController, ProfileController
        ├── service/        # Business logic
        ├── repository/     # Spring Data MongoDB repositories
        ├── model/          # UserAccount, Job, JobApplication, StudentProfile, RecruiterProfile
        ├── dto/            # Request/response DTOs
        └── config/         # CORS configuration
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- Java 17
- Maven 3.9+
- MongoDB running locally on port `27017`

### 1. Start MongoDB

Make sure MongoDB is running locally:

```bash
mongod
```

Or set a custom connection string via environment variable:

```bash
export MONGODB_URI=mongodb://localhost:27017/jobsphere
```

### 2. Start the Backend

```bash
cd jobsphere_backend
mvn spring-boot:run
```

Backend runs on `http://localhost:8080`. Verify with:

```bash
curl http://localhost:8080/api/health
```

### 3. Start the Frontend

```bash
cd jobsphere_frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/check-username` | Check if a username + role exists |
| POST | `/api/auth/sign-in` | Sign in or register (unified endpoint) |

### Jobs
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/jobs` | Create a job posting |
| GET | `/api/jobs` | List or search jobs (`keyword`, `location`, `jobType`, `workMode`, `minSalary`) |
| DELETE | `/api/jobs/{jobId}` | Delete a job posting |

### Applications
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/applications` | Apply to a job |
| GET | `/api/applications/student/{profileId}` | Get a student's applications |
| GET | `/api/applications/recruiter/{profileId}` | Get a recruiter's applicants |
| PATCH | `/api/applications/{applicationId}/status` | Update application status |

### Profiles
| Method | Endpoint | Description |
|---|---|---|
| GET / PUT | `/api/profiles/student/{profileId}` | Read or update student profile |
| POST | `/api/profiles/student/{profileId}/resume` | Upload resume (multipart) |
| GET / PUT | `/api/profiles/recruiter/{profileId}` | Read or update recruiter profile |
| GET | `/api/profiles/resume-files/{fileName}` | Download a resume file |

### Health
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Liveness check |
| GET | `/api/health/db` | MongoDB connectivity check |

---

## Authentication

JobSphere uses **passwordless, role-based sign-in**. A user is identified by their `username` and `role` (STUDENT or RECRUITER). On first sign-in the account and profile are created automatically. The session is stored in `localStorage` as a JSON object — no tokens or cookies required.

---

## Future Scope

- **AI Resume Analyzer** — parse uploaded resumes with an LLM to extract skills and surface profile gaps
- **Job Match Score** — compute semantic similarity between a student's profile and each job listing using text embeddings
- **AI Cover Letter Generator** — one-click tailored cover letter using the job description and student profile as context
- **Web Scraping Pipeline** — scheduled scraper (Playwright / BeautifulSoup) to pull real listings from LinkedIn, Indeed, and Glassdoor and normalize them into the JobSphere schema
- **Smart Job Alerts** — notify students when newly scraped jobs exceed their personal AI match score threshold
- **Recruiter Writing Assistant** — flag biased language and vague requirements in job postings before they go live

---

## License

MIT
