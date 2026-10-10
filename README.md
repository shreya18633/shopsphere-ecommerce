# 🚀 DevFlow — Full-Stack DevOps & Agile Issue Tracking Platform

An enterprise-grade Full-Stack Web Application built from scratch to demonstrate and fulfill all 7 DevOps Laboratory Experiments: **Git Version Control**, **Docker Containerization**, **Docker Compose Multi-Service Deployment**, **Jenkins CI/CD Pipeline**, **Automated GitHub Deployment**, **Jira Agile Project Management**, and **Prometheus & Grafana Monitoring**.

---

## 📋 Table of Contents
1. [Architecture Overview](#-architecture-overview)
2. [DevOps Experiments Mapping (1 to 7)](#-devops-experiments-mapping)
3. [Tech Stack](#-tech-stack)
4. [Quick Start (Local Standalone - 2 Minutes)](#-quick-start-local-standalone)
5. [Docker & Multi-Container Deployment](#-docker--multi-container-deployment)
6. [Jenkins CI/CD Pipeline Setup](#-jenkins-cicd-pipeline-setup)
7. [Prometheus & Grafana Monitoring](#-prometheus--grafana-monitoring)
8. [API Reference](#-api-reference)

---

## 🏗 Architecture Overview

```
                      +-----------------------------+
                      |       User Browser          |
                      +--------------+--------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                         Docker Network: devops-network                   |
|                                                                         |
|   +-----------------------+           +-----------------------------+   |
|   |   Frontend Container  |  /api/*   |      Backend Container      |   |
|   |     (React + Vite)    +---------->|       (Node/Express)        |   |
|   |    Port: 3000 / 80    |           |          Port: 5000         |   |
|   +-----------------------+           +---+-------------------+-----+   |
|                                           |                   |         |
|                                           | SQL Query         | Scrape  |
|                                           v                   v /metrics|
|                               +-----------+---+           +---+-----+   |
|                               |  PostgreSQL   |           |Prometheus   |
|                               |   Database    |           | Port: 9090  |
|                               |  Port: 5432   |           +-----+---+   |
|                               +---------------+                 |       |
|                                                           Query |       |
|                                                                 v       |
|                                                           +-----+---+   |
|                                                           | Grafana |   |
|                                                           |Port: 3001   |
|                                                           +---------+   |
+-------------------------------------------------------------------------+
```

---

## 🎯 DevOps Experiments Mapping

| Experiment No. | Title / Objective | How This Project Satisfies It | Key Files |
| :--- | :--- | :--- | :--- |
| **Expt 1** | **Version Control Operations using Git** | Multi-branch Git workflow (`main`, `develop`, `feature/*`), tags (`v1.0.0`), conventional commit history linked to Jira issue keys. | `.gitignore`, Git commit history |
| **Expt 2** | **Containerize Application using Docker** | Multi-stage production `Dockerfile` for React (Nginx) and Node.js with built-in healthchecks. | `backend/Dockerfile`, `frontend/Dockerfile` |
| **Expt 3** | **Deploy Multi-Service Applications using Docker Compose** | Orchestrates 5 services (`frontend`, `backend`, `postgres`, `prometheus`, `grafana`) on a single bridge network with persistent volumes. | `docker-compose.yml` |
| **Expt 4** | **Jenkins CI Pipeline** | Automated declarative `Jenkinsfile` with stages for Checkout SCM, Lint & Jest Tests, Docker Image Builds, and Smoke Testing. | `Jenkinsfile` |
| **Expt 5** | **Automate Deployment using GitHub / Jenkins** | Automated GitHub Actions workflow and Jenkins webhook triggers on git push events. | `.github/workflows/ci-cd.yml`, `Jenkinsfile` |
| **Expt 6** | **Jira Agile Project Management** | Built-in Jira integration tab, backlog, Scrum sprint velocity, user stories, and Git smart commits traceability (`DEV-101: feat: ...`). | `frontend/src/components/JiraIntegrationView.jsx` |
| **Expt 7** | **Monitoring using Prometheus & Grafana** | Prometheus `/metrics` endpoint with Node.js client (`prom-client`), HTTP counters, latency histograms, and pre-provisioned Grafana dashboards. | `monitoring/prometheus/`, `monitoring/grafana/`, `backend/src/middleware/metricsMiddleware.js` |

*(See [EXPERIMENTS_GUIDE.md](file:///Users/shreyakhandelwal/.gemini/antigravity/scratch/devops-fullstack-app/EXPERIMENTS_GUIDE.md) for full viva answers, commands, and submission steps).*

---

## 💻 Quick Start (Local Standalone)

You can run the full application locally in under 2 minutes without needing external databases or Docker installed (it automatically uses an embedded SQLite database out of the box!):

### 1. Start the Backend API:
```bash
cd backend
npm install
npm run seed     # Populates sample Jira issues and DevOps tasks
npm start        # Runs API on http://localhost:5000
```

### 2. Start the Frontend (In a second terminal):
```bash
cd frontend
npm install
npm run dev      # Launches UI on http://localhost:3000
```

Open `http://localhost:3000` in your web browser.

---

## 🐳 Docker & Multi-Container Deployment (Expt 2 & 3)

### Single Command Boot:
```bash
docker compose up --build -d
```

### Verifying Service Containers:
```bash
docker compose ps
```

| Service | Host URL | Description |
| :--- | :--- | :--- |
| **Frontend Web UI** | `http://localhost:3000` | React + Vite UI |
| **Backend REST API** | `http://localhost:5000` | Express API |
| **Health Check** | `http://localhost:5000/health` | Docker & Jenkins health status |
| **Prometheus Metrics** | `http://localhost:5000/metrics` | Raw scrapable metrics |
| **Prometheus Server** | `http://localhost:9090` | Prometheus web console |
| **Grafana Dashboards** | `http://localhost:3001` | Grafana visual telemetry (User/Pass: `admin`/`admin`) |

---

## 🧪 Automated Testing (Expt 4 & 5)

Run the backend unit & integration test suite:
```bash
cd backend
npm test
```
**Test Output:**
```
PASS tests/api.test.js
  DevOps API Test Suite
    1. System Health & Monitoring Endpoints
      ✓ GET /health should return 200 and UP status (13 ms)
      ✓ GET /metrics should expose Prometheus scrape endpoint (6 ms)
      ✓ GET /api/stats should return system telemetry and task counts (9 ms)
    2. Task CRUD & Jira Operations
      ✓ POST /api/tasks should create a new Jira-style task (12 ms)
      ✓ GET /api/tasks should retrieve list of tasks (5 ms)
      ✓ PATCH /api/tasks/:id/status should update task status across Kanban columns (7 ms)
      ✓ DELETE /api/tasks/:id should remove task (6 ms)

Test Suites: 1 passed, 1 total
Tests:       7 passed, 7 total
```

---

## 📡 API Reference

- `GET /health` — Returns application health and DB connection state.
- `GET /metrics` — Prometheus text format metrics exporter.
- `GET /api/tasks` — List all tasks (supports `?status=...&priority=...&sprint=...&search=...`).
- `POST /api/tasks` — Create task with Jira issue key, title, description, and git metadata.
- `PATCH /api/tasks/:id/status` — Quick status transition across Kanban columns.
- `DELETE /api/tasks/:id` — Delete task by ID.
- `GET /api/stats` — Real-time memory, process uptime, and task distribution.
