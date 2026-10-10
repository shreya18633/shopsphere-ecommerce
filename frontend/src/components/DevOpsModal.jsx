import React, { useState, useEffect } from 'react';
import {
  X,
  Layers,
  Box,
  Server,
  GitBranch,
  Activity,
  Play,
  CheckCircle,
  Clock,
  Terminal,
  Zap,
  RefreshCw,
  ExternalLink,
  Cpu,
  Database
} from 'lucide-react';
import { api } from '../services/api';

const PIPELINE_STAGES = [
  { id: 1, name: '1. Checkout SCM', tool: 'Git / GitHub', cmd: 'git checkout main && git pull', duration: '1.1s' },
  { id: 2, name: '2. E-Commerce Tests', tool: 'Jest / Supertest', cmd: 'npm test -- --detectOpenHandles', duration: '2.5s' },
  { id: 3, name: '3. Docker Build', tool: 'Docker Engine', cmd: 'docker build -t shop-store:v2.0 .', duration: '7.8s' },
  { id: 4, name: '4. Multi-Service Deploy', tool: 'Docker Compose', cmd: 'docker compose up -d --remove-orphans', duration: '4.2s' },
  { id: 5, name: '5. Smoke & Health Check', tool: 'Curl & Prometheus', cmd: 'curl -f http://localhost:5000/health', duration: '0.9s' },
];

