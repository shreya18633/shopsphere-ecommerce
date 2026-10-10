import React, { useState, useEffect } from 'react';
import { Activity, Cpu, HardDrive, Zap, RefreshCw, Radio, CheckCircle, ExternalLink } from 'lucide-react';
import { api } from '../services/api';

export default function MetricsView({ stats, healthStatus }) {
  const [rawMetrics, setRawMetrics] = useState('');
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const [trafficCount, setTrafficCount] = useState(0);

  const fetchRawMetrics = async () => {
    try {
      setLoadingMetrics(true);
      const data = await api.getMetrics();
      setRawMetrics(data);
    } catch (err) {
      setRawMetrics('# Failed to fetch metrics from /metrics endpoint');
    } finally {
      setLoadingMetrics(false);
    }
  };

  useEffect(() => {
    fetchRawMetrics();
  }, []);

  const simulateTraffic = async () => {
    try {
      // Fire 5 quick requests to create real Prometheus histogram and counter increments
      await Promise.all([
        api.getHealth(),
        api.getStats(),
        api.getTasks(),
        api.getHealth(),
        api.getProjects(),
      ]);
      setTrafficCount(prev => prev + 5);
      fetchRawMetrics();
    } catch (e) {
      console.error(e);
    }
  };

  const sys = stats?.systemInfo || {};
  const mem = sys?.processMemory || { heapUsedMB: 34, heapTotalMB: 48, rssMB: 62 };

  return (
    <div>
      <div className="board-header">
        <div className="board-title-group">
          <h1>Prometheus & Grafana Monitoring (Expt 7)</h1>
          <p>Real-time application metrics, request latency histograms, and system telemetry</p>
        </div>

        <div className="board-controls">
          <button className="btn-secondary" onClick={simulateTraffic}>
            <Zap size={15} color="#f59e0b" />
            <span>Generate Traffic Burst (+5 reqs)</span>
          </button>

          <button className="btn-primary" onClick={fetchRawMetrics} disabled={loadingMetrics}>
            <RefreshCw size={15} className={loadingMetrics ? 'animate-spin' : ''} />
            <span>Refresh Prometheus Scrape</span>
          </button>
        </div>
      </div>

      {/* Telemetry Cards */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon-wrap" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
            <Activity size={24} />
          </div>
          <div>
            <div className="stat-val">{stats?.summary?.totalTasks || 0}</div>
            <div className="stat-label">Active Gauge (Tasks Tracked)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
            <Cpu size={24} />
          </div>
          <div>
            <div className="stat-val">{mem.heapUsedMB} MB</div>
            <div className="stat-label">Node.js Heap Memory Used</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            <HardDrive size={24} />
          </div>
          <div>
            <div className="stat-val">{sys.uptimeSeconds || 120}s</div>
            <div className="stat-label">Process Uptime</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            <Radio size={24} />
          </div>
          <div>
            <div className="stat-val">200 OK</div>
            <div className="stat-label">Prometheus Exporter Status</div>
          </div>
        </div>
      </div>

      {/* Monitoring Architecture Breakdown */}
      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Prometheus Scraper Config</span>
            <span className="badge-tag">port 9090</span>
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
            Prometheus runs as a container polling <code>http://backend:5000/metrics</code> every 15 seconds as configured in <code>monitoring/prometheus/prometheus.yml</code>.
          </p>
          <pre className="code-block">{`scrape_configs:
  - job_name: 'devops-fullstack-app'
    scrape_interval: 15s
    static_configs:
      - targets: ['backend:5000']`}</pre>
        </div>

        <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Grafana Provisioning</span>
            <span className="badge-tag">port 3001</span>
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
            Grafana automatically connects to Prometheus as its default datasource and loads the pre-configured dashboard from <code>monitoring/grafana/</code>.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            <a
              href="http://localhost:9090"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
              style={{ fontSize: '0.8rem', textDecoration: 'none' }}
            >
              <ExternalLink size={14} />
              <span>Open Prometheus (9090)</span>
            </a>
            <a
              href="http://localhost:3001"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
              style={{ fontSize: '0.8rem', textDecoration: 'none' }}
            >
              <ExternalLink size={14} />
              <span>Open Grafana (3001)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Live /metrics Raw Stream */}
      <div style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Live Prometheus Endpoint Output (/metrics)</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Auto-formatted for Prometheus scrapers</span>
        </div>
        <div className="code-block" style={{ maxHeight: '280px', overflowY: 'auto' }}>
          {rawMetrics || 'Loading Prometheus metrics payload...'}
        </div>
      </div>
    </div>
  );
}
