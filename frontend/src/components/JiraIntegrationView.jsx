import React from 'react';
import { Layers, CheckCircle2, Clock, GitCommit, GitPullRequest, Bookmark, ShieldAlert, Sparkles } from 'lucide-react';

export default function JiraIntegrationView({ tasks }) {
  const sprint1Tasks = tasks.filter(t => t.sprint === 'Sprint 1');
  const sprint2Tasks = tasks.filter(t => t.sprint === 'Sprint 2');
  const backlogTasks = tasks.filter(t => t.sprint === 'Backlog');

  const totalHours = tasks.reduce((acc, t) => acc + (t.estimatedHours || 0), 0);
  const doneHours = tasks.filter(t => t.status === 'DONE').reduce((acc, t) => acc + (t.estimatedHours || 0), 0);
  const completionPercentage = totalHours > 0 ? Math.round((doneHours / totalHours) * 100) : 0;

  return (
    <div>
      <div className="board-header">
        <div className="board-title-group">
          <h1>Jira Agile Project & Product Backlog</h1>
          <p>Scrum workflows, User Stories, Sprint Planning, and Git Smart Commits integration</p>
        </div>
      </div>

      {/* Agile Summary Cards */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon-wrap" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
            <Layers size={24} />
          </div>
          <div>
            <div className="stat-val">{tasks.length}</div>
            <div className="stat-label">Total Jira Issues</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="stat-val">{completionPercentage}%</div>
            <div className="stat-label">Sprint Velocity / Progress</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee' }}>
            <Clock size={24} />
          </div>
          <div>
            <div className="stat-val">{doneHours} / {totalHours} hrs</div>
            <div className="stat-label">Story Effort Logged</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap" style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#fb7185' }}>
            <GitPullRequest size={24} />
          </div>
          <div>
            <div className="stat-val">{tasks.filter(t => t.gitBranch).length}</div>
            <div className="stat-label">Linked Git Branches</div>
          </div>
        </div>
      </div>

      {/* Jira Smart Commits Table */}
      <div style={{ marginTop: '2rem', background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Git & Jira Smart Commits Traceability</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
              How Jira synchronizes with Git: commits prefixed with issue keys automatically link code to Jira stories.
            </p>
          </div>
          <span className="badge-tag" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc' }}>
            Traceability Matrix
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '0.75rem' }}>Issue Key</th>
                <th style={{ padding: '0.75rem' }}>Type</th>
                <th style={{ padding: '0.75rem' }}>Summary</th>
                <th style={{ padding: '0.75rem' }}>Git Branch</th>
                <th style={{ padding: '0.75rem' }}>Commit Ref</th>
                <th style={{ padding: '0.75rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '0.75rem' }}>
                    <span className="issue-badge">{t.issueKey}</span>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <span className="type-pill">{t.type}</span>
                  </td>
                  <td style={{ padding: '0.75rem', fontWeight: 600 }}>{t.title}</td>
                  <td style={{ padding: '0.75rem', fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>
                    {t.gitBranch || 'main'}
                  </td>
                  <td style={{ padding: '0.75rem', fontFamily: 'var(--font-mono)', color: '#c084fc' }}>
                    {t.gitCommit ? `git#${t.gitCommit}` : 'Pending PR'}
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <span className={`priority-badge priority-${t.priority}`}>{t.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Jira Agile Setup Guide */}
      <div style={{ marginTop: '2rem', background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Agile Engineering Practice: Jira in CI/CD Pipelines
        </h3>
        <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.7' }}>
          <li><strong>Role in SDLC:</strong> Jira coordinates backlog management, sprint planning, task assignments, and progress velocity for cross-functional agile teams.</li>
          <li><strong>DevOps Integration:</strong> Through the Jira GitHub/Jenkins integration, commits using the format <code>DEV-101: feat: add docker container</code> automatically advance the ticket status, update burndown charts, and link Jenkins build artifacts.</li>
          <li><strong>Traceability:</strong> Enables complete audit trails from requirement user story &rarr; Git commit &rarr; Docker build &rarr; Jenkins deployment &rarr; production monitoring alert.</li>
        </ul>
      </div>
    </div>
  );
}
