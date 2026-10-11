# ShopSphere: Project Presentation & Meeting Script
**Full-Stack E-Commerce Platform with End-to-End DevOps Architecture**  
**Team Members:** Shreya Khandelwal (Lead), Khushboo Lakhani, Mahek  
**Meeting Duration:** ~8–10 Minutes | **Date/Time:** Today at 2:00 PM

---

## 1. Quick Project Summary (The Elevator Pitch)
> **ShopSphere** is a modern, enterprise-ready full-stack E-Commerce platform engineered to simulate real-world software delivery. It features a responsive **React 18** frontend, a scalable **Node.js/Express** backend, relational persistence via **PostgreSQL/SQLite**, orchestrated using **Docker Compose**, continuously integrated through **Jenkins CI/CD** & **GitHub Actions**, planned using **Jira Agile workflows**, and monitored with **Prometheus & Grafana**.

---

## 2. Team Work Breakdown & Responsibilities

| Team Member | Role | Core Deliverables & Technical Ownership | Git Branch & Jira Keys |
| :--- | :--- | :--- | :--- |
| **Shreya Khandelwal** | **Team Lead & Platform / DevOps Architect** | • Overall full-stack architecture & data modeling (Products, Orders)<br>• Container orchestration with Docker & multi-service Docker Compose<br>• Declarative Jenkins CI/CD pipeline automation & GitHub Actions CI<br>• Prometheus metrics instrumentation (`/metrics`) & Grafana telemetry<br>• Repository governance, PR code reviews, branch merging, and Jira Sprint management | `main`, `develop`<br>`SHOP-101`, `SHOP-102`, `SHOP-103`, `SHOP-203`, `SHOP-204` |
| **Khushboo Lakhani** | **Frontend & User Experience Engineer** | • Product Reviews & Customer Star Ratings component (`SHOP-201`)<br>• Review submission modal, validation, and real-time average score recalculation<br>• Responsive styling and product feedback badge display<br>• Feature branching, Git smart commits, and peer Pull Request lifecycle | `feature/khushboo-product-reviews`<br>`SHOP-201` |
| **Mahek** | **Backend Logic & Promotions Specialist** | • Coupon & Discount Promotion Engine (`SHOP-202`)<br>• Real-time promo code validation (`SAVE20` for 20% off, `DEVOPS10` for \$10 off)<br>• Subtotal recalculation in Cart Drawer and final checkout billing<br>• Interactive coupon application badge and discount status feedback | `feature/mahek-discounts-coupons`<br>`SHOP-202` |

---

## 3. Step-by-Step Speaking Script (8–10 Minutes)

### Part 1: Welcome & Executive Overview (1.5 Mins) — **Speaker: Shreya**
> *"Good afternoon everyone. Today, our team—myself as Lead, along with Khushboo and Mahek—is presenting **ShopSphere**, our full-stack E-Commerce web platform built with enterprise-grade DevOps automation.*
>
> *Our goal with this project was not just to build a functional online store, but to implement the entire modern Software Development Life Cycle (SDLC). That includes Agile sprint planning in Jira, Git branch-per-feature workflows, containerized microservices using Docker Compose, automated CI/CD testing and builds with Jenkins, and live telemetry with Prometheus and Grafana.*
>
> *I’ll now hand over to Khushboo to present the customer reviews and rating architecture."*

---

### Part 2: Product Reviews & Customer Experience (2 Mins) — **Speaker: Khushboo**
> *"Thank you, Shreya. In an E-Commerce platform, customer trust and social proof are critical for conversion. I was responsible for designing and implementing the **Customer Reviews and Star Ratings component** under Jira ticket **SHOP-201**.*
>
> *Here is what I built:*
> 1. *An interactive **Star Rating Selector** allowing customers to score products from 1 to 5 stars.*
> 2. *A **Review Submission Modal** that captures customer feedback, validates input, and updates the product's overall rating average and review count.*
> 3. *Visual badges on each product card displaying the verified customer rating score.*
>
> *On the DevOps side, I followed our team Git workflow by creating my own feature branch `feature/khushboo-product-reviews`, committed my work using smart commit syntax linked to SHOP-201, and submitted a Pull Request which was peer-reviewed and merged into our `main` production release branch.*
>
> *Next, Mahek will walk through our promotions and discount engine."*

---

