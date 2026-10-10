# 📚 Complete DevOps Lab Manual & Experiments Guide (Expt 1 to 7)

This manual provides the complete step-by-step execution guide, output verification steps, lab record screenshot instructions, and oral viva questions for all 7 experiments.

---

## 📑 Index of Experiments
- [Experiment 1: Version Control Operations using Git](#-experiment-1-version-control-operations-using-git)
- [Experiment 2: Containerize Application using Docker](#-experiment-2-containerize-application-using-docker)
- [Experiment 3: Deploy Multi-Service Applications using Docker Compose](#-experiment-3-deploy-multi-service-applications-using-docker-compose)
- [Experiment 4: Jenkins Pipeline Configuration](#-experiment-4-jenkins-pipeline-configuration)
- [Experiment 5: Automate Application Deployment using GitHub & Jenkins](#-experiment-5-automate-application-deployment-using-github--jenkins)
- [Experiment 6: Agile Project Management & Issue Tracking using Jira](#-experiment-6-agile-project-management--issue-tracking-using-jira)
- [Experiment 7: Implement Monitoring using Prometheus & Grafana](#-experiment-7-implement-monitoring-using-prometheus--grafana)

---

## 📌 Experiment 1: Version Control Operations using Git

### 1. Aim
To learn and implement essential version control operations using Git, including repository initialization, staging, commits, branching strategies, merging, and remote repository synchronization on GitHub.

### 2. Theory
Git is a distributed version control system (DVCS) that tracks file changes and allows collaboration across teams. A branching strategy (such as GitFlow) separates production releases (`main`), integration code (`develop`), and discrete units of work (`feature/*`).

### 3. Execution Commands
```bash
# 1. Initialize local Git repository
cd /path/to/devops-fullstack-app
git init

# 2. Configure user credentials
git config user.name "Your Name"
git config user.email "your.email@example.com"

# 3. Check working tree status
git status

# 4. Stage all project files
git add .

# 5. Commit with conventional Jira-linked message
git commit -m "DEVOPS-101: Initial commit with full stack architecture"

# 6. Create and switch branches
git checkout -b develop
git checkout -b feature/DEVOPS-102-dockerization

# 7. Merge feature into develop
git checkout develop
git merge feature/DEVOPS-102-dockerization

# 8. Create version tag
git tag -a v1.0.0 -m "Release Version 1.0.0"

# 9. Verify commit log and branching tree
git log --oneline --graph --decorate --all
```

### 4. Output Verification
- Run `git branch -a` to see all active branches.
- Run `git log -n 5` to show formatted commit history.

### 5. Viva Voce Questions & Answers
1. **Q: What is the difference between Git and GitHub?**  
   *A:* Git is a distributed command-line version control tool installed locally. GitHub is a cloud-based hosting platform providing Git repository management, pull requests, issue tracking, and CI/CD automation.
2. **Q: What is the difference between `git pull` and `git fetch`?**  
   *A:* `git fetch` downloads remote changes without merging them into your current branch, while `git pull` performs `git fetch` followed immediately by `git merge`.
3. **Q: What is the staging area in Git?**  
   *A:* The staging area (or index) is an intermediate holding area where changes are formatted and reviewed before committing to repository history.

---

## 📌 Experiment 2: Containerize Application using Docker

### 1. Aim
To containerize the frontend (React) and backend (Node.js/Express) components of the full-stack web application using Docker and multi-stage Dockerfiles.

### 2. Theory
Docker containers package application code along with all system libraries, dependencies, and runtime environments, guaranteeing reproducibility across development, staging, and production environments. Multi-stage builds reduce image sizes by discarding build-time tooling.

### 3. Execution Commands
```bash
# 1. Build Backend Docker Image
cd backend
docker build -t devflow-backend:v1.0 .

# 2. Build Frontend Docker Image (Multi-stage with Nginx)
cd ../frontend
docker build -t devflow-frontend:v1.0 .

# 3. List built Docker images
docker images

# 4. Run standalone Backend Container
docker run -d -p 5000:5000 --name test-backend devflow-backend:v1.0

# 5. Verify container status and logs
docker ps
docker logs test-backend

# 6. Test health check endpoint inside running container
curl http://localhost:5000/health
```

### 4. Output Verification
- Run `docker images` and verify the images exist and are under 150MB.
- `curl http://localhost:5000/health` returns `{"status":"UP"}`.

### 5. Viva Voce Questions & Answers
1. **Q: What is a Docker multi-stage build?**  
   *A:* A method where multiple `FROM` instructions are used in a single Dockerfile. Early stages compile source code (e.g. Node/Vite build), and only the compiled static artifacts are copied into a lean production image (e.g. Nginx Alpine), drastically minimizing image size and attack surface.
2. **Q: What is the difference between `CMD` and `ENTRYPOINT`?**  
   *A:* `ENTRYPOINT` specifies the executable command that always runs, while `CMD` provides default arguments that can be overridden from the command line.
3. **Q: Why use `.dockerignore`?**  
   *A:* Prevents unnecessary files (like `node_modules`, local `.git`, secret `.env` files) from being copied into the Docker build context, speeding up builds and reducing image sizes.

---

## 📌 Experiment 3: Deploy Multi-Service Applications using Docker Compose

### 1. Aim
To deploy and orchestrate a multi-service application consisting of Frontend, Backend, PostgreSQL Database, Prometheus, and Grafana using `docker-compose.yml`.

### 2. Theory
Docker Compose is a tool for defining and running multi-container Docker applications using a declarative YAML file. It automatically configures isolated networks, storage volumes, container dependencies (`depends_on`), and health checks.

### 3. Execution Commands
```bash
# 1. Start all 5 services in detached mode
docker compose up --build -d

# 2. Check service status and health indicators
docker compose ps

# 3. View unified logs across services
docker compose logs -f backend postgres

# 4. Inspect bridge network created by Docker Compose
docker network inspect devops-fullstack-app_devops-network

# 5. Stop and clean up containers
docker compose down
```

### 4. Output Verification
- Run `docker compose ps` to verify all 5 containers are `Up` and `healthy`:
  - `devflow-frontend` (Port 3000 -> 80)
  - `devflow-backend` (Port 5000)
  - `devflow-postgres` (Port 5432)
  - `devflow-prometheus` (Port 9090)
  - `devflow-grafana` (Port 3001)

### 5. Viva Voce Questions & Answers
1. **Q: What is the purpose of `depends_on` with `condition: service_healthy`?**  
   *A:* It ensures that a dependent service (e.g. backend) does not start until the prerequisite service (e.g. database) has passed its internal readiness checks (e.g. `pg_isready`).
2. **Q: How do containers communicate with each other in Docker Compose?**  
   *A:* Docker Compose creates an internal user-defined bridge network where containers resolve each other using their service names as DNS hostnames (e.g. `postgres`, `backend`).
3. **Q: Where is persistent database data stored when using Docker?**  
   *A:* In named Docker volumes (e.g. `postgres_data`) managed by Docker outside the container writable layer.

---

## 📌 Experiment 4: Jenkins Pipeline Configuration

### 1. Aim
To create and execute an automated continuous integration pipeline in Jenkins using a declarative `Jenkinsfile`.

### 2. Theory
Jenkins is an open-source automation server. Declarative Pipelines define the entire CI/CD workflow as code (`Jenkinsfile`), broken down into sequential stages (`Checkout`, `Test`, `Build`, `Deploy`) with automated post-build notifications.

### 3. Pipeline Stages in `Jenkinsfile`
1. **Checkout SCM:** Pulls source code from GitHub repository.
2. **Backend Tests:** Executes Jest test suite (`npm test`).
3. **Frontend Build:** Validates production bundle generation (`npm run build`).
4. **Docker Containerization:** Builds versioned Docker images.
5. **Multi-Service Deployment:** Spins up Docker Compose stack.
6. **Health Validation:** Queries `/health` and `/metrics`.

### 4. Jenkins Execution Steps
```bash
# 1. Run Jenkins Container (if running Jenkins locally)
docker run -d -p 8080:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home jenkins/jenkins:lts

# 2. In Jenkins Web UI (http://localhost:8080):
#    - Click "New Item" -> Enter Name "DevFlow-CI-Pipeline" -> Select "Pipeline"
#    - In "Pipeline Definition", select "Pipeline script from SCM" -> Git
#    - Specify Repository URL and script path: "Jenkinsfile"
#    - Click "Save" and "Build Now"
```

### 5. Viva Voce Questions & Answers
1. **Q: What is the difference between Freestyle and Pipeline jobs in Jenkins?**  
   *A:* Freestyle jobs are configured manually through the Jenkins GUI. Pipeline jobs are version-controlled scripts written in Groovy syntax (`Jenkinsfile`) stored directly with application code.
2. **Q: What are the primary sections of a Declarative Jenkinsfile?**  
   *A:* `pipeline`, `agent`, `environment`, `stages`, `stage`, `steps`, and `post` (success/failure/always).
3. **Q: How do you handle secrets and credentials in Jenkins?**  
   *A:* Through the Jenkins Credentials Store, referenced securely in pipelines using `withCredentials([usernamePassword(...)])`.

---

## 📌 Experiment 5: Automate Application Deployment using GitHub & Jenkins

### 1. Aim
To configure automated continuous deployment triggered by code pushes to GitHub via Webhooks and GitHub Actions.

### 2. Theory
Continuous Deployment automatically tests and deploys code changes directly to target environments upon passing quality checks. Webhooks send HTTP POST payloads from GitHub to Jenkins whenever commits are pushed.

### 3. Setup Steps
1. **GitHub Webhook Setup:**
   - Go to your GitHub Repository -> **Settings** -> **Webhooks** -> **Add webhook**.
   - Payload URL: `http://<your-jenkins-ip>:8080/github-webhook/`
   - Content type: `application/json`
   - Event trigger: "Just the push event".
2. **GitHub Actions Workflow:**
   - Review `.github/workflows/ci-cd.yml` in this repository.
   - Pushing code to `main` automatically triggers automated testing and Docker image creation.

### 4. Output Verification
- Push a test commit:
  ```bash
  git commit --allow-empty -m "DEVOPS-105: test automated trigger"
  git push origin main
  ```
- Observe the pipeline trigger automatically without manual button clicks!

### 5. Viva Voce Questions & Answers
1. **Q: What is a Webhook?**  
   *A:* An automated HTTP callback triggered by specific events (e.g. `git push`) that notifies external systems in real time without polling.
2. **Q: What is the difference between Continuous Delivery and Continuous Deployment?**  
   *A:* Continuous Delivery automates building and testing but requires manual approval before deploying to production. Continuous Deployment automates release directly to production with zero human intervention.

---

## 📌 Experiment 6: Agile Project Management & Issue Tracking using Jira

### 1. Aim
To configure agile project workflows, epics, user stories, sprints, Kanban boards, and integrate Git commits with Jira issue tracking.

### 2. Theory
Jira is an agile project tracking tool developed by Atlassian. In DevOps workflows, issues provide full traceability: each code commit, PR, and build references a Jira issue key (e.g. `DEVOPS-101`), enabling auditability and automated status transitions.

### 3. Jira Agile Setup Guide
1. **Create Scrum Project:** Name it "DevOps Cloud Platform" with project key `DEVOPS`.
2. **Create Epics & Stories:**
   - Epic: *Infrastructure & Deployment Pipeline*
   - Story: *Containerize Services using Multi-Stage Dockerfile* (Key: `DEVOPS-102`)
3. **Plan Sprint:** Drag user stories into "Sprint 1", assign story points (e.g. 5 points) and assignees.
4. **Smart Commits:** Developers link commits to Jira by using:
   ```bash
   git commit -m "DEVOPS-102 #time 2h #comment Containerized backend API #close"
   ```

### 4. Output Verification
- Open the application UI at `http://localhost:3000` and switch to the **"Jira & Sprints (Expt 6)"** tab.
- Observe the live Traceability Matrix linking Issue Keys, Git Branches, and Commit Hashes!

### 5. Viva Voce Questions & Answers
1. **Q: What is a Burndown Chart in Scrum?**  
   *A:* A graph depicting remaining work (story points or hours) versus time in a sprint, showing whether the team is on track to complete sprint goals.
2. **Q: What is the difference between a Task, a Story, and an Epic?**  
   *A:* An Epic is a large body of work broken into multiple Stories (user requirements). Tasks are specific technical activities required to implement a story.
3. **Q: What are Smart Commits in Jira?**  
   *A:* Special commit message syntax (`<Issue_Key> #comment ... #status ...`) that allows developers to log work, add comments, and transition Jira issues directly from Git.

---

## 📌 Experiment 7: Implement Monitoring using Prometheus & Grafana

### 1. Aim
To implement application performance and system monitoring using Prometheus (metrics scraping) and Grafana (telemetry dashboard visualization).

### 2. Theory
- **Prometheus:** A time-series database and monitoring system using a **pull model** to scrape HTTP endpoints (`/metrics`) exposing metrics in Prometheus text format.
- **Grafana:** An analytics and interactive visualization platform that queries data sources (like Prometheus) to render time-series graphs, histograms, and heatmaps.

### 3. Execution Commands
```bash
# 1. Verify backend metrics exporter
curl http://localhost:5000/metrics

# 2. Check Prometheus Targets in browser
# Open: http://localhost:9090/targets
# Status should show: devops-fullstack-backend (1/1 up)

# 3. Query Prometheus Metrics Expression:
# rate(http_requests_total[1m])
# process_resident_memory_bytes / 1024 / 1024

# 4. Open Grafana Dashboard:
# Open: http://localhost:3001
# Log in with: admin / admin
# Navigate to: Dashboards -> DevOps -> DevFlow Application & System Metrics
```

### 4. Key Metrics Exposed by this Application
- `http_requests_total` (Counter): Total requests partitioned by method, route, and status code.
- `http_request_duration_seconds` (Histogram): Latency percentiles ($p_{50}$, $p_{95}$, $p_{99}$).
- `devops_tasks_count` (Gauge): Current tasks in database categorized by status.
- `devops_app_nodejs_heap_size_used_bytes` (Gauge): V8 runtime heap memory consumption.

### 5. Viva Voce Questions & Answers
1. **Q: What is the difference between Prometheus and Nagios?**  
   *A:* Nagios is host/service-centric and primarily check-based (OK, WARNING, CRITICAL). Prometheus is metrics-centric, collects rich multi-dimensional time-series data with key-value labels, and supports powerful PromQL querying.
2. **Q: What are the 4 core Prometheus metric types?**  
   *A:* Counter (monotonically increasing), Gauge (value that goes up and down), Histogram (samples observations into configurable buckets), and Summary (calculates configurable quantiles).
3. **Q: What is the difference between push and pull monitoring models?**  
   *A:* In a push model (e.g. StatsD), monitored applications send metrics to a server. In a pull model (Prometheus), the server periodically scrapes metrics from registered application endpoints.
