# 📚 Complete DevOps Lab Manual & Experiments Guide (E-Commerce Storefront)

This manual documents the step-by-step commands, output verification, and oral viva questions for all 7 DevOps experiments applied to the **ShopSphere E-Commerce Platform**.

---

## 📑 Index of Experiments
1. [Expt 1: Git & GitHub Operations](#-expt-1-git--github-operations)
2. [Expt 2: Docker Containerization](#-expt-2-docker-containerization)
3. [Expt 3: Docker Compose Multi-Service Deployment](#-expt-3-docker-compose-multi-service-deployment)
4. [Expt 4: Jenkins Declarative CI/CD Pipeline](#-expt-4-jenkins-declarative-cicd-pipeline)
5. [Expt 5: Automated GitHub Deployment](#-expt-5-automated-github-deployment)
6. [Expt 6: Jira Agile Sprints & User Stories](#-expt-6-jira-agile-sprints--user-stories)
7. [Expt 7: Prometheus & Grafana Performance Monitoring](#-expt-7-prometheus--grafana-performance-monitoring)

---

## 📌 Expt 1: Git & GitHub Operations
* **Objective:** Manage source code, branch lifecycle, and commit conventions linking Jira issues.
* **Commands:**
  ```bash
  git branch -a
  git log --oneline -n 5
  git checkout -b feature/SHOP-102-checkout
  git commit -m "SHOP-102: feat: add shopping cart checkout and order persistence"
  ```
* **Viva Question:** *Why prefix commits with `SHOP-102`?*  
  *Answer:* Enables Jira Smart Commits — Jira automatically links the commit to ticket `SHOP-102`, logs developer work, and transitions the ticket status.

---

## 📌 Expt 2: Docker Containerization
* **Objective:** Package the Node.js backend API and React Vite frontend into portable Docker images.
* **Commands:**
  ```bash
  cd backend && docker build -t shopsphere-backend:v1.0 .
  cd ../frontend && docker build -t shopsphere-frontend:v1.0 .
  docker images
  ```
* **Viva Question:** *Why use multi-stage build in frontend Dockerfile?*  
  *Answer:* Stage 1 builds the React bundle using Node, and Stage 2 serves the static files using lightweight Nginx Alpine, eliminating Node.js runtime overhead and keeping the image under 25MB.

---

## 📌 Expt 3: Docker Compose Multi-Service Deployment
* **Objective:** Deploy 5 interconnected services (Frontend, Backend, PostgreSQL, Prometheus, Grafana) on a single bridge network.
* **Commands:**
  ```bash
  docker compose up --build -d
  docker compose ps
  docker compose logs backend
  ```
* **Viva Question:** *How does the frontend talk to the backend in Docker Compose?*  
  *Answer:* Nginx acts as a reverse proxy forwarding `/api/*` requests to `http://backend:5000/api/` using Docker's internal DNS service discovery.

---

## 📌 Expt 4: Jenkins Declarative CI/CD Pipeline
* **Objective:** Create automated pipeline in `Jenkinsfile` running unit tests, Docker builds, and health checks.
* **Pipeline Stages:**
  1. *Checkout SCM* (Pulls code)
  2. *E-Commerce Tests* (`npm test`)
  3. *Frontend Build* (`npm run build`)
  4. *Docker Build* (Builds images)
  5. *Multi-Service Deploy* (`docker compose up -d`)
  6. *Smoke Test & Health Probe* (`curl /health` and `/metrics`)

---

## 📌 Expt 5: Automated GitHub Deployment
* **Objective:** Trigger automatic CI/CD builds on GitHub push events via Webhooks and GitHub Actions (`.github/workflows/ci-cd.yml`).
* **Verification:** Push code to `main` and observe the automated workflow execute tests and Docker builds without manual intervention.

---

## 📌 Expt 6: Jira Agile Sprints & User Stories
* **Objective:** Manage product backlog and sprint iterations for an e-commerce platform.
* **Sample User Stories:**
  * `SHOP-101`: *As a shopper, I want to browse categorized products so that I can quickly find electronics.*
  * `SHOP-102`: *As a buyer, I want to add items to a cart and checkout with my shipping address.*
  * `SHOP-103`: *As a DevOps engineer, I want to containerize the store using Docker.*

---

## 📌 Expt 7: Prometheus & Grafana Performance Monitoring
* **Objective:** Instrument backend with `prom-client` and monitor real-time shopping traffic and system memory.
* **Commands & Endpoints:**
  * Prometheus Scrape URL: `http://localhost:5000/metrics`
  * Prometheus Console: `http://localhost:9090`
  * Grafana Dashboard: `http://localhost:3001` (`admin`/`admin`)
* **Key Metrics:**
  * `http_requests_total`: Tracks incoming traffic by route and status code.
  * `ecommerce_orders_total`: Monitored counter of placed customer orders.
  * `ecommerce_revenue_dollars_total`: Cumulative revenue processed.
  * `ecommerce_app_nodejs_heap_size_used_bytes`: Runtime heap memory.