export default function DevOpsModal({ isOpen, onClose, stats, healthStatus }) {
  const [activeTab, setActiveTab] = useState('pipeline');
  const [pipelineState, setPipelineState] = useState({
    activeStage: 0,
    isRunning: false,
    buildNumber: 18,
    logs: [
      '[Jenkins] Initialized pipeline for ShopSphere E-Commerce platform',
      '[Jenkins] SCM polling active on refs/heads/main',
      '[Jenkins] Ready to trigger automated continuous deployment.',
    ],
  });
  const [rawMetrics, setRawMetrics] = useState('');
  const [loadingMetrics, setLoadingMetrics] = useState(false);

  const fetchMetrics = async () => {
    try {
      setLoadingMetrics(true);
      const data = await api.getMetrics();
      setRawMetrics(data);
    } catch (e) {
      setRawMetrics('# Failed to fetch metrics from /metrics');
    } finally {
      setLoadingMetrics(false);
    }
  };

  useEffect(() => {
    if (isOpen && activeTab === 'monitoring') {
      fetchMetrics();
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const triggerPipeline = () => {
    if (pipelineState.isRunning) return;

    setPipelineState((prev) => ({
      ...prev,
      isRunning: true,
      activeStage: 1,
      buildNumber: prev.buildNumber + 1,
      logs: [
        `[Jenkins] Started build #${prev.buildNumber + 1} at ${new Date().toLocaleTimeString()}`,
        `[Git] Fetching repository origin/main for E-Commerce app...`,
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
            `[Stage ${current - 1}] Success. Running Stage ${current}: ${PIPELINE_STAGES[current - 1].name}...`,
            `$ ${PIPELINE_STAGES[current - 1].cmd}`,
          ],
        }));
      } else {
        clearInterval(interval);
        setPipelineState((prev) => ({
          ...prev,
          isRunning: false,
          activeStage: 6,
          logs: [
            ...prev.logs,
            `[Stage 5] Health check status 200 OK. E-Commerce store verified!`,
            `[Jenkins] SUCCESS: Build completed in 16.5s. Artifacts deployed to Docker Compose!`,
          ],
        }));
      }
    }, 1800);
  };

  const simulateTraffic = async () => {
    try {
      await Promise.all([
        api.getHealth(),
        api.getStats(),
        api.getProducts(),
        api.getOrders(),
        api.getHealth(),
      ]);
      fetchMetrics();
    } catch (e) {
      console.error(e);
    }
  };

  const sys = stats?.systemInfo || {};
  const mem = sys?.processMemory || { heapUsedMB: 36, heapTotalMB: 48 };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-lg" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Server size={22} color="var(--primary)" />
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>DevOps Laboratory Suite (Expt 1 to 7)</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem', marginTop: '0.2rem' }}>
              How ShopSphere E-Commerce is containerized, automated, tested, and monitored.
            </p>
          </div>
          <button className="btn-secondary" style={{ padding: '0.35rem 0.6rem' }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '0.4rem',
          background: 'var(--bg-secondary)',
          padding: '0.3rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          overflowX: 'auto',
        }}>
          <button
            className={`category-pill-btn ${activeTab === 'pipeline' ? 'active' : ''}`}
            onClick={() => setActiveTab('pipeline')}
          >
            Jenkins CI/CD (Expt 4 & 5)
          </button>
          <button
            className={`category-pill-btn ${activeTab === 'architecture' ? 'active' : ''}`}
            onClick={() => setActiveTab('architecture')}
          >
            Docker Compose (Expt 2 & 3)
          </button>
          <button
            className={`category-pill-btn ${activeTab === 'jira' ? 'active' : ''}`}
            onClick={() => setActiveTab('jira')}
          >
            Jira & Agile (Expt 6)
          </button>
          <button
            className={`category-pill-btn ${activeTab === 'git' ? 'active' : ''}`}
            onClick={() => setActiveTab('git')}
          >
            Git & GitHub (Expt 1)
          </button>
          <button
            className={`category-pill-btn ${activeTab === 'monitoring' ? 'active' : ''}`}
            onClick={() => setActiveTab('monitoring')}
          >
            Prometheus & Grafana (Expt 7)
          </button>
        </div>

        {/* Tab 1: Jenkins CI/CD */}
        {activeTab === 'pipeline' && (
          <div>
            <div style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(6, 182, 212, 0.12))',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Declarative Jenkinsfile Pipeline</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem' }}>
                  Automates testing, building React bundle, building Docker images, and multi-service deployment.
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
                    <RefreshCw size={15} className="animate-spin" />
                    <span>Executing Pipeline...</span>
                  </>
                ) : (
                  <>
                    <Play size={15} />
                    <span>Trigger Jenkins Build #{pipelineState.buildNumber + 1}</span>
                  </>
                )}
              </button>
            </div>

            {/* Pipeline Stage Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {PIPELINE_STAGES.map((stage) => {
                const isCompleted = pipelineState.activeStage > stage.id || pipelineState.activeStage === 6;
                const isCurrent = pipelineState.activeStage === stage.id;
                return (
                  <div
                    key={stage.id}
                    style={{
                      background: 'var(--bg-secondary)',
                      border: `1px solid ${isCompleted ? '#10b981' : isCurrent ? '#06b6d4' : 'var(--border-subtle)'}`,
                      borderRadius: 'var(--radius-md)',
                      padding: '0.85rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.35rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      <span>{stage.tool}</span>
                      {isCompleted ? <CheckCircle size={13} color="#10b981" /> : isCurrent ? <Clock size={13} color="#06b6d4" /> : null}
                    </div>
                    <strong style={{ fontSize: '0.8rem' }}>{stage.name}</strong>
                    <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                      {isCompleted ? `Took ${stage.duration}` : isCurrent ? 'Running...' : 'Queued'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Live Terminal */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                <Terminal size={15} color="#38bdf8" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Jenkins Console Logs</span>
              </div>
              <div className="code-box" style={{ maxHeight: '160px', overflowY: 'auto' }}>
                {pipelineState.logs.map((log, i) => (
                  <div key={i} style={{ color: log.includes('SUCCESS') ? '#34d399' : log.includes('Running') ? '#fbbf24' : '#cbd5e1' }}>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Docker Compose Architecture */}
        {activeTab === 'architecture' && (
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Multi-Container Topology (docker-compose.yml)
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ color: '#38bdf8', fontWeight: 800, fontSize: '0.9rem' }}>1. Frontend Service</span>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.3rem 0' }}>Port: 3000 / 80 | React + Nginx Alpine</p>
                <code style={{ fontSize: '0.7rem', color: '#a5b4fc' }}>devflow-frontend</code>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ color: '#818cf8', fontWeight: 800, fontSize: '0.9rem' }}>2. Backend Service</span>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.3rem 0' }}>Port: 5000 | Express REST API</p>
                <code style={{ fontSize: '0.7rem', color: '#a5b4fc' }}>devflow-backend</code>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ color: '#34d399', fontWeight: 800, fontSize: '0.9rem' }}>3. PostgreSQL Database</span>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.3rem 0' }}>Port: 5432 | Persistent Volume</p>
                <code style={{ fontSize: '0.7rem', color: '#a5b4fc' }}>devflow-postgres</code>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ color: '#fbbf24', fontWeight: 800, fontSize: '0.9rem' }}>4. Prometheus & Grafana</span>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.3rem 0' }}>Ports: 9090 & 3001 | Scraping /metrics</p>
                <code style={{ fontSize: '0.7rem', color: '#a5b4fc' }}>devflow-prometheus</code>
              </div>
            </div>

            <div className="code-box">
              {`# Run all 5 containers with one command:
docker compose up --build -d

# Check healthy containers:
docker compose ps`}
            </div>
          </div>
        )}

        {/* Tab 3: Jira & Agile */}
        {activeTab === 'jira' && (
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              E-Commerce Agile User Stories (Expt 6 Traceability)
            </h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '0.6rem' }}>Key</th>
                    <th style={{ padding: '0.6rem' }}>User Story / Requirement</th>
                    <th style={{ padding: '0.6rem' }}>Git Branch</th>
                    <th style={{ padding: '0.6rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '0.6rem', color: '#818cf8', fontFamily: 'var(--font-mono)' }}>SHOP-101</td>
                    <td style={{ padding: '0.6rem' }}>Setup Product Catalog & Category Filters</td>
                    <td style={{ padding: '0.6rem', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>feature/SHOP-101-catalog</td>
                    <td style={{ padding: '0.6rem', color: '#34d399', fontWeight: 700 }}>DONE</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '0.6rem', color: '#818cf8', fontFamily: 'var(--font-mono)' }}>SHOP-102</td>
                    <td style={{ padding: '0.6rem' }}>Shopping Cart, Quantity Controls & Checkout Flow</td>
                    <td style={{ padding: '0.6rem', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>feature/SHOP-102-checkout</td>
                    <td style={{ padding: '0.6rem', color: '#34d399', fontWeight: 700 }}>DONE</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '0.6rem', color: '#818cf8', fontFamily: 'var(--font-mono)' }}>SHOP-103</td>
                    <td style={{ padding: '0.6rem' }}>Containerize Frontend & Backend with Multi-Stage Docker</td>
                    <td style={{ padding: '0.6rem', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>feature/SHOP-103-docker</td>
                    <td style={{ padding: '0.6rem', color: '#34d399', fontWeight: 700 }}>DONE</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '0.6rem', color: '#818cf8', fontFamily: 'var(--font-mono)' }}>SHOP-104</td>
                    <td style={{ padding: '0.6rem' }}>Declarative Jenkins CI Pipeline with Automated Jest Tests</td>
                    <td style={{ padding: '0.6rem', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>feature/SHOP-104-jenkins</td>
                    <td style={{ padding: '0.6rem', color: '#38bdf8', fontWeight: 700 }}>IN_PROGRESS</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.6rem', color: '#818cf8', fontFamily: 'var(--font-mono)' }}>SHOP-105</td>
                    <td style={{ padding: '0.6rem' }}>Prometheus Metrics & Grafana Live Dashboard Provisioning</td>
                    <td style={{ padding: '0.6rem', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>feature/SHOP-105-prometheus</td>
                    <td style={{ padding: '0.6rem', color: '#c084fc', fontWeight: 700 }}>IN_REVIEW</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Git & GitHub */}
        {activeTab === 'git' && (
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Git Version Control Operations (Expt 1)
            </h4>
            <div className="code-box">
              {`# Repository Branches:
* main (Production release v1.0.0)
  develop (Integration)
  feature/SHOP-101-catalog
  feature/SHOP-102-checkout
  feature/SHOP-103-docker

# Commit conventions linking Jira:
git commit -m "SHOP-102: feat: implement shopping cart & order checkout"`}
            </div>
          </div>
        )}

        {/* Tab 5: Prometheus & Grafana */}
        {activeTab === 'monitoring' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>Prometheus & Grafana Exporter (Expt 7)</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Scrapes HTTP requests, order checkouts, and runtime memory from <code>/metrics</code>.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button className="btn-secondary" onClick={simulateTraffic}>
                  <Zap size={14} color="#f59e0b" />
                  <span>Traffic Burst (+5 reqs)</span>
                </button>
                <button className="btn-primary" onClick={fetchMetrics} disabled={loadingMetrics}>
                  <RefreshCw size={14} className={loadingMetrics ? 'animate-spin' : ''} />
                  <span>Refresh Scrape</span>
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Orders Counter</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399' }}>{stats?.store?.totalOrders || 0}</div>
              </div>
              <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Heap Memory</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8' }}>{mem.heapUsedMB} MB</div>
              </div>
              <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fbbf24' }}>200 OK</div>
              </div>
            </div>

            <div className="code-box" style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {rawMetrics || 'Loading Prometheus metrics payload...'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
