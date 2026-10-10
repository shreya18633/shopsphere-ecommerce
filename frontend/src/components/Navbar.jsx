import React from 'react';
import { Layers, Kanban, GitBranch, Activity, Plus, CheckCircle, AlertCircle, Database } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenCreateModal, healthStatus }) {
  const isHealthy = healthStatus && healthStatus.status === 'UP';

  return (
    <header className="navbar">
      <div className="nav-brand">
        <div className="brand-icon">
          <Layers size={20} color="#ffffff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="brand-title">DevFlow</span>
            <span className="brand-tag">DevOps 7-in-1</span>
          </div>
        </div>
      </div>

      <nav className="nav-tabs">
        <button
          className={`nav-tab-btn ${activeTab === 'kanban' ? 'active' : ''}`}
          onClick={() => setActiveTab('kanban')}
        >
          <Kanban size={16} />
          <span>Kanban Board</span>
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'jira' ? 'active' : ''}`}
          onClick={() => setActiveTab('jira')}
        >
          <Layers size={16} />
          <span>Jira & Sprints (Expt 6)</span>
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'devops' ? 'active' : ''}`}
          onClick={() => setActiveTab('devops')}
        >
          <GitBranch size={16} />
          <span>CI/CD Pipeline (Expt 1-5)</span>
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'monitoring' ? 'active' : ''}`}
          onClick={() => setActiveTab('monitoring')}
        >
          <Activity size={16} />
          <span>Prometheus / Grafana (Expt 7)</span>
        </button>
      </nav>

      <div className="nav-actions">
        <div className="status-indicator" style={{
          backgroundColor: isHealthy ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          borderColor: isHealthy ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
          color: isHealthy ? '#34d399' : '#f87171'
        }}>
          <div className="pulse-dot" style={{ backgroundColor: isHealthy ? '#10b981' : '#ef4444' }} />
          <span>{isHealthy ? `API: UP (${healthStatus.database?.dialect || 'DB'})` : 'Connecting...'}</span>
        </div>

        <button className="btn-primary" onClick={onOpenCreateModal}>
          <Plus size={16} />
          <span>New Issue</span>
        </button>
      </div>
    </header>
  );
}
