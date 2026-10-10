const { connectDB } = require('./config/db');
const Project = require('./models/Project');
const Task = require('./models/Task');

const seedData = async () => {
  try {
    await connectDB();
    console.log('[Seed] Database connected, beginning seed process...');

    // Clear existing data
    await Task.destroy({ where: {} });
    await Project.destroy({ where: {} });

    // Create Main Project
    const devopsProject = await Project.create({
      key: 'DEVOPS',
      name: 'Cloud DevOps & Microservices Platform',
      description: 'Full-stack application lifecycle: Git, Docker, Jenkins CI/CD, and Prometheus Monitoring',
      lead: 'DevOps Lead Engineer',
      status: 'Active',
    });

    const webProject = await Project.create({
      key: 'CORE',
      name: 'Core Application Service',
      description: 'Full-Stack Web Portal and Business Logic APIs',
      lead: 'Senior Fullstack Developer',
      status: 'Active',
    });

    const tasks = [
      {
        issueKey: 'DEVOPS-101',
        title: 'Expt 1: Initialize Git Repo & Branching Model',
        description: 'Set up Git repository with main, develop, and feature branches. Implement conventional commit messages linking Jira ticket IDs.',
        status: 'DONE',
        priority: 'HIGH',
        type: 'TASK',
        sprint: 'Sprint 1',
        assignee: 'Alex (DevOps)',
        estimatedHours: 4.0,
        gitBranch: 'feature/git-vcs-setup',
        gitCommit: 'a1f893e',
        projectId: devopsProject.id,
      },
      {
        issueKey: 'DEVOPS-102',
        title: 'Expt 2: Containerize Backend & Frontend using Docker',
        description: 'Write optimized multi-stage Dockerfiles for Node.js API and React Vite web application with proper caching layers and .dockerignore files.',
        status: 'DONE',
        priority: 'HIGH',
        type: 'DEVOPS',
        sprint: 'Sprint 1',
        assignee: 'Sam (Cloud Eng)',
        estimatedHours: 6.0,
        gitBranch: 'feature/docker-containerization',
        gitCommit: 'b4c771a',
        projectId: devopsProject.id,
      },
      {
        issueKey: 'DEVOPS-103',
        title: 'Expt 3: Deploy Multi-Service Application via Docker Compose',
        description: 'Configure docker-compose.yml bridging frontend (port 3000/80), backend (port 5000), PostgreSQL (port 5432), and internal bridge networking.',
        status: 'DONE',
        priority: 'CRITICAL',
        type: 'DEVOPS',
        sprint: 'Sprint 1',
        assignee: 'Sam (Cloud Eng)',
        estimatedHours: 8.0,
        gitBranch: 'feature/docker-compose-stack',
        gitCommit: 'c909e23',
        projectId: devopsProject.id,
      },
      {
        issueKey: 'DEVOPS-104',
        title: 'Expt 4: Build Jenkins CI Pipeline with Jenkinsfile',
        description: 'Author declarative Jenkinsfile with automated stages: Checkout SCM, Unit Tests, Docker Image Build, and Health Validation.',
        status: 'IN_PROGRESS',
        priority: 'CRITICAL',
        type: 'DEVOPS',
        sprint: 'Sprint 2',
        assignee: 'Maria (Release Eng)',
        estimatedHours: 10.0,
        gitBranch: 'feature/jenkins-ci-pipeline',
        gitCommit: 'd550fa1',
        projectId: devopsProject.id,
      },
      {
        issueKey: 'DEVOPS-105',
        title: 'Expt 5: Automate Deployment Pipeline using GitHub & Jenkins',
        description: 'Configure automated webhook triggering Jenkins pipeline builds on GitHub push events with Slack/email notifications.',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        type: 'TASK',
        sprint: 'Sprint 2',
        assignee: 'Maria (Release Eng)',
        estimatedHours: 8.0,
        gitBranch: 'feature/github-jenkins-webhook',
        gitCommit: 'e812ab4',
        projectId: devopsProject.id,
      },
      {
        issueKey: 'DEVOPS-106',
        title: 'Expt 6: Setup Jira Agile Board, Backlog & Sprints',
        description: 'Configure Scrum/Kanban board, user stories, epics, bug tracking workflows, and link Git commit hashes with Jira issues.',
        status: 'DONE',
        priority: 'MEDIUM',
        type: 'STORY',
        sprint: 'Sprint 1',
        assignee: 'Taylor (Scrum Master)',
        estimatedHours: 5.0,
        gitBranch: 'feature/jira-agile-workflows',
        gitCommit: 'f391bb7',
        projectId: devopsProject.id,
      },
      {
        issueKey: 'DEVOPS-107',
        title: 'Expt 7: Implement Monitoring with Prometheus & Grafana',
        description: 'Integrate prom-client metrics endpoint (/metrics) in Express backend, configure prometheus.yml scrape jobs, and provision Grafana dashboard.',
        status: 'IN_REVIEW',
        priority: 'CRITICAL',
        type: 'DEVOPS',
        sprint: 'Sprint 2',
        assignee: 'Jordan (SRE)',
        estimatedHours: 12.0,
        gitBranch: 'feature/prometheus-grafana-metrics',
        gitCommit: '07cbe41',
        projectId: devopsProject.id,
      },
      {
        issueKey: 'CORE-201',
        title: 'Implement Database Connection Pooling & Failover',
        description: 'Ensure backend seamlessly connects to PostgreSQL in production and provides SQLite fallback for local developer workstations.',
        status: 'DONE',
        priority: 'HIGH',
        type: 'TASK',
        sprint: 'Sprint 1',
        assignee: 'Senior Fullstack Developer',
        estimatedHours: 6.0,
        gitBranch: 'feature/db-pooling-failover',
        gitCommit: '12d99ab',
        projectId: webProject.id,
      },
      {
        issueKey: 'CORE-202',
        title: 'Build Interactive Kanban Drag-and-Drop Board',
        description: 'Create frontend React Kanban board supporting dynamic task status updates, real-time filtering by priority, and Jira ticket inspection.',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        type: 'STORY',
        sprint: 'Sprint 2',
        assignee: 'Senior Fullstack Developer',
        estimatedHours: 8.0,
        gitBranch: 'feature/kanban-board-ui',
        gitCommit: '34a123f',
        projectId: webProject.id,
      },
      {
        issueKey: 'CORE-203',
        title: 'Fix Memory Leak in Metric Collection Buffer',
        description: 'Resolved histogram bucket size growth during burst traffic tests under k6 load simulator.',
        status: 'TODO',
        priority: 'LOW',
        type: 'BUG',
        sprint: 'Sprint 2',
        assignee: 'Jordan (SRE)',
        estimatedHours: 3.0,
        gitBranch: 'fix/metric-buffer-leak',
        gitCommit: null,
        projectId: webProject.id,
      },
    ];

    for (const task of tasks) {
      await Task.create(task);
    }

    console.log(`[Seed] Successfully seeded ${tasks.length} tasks across 2 projects!`);
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error during seeding:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;
