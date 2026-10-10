# 🛍️ ShopSphere — Full-Stack E-Commerce Platform with DevOps Automation

A modern, responsive **E-Commerce & Online Marketplace Web Application** built with **React 18, Vite, Node.js, Express, and SQL Database**, fully integrated with all 7 DevOps Laboratory Experiments: **Git Version Control**, **Docker Multi-Stage Containerization**, **Docker Compose Orchestration**, **Jenkins Declarative CI/CD**, **GitHub Actions Deployment**, **Jira Agile Sprints & User Stories**, and **Prometheus & Grafana Telemetry**.

---

## 📋 Table of Contents
1. [Store Features & Architecture](#-store-features--architecture)
2. [DevOps Experiments Mapping (1 to 7)](#-devops-experiments-mapping)
3. [Quick Start (Local Standalone - Under 2 Mins)](#-quick-start-local-standalone)
4. [Docker & Multi-Container Deployment](#-docker--multi-container-deployment)
5. [Jenkins CI/CD Pipeline](#-jenkins-cicd-pipeline)
6. [Prometheus & Grafana Monitoring](#-prometheus--grafana-monitoring)
7. [API Reference](#-api-reference)

---

## 🛒 Store Features & Architecture

* **Product Catalog:** Electronics, Accessories, and Apparel with real images, stock status, ratings, and category filters.
* **Shopping Cart Drawer:** Slide-in cart with quantity adjustments (`+` / `-`), subtotal calculation, and instant checkout.
* **Database Orders & Checkout:** Full order placement storing customer shipping info, deducting live inventory stock, and generating Jira-linked tracking numbers.
* **Integrated DevOps Lab Suite:** In-app control panel to run simulated Jenkins builds, inspect Prometheus metrics, and explore multi-container Docker topology.

```
                      +-----------------------------+
                      |       Customer Browser      |
                      +--------------+--------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                         Docker Network: devops-network                   |
|                                                                         |
|   +-----------------------+   Reverse Proxy   +---------------------+   |
|   |    ShopStore Frontend |      /api/*       |   E-Commerce API    |   |
|   |  (React 18 + Nginx)   +------------------>|   (Express + Node)  |   |
|   |    Port: 3000 / 80    |                   |      Port: 5000     |   |
|   +-----------------------+                   +---+-------------+---+   |
|                                                   |             |       |
|                                         SQL Query |             |Scrape |
|                                                   v             v/metric|
|                                       +-----------+--+      +---+-----+ |
|                                       | PostgreSQL   |      |Prometheu| |
|                                       | Database     |      |Port 9090| |
|                                       | Port: 5432   |      +----+----+ |
|                                       +--------------+           |      |
|                                                            Query |      |
|                                                                  v      |
|                                                            +-----+----+ |
|                                                            |  Grafana | |
|                                                            | Port 3001| |
|                                                            +----------+ |
+-------------------------------------------------------------------------+
```

---

## 🎯 DevOps Experiments Mapping

| Experiment No. | Title / Objective | How This E-Commerce App Fulfills It |
| :--- | :--- | :--- |
| **Expt 1** | **Version Control using Git** | Multi-branch workflow (`main`, `develop`, `feature/SHOP-*`), tags (`v2.0.0`), and conventional commit history linked to Jira store tickets. |
| **Expt 2** | **Containerize with Docker** | Multi-stage production `Dockerfile` for React (Nginx) and Node.js with built-in `/health` check probes. |
| **Expt 3** | **Multi-Service Docker Compose** | Orchestrates 5 services (`frontend`, `backend`, `postgres`, `prometheus`, `grafana`) on a single bridge network with persistent data volumes. |
| **Expt 4** | **Jenkins CI Pipeline** | Automated declarative `Jenkinsfile` executing: Checkout $\to$ Tests $\to$ Build Bundle $\to$ Docker Build $\to$ Deploy. |
| **Expt 5** | **Automated GitHub Deployment** | GitHub Actions workflow (`.github/workflows/ci-cd.yml`) executing tests and builds on git push events. |
| **Expt 6** | **Jira Agile Project Tracking** | E-commerce user stories (`SHOP-101: Catalog`, `SHOP-102: Checkout`, `SHOP-103: Docker`), sprint burndown, and Git Smart Commits traceability. |
| **Expt 7** | **Prometheus & Grafana Monitoring** | Backend exports live order counters, revenue totals, and latency histograms at `/metrics` scraped by Prometheus & visualized in Grafana. |

---

## 💻 Quick Start (Local Standalone)

Run both services locally with zero prerequisites (uses embedded SQLite automatically!):

```bash
# 1. Start Backend API
cd backend
npm install
npm run seed     # Seeds 8 products and demo orders
npm start        # http://localhost:5000

# 2. Start Frontend Web App (In another terminal)
cd frontend
npm install
npm run dev      # http://localhost:3000
```

Open **`http://localhost:3000`** in your browser.

---

## 🐳 Docker Multi-Container Run (Expt 2 & 3)

```bash
docker compose up --build -d
docker compose ps
```

| Service | URL | Role |
| :--- | :--- | :--- |
| **Store Web UI** | `http://localhost:3000` | Shopping Marketplace Frontend |
| **Backend API** | `http://localhost:5000` | Products, Orders, Healthcheck |
| **Prometheus Exporter** | `http://localhost:5000/metrics` | Prometheus Metrics Scrape Endpoint |
| **Prometheus UI** | `http://localhost:9090` | Time-series query console |
| **Grafana UI** | `http://localhost:3001` | Visual Dashboards (`admin`/`admin`) |

---

## 🧪 Test Suite (Expt 4 & 5)
```bash
cd backend
npm test
```
All 7 tests pass covering health, Prometheus metrics, product catalog, and order checkout.
