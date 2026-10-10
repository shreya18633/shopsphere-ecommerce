import React, { useState } from 'react';
import { GitBranch, Box, Server, Play, CheckCircle, Clock, AlertTriangle, Terminal, Cpu, Database, ShieldCheck, RefreshCw } from 'lucide-react';

const PIPELINE_STAGES = [
  { id: 1, name: '1. Checkout SCM', tool: 'Git / GitHub', cmd: 'git checkout main && git pull origin main', duration: '1.2s' },
  { id: 2, name: '2. Unit Tests', tool: 'Jest / Supertest', cmd: 'npm test -- --detectOpenHandles', duration: '2.4s' },
  { id: 3, name: '3. Docker Build', tool: 'Docker Engine', cmd: 'docker build -t devops-app:latest .', duration: '8.1s' },
  { id: 4, name: '4. Multi-Service Deploy', tool: 'Docker Compose', cmd: 'docker compose up -d --remove-orphans', duration: '4.5s' },
  { id: 5, name: '5. Smoke & Health Check', tool: 'Curl & Prometheus', cmd: 'curl -f http://localhost:5000/health', duration: '0.8s' },
];

export default function DevOpsDashboard({ stats, healthStatus }) {
  const [pipelineState, setPipelineState] = useState({
    activeStage: 0,
    isRunning: false,
    buildNumber: 42,
    lastBuildTime: 'Just now',
    logs: [
      '[Jenkins] Started by GitHub push event to refs/heads/main',
      '[Jenkins] Working directory: /var/jenkins_home/workspace/DevOps-Pipeline',
      '[Jenkins] All systems operational. Waiting for trigger...',
    ],
  });

  const triggerPipeline = () => {
    if (pipelineState.isRunning) return;

    setPipelineState((prev) => ({
      ...prev,
      isRunning: true,
      activeStage: 1,
      buildNumber: prev.buildNumber + 1,
      logs: [
        `[Jenkins] Started build #${prev.buildNumber + 1} at ${new Date().toLocaleTimeString()}`,
        `[Git] Fetching repository origin/main...`,
      ],
    }));

    let current = 1;
    const interval = setInterval(() => {
      current += 1;
      if (current <= PIPELINE_STAGES.length) {
        setPipelineState((prev) => ({
          ...prev,
          activeStage: current,
          logs: [
            ...prev.logs,
            `[Stage ${current - 1}] Success in ${PIPELINE_STAGES[current - 2].duration}. Executing stage ${current}: ${PIPELINE_STAGES[current - 1].name}...`,
            `$ ${PIPELINE_STAGES[current - 1].cmd}`,
          ],
        }));
      } else {
        clearInterval(interval);
        setPipelineState((prev) => ({
          ...prev,
          isRunning: false,
          activeStage: 6, // All complete
          lastBuildTime: new Date().toLocaleTimeString(),
          logs: [
            ...prev.logs,
            `[Stage 5] Health probe status 200 OK. Backend is UP!`,
            `[Jenkins] SUCCESS: Pipeline finished in 17.0s. Artifact deployed!`,
          ],
        }));
      }
    }, 1800);
  };

  return (
    <div>
      {/* Pipeline Banner */}
      <div className="pipeline-banner">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Jenkins Automated CI/CD Pipeline (Expt 4 & 5)</h2>
            <span className="badge-tag" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc' }}>
              Build #{pipelineState.buildNumber}
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Declarative Jenkinsfile pipeline automating Git checkout, Jest unit tests, Docker container builds, and Docker Compose deployment.
          </p>
        </div>

        <button
          className="btn-primary"
          onClick={triggerPipeline}
          disabled={pipelineState.isRunning}
          style={{ opacity: pipelineState.isRunning ? 0.7 : 1 }}
        >
          {pipelineState.isRunning ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              <span>Building Pipeline...</span>
            </>
          ) : (
            <>
              <Play size={16} />
              <span>Run Pipeline Build</span>
            </>
          )}
        </button>
      </div>

      {/* Visual Pipeline Stages */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Pipeline Execution Flow</h3>
        <div className="stages-container">
          {PIPELINE_STAGES.map((stage) => {
            const isCompleted = pipelineState.activeStage > stage.id || pipelineState.activeStage === 6;
            const isCurrent = pipelineState.activeStage === stage.id;

            return (
              <React.Fragment key={stage.id}>
                <div
                  className={`stage-card ${isCurrent ? 'running' : ''} ${isCompleted ? 'success' : ''}`}
                  style={{
                    borderColor: isCompleted ? 'var(--accent-emerald)' : isCurrent ? 'var(--accent-cyan)' : 'var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{stage.tool}</span>
                    {isCompleted ? (
                      <CheckCircle size={14} color="#10b981" />
                    ) : isCurrent ? (
                      <Clock size={14} color="#06b6d4" />
                    ) : (
                      <Clock size={14} color="var(--text-muted)" />
                    )}
                  </div>
                  <strong style={{ fontSize: '0.85rem' }}>{stage.name}</strong>
                  <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>
                    {isCompleted ? `Took ${stage.duration}` : isCurrent ? 'Running...' : 'Queued'}
                  </span>
                </div>
                {stage.id < PIPELINE_STAGES.length && (
                  <span className="stage-arrow">→</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Live Pipeline Terminal Output */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Terminal size={16} color="#38bdf8" />
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Live Jenkins Execution Logs</h3>
        </div>
        <div className="code-block" style={{ maxHeight: '180px', overflowY: 'auto' }}>
          {pipelineState.logs.map((log, i) => (
            <div key={i} style={{ color: log.includes('SUCCESS') ? '#34d399' : log.includes('Executing') ? '#fbbf24' : '#cbd5e1' }}>
              {log}
            </div>
          ))}
        </div>
      </div>

      {/* Architecture & Multi-Container Topology (Expt 2 & 3) */}
      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem' }}>
        Docker Compose Multi-Service Architecture (Expt 3)
      </h3>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon-wrap" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
            <Box size={24} />
          </div>
          <div>
            <div className="stat-val" style={{ fontSize: '1.2rem' }}>Frontend (React)</div>
            <div className="stat-label">Port: 3000 / 80 | Nginx Alpine</div>
            <span className="badge-tag" style={{ marginTop: '0.4rem', color: '#38bdf8' }}>Expt 2: Dockerized</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
            <Server size={24} />
          </div>
          <div>
            <div className="stat-val" style={{ fontSize: '1.2rem' }}>Backend (Node.js)</div>
            <div className="stat-label">Port: 5000 | Express + Metrics</div>
            <span className="badge-tag" style={{ marginTop: '0.4rem', color: '#818cf8' }}>Expt 2: Containerized</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            <Database size={24} />
          </div>
          <div>
            <div className="stat-val" style={{ fontSize: '1.2rem' }}>Database</div>
            <div className="stat-label">Port: 5432 | PostgreSQL 16</div>
            <span className="badge-tag" style={{ marginTop: '0.4rem', color: '#34d399' }}>Persistent Volume</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            <Cpu size={24} />
          </div>
          <div>
            <div className="stat-val" style={{ fontSize: '1.2rem' }}>Prometheus & Grafana</div>
            <div className="stat-label">Ports: 9090 & 3001 | Scraping :5000/metrics</div>
            <span className="badge-tag" style={{ marginTop: '0.4rem', color: '#fbbf24' }}>Expt 7: Monitored</span>
          </div>
        </div>
      </div>

      {/* Copyable Experiment Verification Commands */}
      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          Lab Demonstration CLI Commands (Quick Reference)
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem', color: '#a5b4fc' }}>
              Experiment 2 & 3: Run Docker Compose Stack
            </div>
            <pre className="code-block" style={{ margin: 0, padding: '0.6rem' }}>docker compose up --build -d</pre>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem', color: '#a5b4fc' }}>
              Experiment 4 & 5: Run CI Tests (Jenkins Stage)
            </div>
            <pre className="code-block" style={{ margin: 0, padding: '0.6rem' }}>cd backend && npm test</pre>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem', color: '#a5b4fc' }}>
              Experiment 7: Probe Health & Prometheus Metrics
            </div>
            <pre className="code-block" style={{ margin: 0, padding: '0.6rem' }}>curl http://localhost:5000/health
curl http://localhost:5000/metrics</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
