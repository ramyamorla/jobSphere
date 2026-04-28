# JobSphere

A full-stack hiring portal that connects **students** looking for jobs with **recruiters** posting openings.  
Built as a **monorepo** with React + Vite on the frontend and Spring Boot + MongoDB on the backend.

## Live Demo

- **App:** https://job-sphere-git-main-ramyamorlas-projects.vercel.app/
- **Backend API:** https://jobsphere-ubvv.onrender.com/api

> Note: the backend is hosted on Render's free tier, so the first request after inactivity may take ~50 seconds to spin up.

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

| Layer      | Technology                     |
|------------|--------------------------------|
| Frontend   | React 18, Vite 5               |
| Backend    | Java 17, Spring Boot 3.3.5     |
| Database   | MongoDB 7                      |
| Build tool | Maven 3.9+                     |
| Container  | Docker + Docker Compose        |

---

## Monorepo Structure

```
jobSphere/                          ← monorepo root
├── package.json                    ← npm workspaces root + convenience scripts
├── docker-compose.yml              ← runs all 3 services (mongo, backend, frontend)
├── .env.example                    ← copy to .env and customise
│
├── jobsphere_frontend/             ← React + Vite SPA
│   ├── Dockerfile                  ← Node build → nginx
│   ├── nginx.conf                  ← SPA routing + /api proxy → backend
│   └── src/
│       ├── features/
│       │   ├── auth/               ← Landing, sign-in / register
│       │   ├── jobs/               ← Job list, job form, grid panel
│       │   ├── applications/       ← Application tracking
│       │   └── profile/            ← Student & recruiter profiles
│       ├── components/             ← AppNavigation, BrandHeader, InteractiveLogo
│       └── config/                 ← API base URL config
│
└── jobsphere_backend/              ← Spring Boot REST API
    ├── Dockerfile                  ← Maven build → JRE runtime
    └── src/main/java/com/jobsphere/backend/
        ├── controller/             ← Auth, Job, Application, Profile, Health
        ├── service/                ← Business logic
        ├── repository/             ← Spring Data MongoDB repos
        ├── model/                  ← UserAccount, Job, JobApplication, profiles
        ├── dto/                    ← Request / response DTOs
        └── config/                 ← CORS configuration
```

---

## Quick Start — Docker (recommended)

> Requires **Docker Desktop** (or Docker Engine + Compose plugin).

```bash
# 1. Clone and enter the repo
git clone <repo-url> && cd jobSphere

# 2. (Optional) customise environment variables
cp .env.example .env

# 3. Build and start everything
npm run docker:up
#   or: docker compose up --build
```

| Service  | URL                        |
|----------|----------------------------|
| Frontend | http://localhost:3000      |
| Backend  | http://localhost:8080/api  |
| MongoDB  | localhost:27017            |

Other useful commands:

```bash
npm run docker:up:detach      # start in background
npm run docker:logs           # tail all logs
npm run docker:logs:backend   # tail backend logs only
npm run docker:down           # stop containers (keep data volume)
npm run docker:down:volumes   # stop containers AND wipe the MongoDB volume
```

---

## Local Development (without Docker)

### Prerequisites

- Node.js 20+
- Java 17
- Maven 3.9+
- MongoDB running on `localhost:27017`

### 1. Install dependencies

```bash
npm install        # installs frontend deps via npm workspaces
```

### 2. Start MongoDB

```bash
mongod
# or set a custom URI:
export MONGODB_URI=mongodb://localhost:27017/jobsphere
```

### 3. Start the backend

```bash
npm run backend:dev
# or: cd jobsphere_backend && mvn spring-boot:run
```

Verify: `curl http://localhost:8080/api/health`

### 4. Start the frontend

```bash
npm run dev
# or: cd jobsphere_frontend && npm run dev
```

Frontend: `http://localhost:5173`

---

## Environment Variables

Copy `.env.example` → `.env` and adjust as needed.

| Variable           | Default                              | Used by  |
|--------------------|--------------------------------------|----------|
| `MONGODB_URI`      | `mongodb://localhost:27017/jobsphere`| Backend  |
| `VITE_API_BASE_URL`| `http://localhost:8080/api`          | Frontend (build-time) |

> In Docker Compose, `VITE_API_BASE_URL` is automatically set to `/api` so nginx can proxy the requests — you don't need to change anything.

---

## API Endpoints

### Auth
| Method | Endpoint                  | Description                        |
|--------|---------------------------|------------------------------------|
| POST   | `/api/auth/check-username`| Check if a username + role exists  |
| POST   | `/api/auth/sign-in`       | Sign in or register                |

### Jobs
| Method | Endpoint            | Description                                                      |
|--------|---------------------|------------------------------------------------------------------|
| POST   | `/api/jobs`         | Create a job posting                                             |
| GET    | `/api/jobs`         | List / search jobs (`keyword`, `location`, `jobType`, `workMode`, `minSalary`) |
| DELETE | `/api/jobs/{jobId}` | Delete a job posting                                             |

### Applications
| Method | Endpoint                                    | Description                      |
|--------|---------------------------------------------|----------------------------------|
| POST   | `/api/applications`                         | Apply to a job                   |
| GET    | `/api/applications/student/{profileId}`     | Student's applications           |
| GET    | `/api/applications/recruiter/{profileId}`   | Recruiter's applicants           |
| PATCH  | `/api/applications/{applicationId}/status`  | Update application status        |

### Profiles
| Method   | Endpoint                                      | Description                  |
|----------|-----------------------------------------------|------------------------------|
| GET/PUT  | `/api/profiles/student/{profileId}`           | Read or update student profile |
| POST     | `/api/profiles/student/{profileId}/resume`    | Upload resume (multipart)    |
| GET/PUT  | `/api/profiles/recruiter/{profileId}`         | Read or update recruiter profile |
| GET      | `/api/profiles/resume-files/{fileName}`       | Download a resume file       |

### Health
| Method | Endpoint          | Description              |
|--------|-------------------|--------------------------|
| GET    | `/api/health`     | Liveness check           |
| GET    | `/api/health/db`  | MongoDB connectivity     |

---

## Authentication

JobSphere uses **passwordless, role-based sign-in**. A user is identified by their `username` and `role` (`STUDENT` or `RECRUITER`). On first sign-in the account and profile are created automatically. The session is stored in `localStorage` — no tokens or cookies required.

---

## Future Scope

- **AI Resume Analyzer** — parse uploaded resumes with an LLM to extract skills and surface profile gaps
- **Job Match Score** — semantic similarity between a student's profile and each job listing
- **AI Cover Letter Generator** — one-click tailored cover letter from job description + student profile
- **Web Scraping Pipeline** — scheduled scraper pulling real listings from LinkedIn, Indeed, Glassdoor
- **Smart Job Alerts** — notify students when newly scraped jobs exceed their personal match score
- **Recruiter Writing Assistant** — flag biased language and vague requirements before a posting goes live

---

## License

MIT
