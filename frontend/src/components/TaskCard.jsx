import React from 'react';
import { ChevronLeft, ChevronRight, GitBranch, GitCommit, Trash2, Edit2, User, Clock } from 'lucide-react';

const STATUS_ORDER = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];

export default function TaskCard({ task, onStatusChange, onEdit, onDelete }) {
  const currentIndex = STATUS_ORDER.indexOf(task.status);
  const canMoveLeft = currentIndex > 0;
  const canMoveRight = currentIndex < STATUS_ORDER.length - 1;

  const handleMoveLeft = (e) => {
    e.stopPropagation();
    if (canMoveLeft) {
      onStatusChange(task.id, STATUS_ORDER[currentIndex - 1]);
    }
  };

  const handleMoveRight = (e) => {
    e.stopPropagation();
    if (canMoveRight) {
      onStatusChange(task.id, STATUS_ORDER[currentIndex + 1]);
    }
  };

  return (
    <div className="task-card" onClick={() => onEdit(task)}>
      <div className="card-top">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="issue-badge">{task.issueKey}</span>
          <span className="type-pill">{task.type}</span>
        </div>
        <span className={`priority-badge priority-${task.priority}`}>
          {task.priority}
        </span>
      </div>

      <h4 className="card-title">{task.title}</h4>
      
      {task.description && (
        <p className="card-description">{task.description}</p>
      )}

      <div className="card-meta">
        {task.gitBranch && (
          <span className="meta-chip branch" title={`Git Branch: ${task.gitBranch}`}>
            <GitBranch size={12} />
            <span>{task.gitBranch.replace('feature/', '')}</span>
          </span>
        )}
        {task.gitCommit && (
          <span className="meta-chip" title={`Git Commit Hash: ${task.gitCommit}`}>
            <GitCommit size={12} />
            <span style={{ fontFamily: 'var(--font-mono)' }}>{task.gitCommit}</span>
          </span>
        )}
      </div>

      <div className="card-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <User size={13} color="var(--text-muted)" />
          <span>{task.assignee}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div className="column-move-actions">
            {canMoveLeft && (
              <button
                className="move-btn"
                title={`Move to ${STATUS_ORDER[currentIndex - 1]}`}
                onClick={handleMoveLeft}
              >
                <ChevronLeft size={14} />
              </button>
            )}
            {canMoveRight && (
              <button
                className="move-btn"
                title={`Move to ${STATUS_ORDER[currentIndex + 1]}`}
                onClick={handleMoveRight}
              >
                <ChevronRight size={14} />
              </button>
            )}
          </div>
          
          <button
            className="move-btn"
            title="Delete Task"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