### Part 3: Promotions, Discount Engine & Checkout (2 Mins) — **Speaker: Mahek**
> *"Thanks, Khushboo. I developed the **Coupon Code and Discount Promotion System**, tracked under Jira user story **SHOP-202**.*
>
> *Key technical highlights of my contribution include:*
> 1. *A dynamic **Discount Calculation Engine** integrated into the Shopping Cart Drawer.*
> 2. *Support for multiple promo types: percentage discounts (such as `SAVE20` for 20% off) and flat credits (like `DEVOPS10`).*
> 3. *Instant cart subtotal recalculation, sales tax estimation, and visual discount confirmation badges.*
> 4. *Persistence of the discount in the final order transaction sent to our database upon checkout.*
>
> *Like Khushboo, I developed this in my isolated feature branch `feature/mahek-discounts-coupons`, pushed my commits to GitHub, and merged via Pull Request into the main branch after passing all test suites.*
>
> *Now, Shreya will explain the underlying DevOps, CI/CD pipeline, and telemetry infrastructure."*

---

### Part 4: Cloud Infrastructure, CI/CD & Telemetry (2.5 Mins) — **Speaker: Shreya**
> *"Thank you, Mahek. To support our store with 99.9% uptime and rapid release velocity, I architected the underlying DevOps platform across four key pillars:*
>
> 1. ***Containerization & Multi-Service Topology:***
>    *We built multi-stage Dockerfiles for both frontend (using Alpine Nginx) and backend (Node.js). With a single command—`docker compose up --build -d`—all 5 containers spin up on an isolated bridge network with PostgreSQL persistent data volumes.*
>
> 2. ***Declarative Jenkins CI/CD Pipeline:***
>    *Our Jenkinsfile pipeline automates 5 consecutive stages:*
>    *• **Git Checkout** from our GitHub repository (`shreya18633/shopsphere-ecommerce`).*
>    *• **Code Quality & Linting** to ensure clean standards.*
>    *• **Automated Unit Testing** via Jest, testing API routes, health endpoints, and database models.*
>    *• **Docker Build** packaging production-ready images.*
>    *• **Automated Deployment & Health Verification** on port 5000 and 3000.*
>
> 3. ***Observability with Prometheus & Grafana:***
>    *We integrated Prometheus metrics middleware into our backend. It exposes latency histograms, HTTP request counters, total checkouts, and system memory consumption at `/metrics`. This gives us real-time telemetry into cluster performance.*
>
> 4. ***Agile Planning & Smart Commits:***
>    *In Jira, we organized 4 core user stories across Sprint 1 and Sprint 2, maintaining complete traceability from requirement ticket to git commit, Jenkins build, and live monitoring gauge."*

---

### Part 5: Live Walkthrough & Wrap-Up (1 Min) — **Speaker: Shreya / Team**
> *"To conclude our presentation, we would like to showcase the live application:*
>
> *• **Browsing & Categories:** [Demo: Filter by Electronics / Accessories]*
> *• **Customer Reviews (Khushboo):** [Demo: Open reviews on Sony headphones]*
> *• **Discount & Checkout (Mahek):** [Demo: Add item to cart, apply `SAVE20`, and place order]*
> *• **DevOps Console (Shreya):** [Demo: Click 'DevOps Console' in navbar to show Jenkins pipeline simulator, Docker architecture topology, Jira agile sprint matrix, and live Prometheus scrape metrics]*
>
> *Thank you! We are now open for any questions or feedback."*

---

## 4. Anticipated Meeting Questions & Quick Answers

| Question | Answer / Quick Response |
| :--- | :--- |
| **"How did your team collaborate on Git?"** | *"We used feature branching (`feature/khushboo-product-reviews`, `feature/mahek-discounts-coupons`). Neither member committed directly to `main`. All code was merged via GitHub Pull Requests after automated tests passed."* |
| **"What happens if PostgreSQL goes down?"** | *"Our database configuration in `db.js` includes an automatic zero-config SQLite fallback, preventing server crashes during local demonstrations or test runs."* |
| **"How does Jenkins ensure code quality?"** | *"The pipeline executes Jest tests during Stage 2. If any test fails, the build halts immediately, preventing faulty containers from deploying to production."* |
| **"What business metrics are captured in Prometheus?"** | *"`ecommerce_orders_total` (total checkouts), `ecommerce_revenue_total` (gross revenue), and `http_request_duration_seconds` (latency histogram)."* |
