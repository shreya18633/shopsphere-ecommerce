import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function TaskModal({ isOpen, onClose, onSave, taskToEdit }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    type: 'TASK',
    sprint: 'Sprint 1',
    assignee: 'DevOps Engineer',
    estimatedHours: 4,
    gitBranch: '',
    gitCommit: '',
  });

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title || '',
        description: taskToEdit.description || '',
        status: taskToEdit.status || 'TODO',
        priority: taskToEdit.priority || 'MEDIUM',
        type: taskToEdit.type || 'TASK',
        sprint: taskToEdit.sprint || 'Sprint 1',
        assignee: taskToEdit.assignee || 'DevOps Engineer',
        estimatedHours: taskToEdit.estimatedHours || 4,
        gitBranch: taskToEdit.gitBranch || '',
        gitCommit: taskToEdit.gitCommit || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'TODO',
        priority: 'MEDIUM',
        type: 'TASK',
        sprint: 'Sprint 1',
        assignee: 'DevOps Engineer',
        estimatedHours: 4,
        gitBranch: '',
        gitCommit: '',
      });
    }
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {taskToEdit ? `Edit Issue: ${taskToEdit.issueKey}` : 'Create New Issue (Jira Workflow)'}
          </h3>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Issue Summary / Title *</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g., Configure Prometheus Alertmanager rules"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description & Acceptance Criteria</label>
            <textarea
              rows={3}
              className="form-textarea"
              placeholder="Describe requirement, scope, or reproduction steps..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Issue Type</label>
              <select
                className="form-select"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="TASK">Task</option>
                <option value="STORY">User Story</option>
                <option value="BUG">Bug</option>
                <option value="DEVOPS">DevOps Epic</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-select"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Status Column</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="DONE">Done</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Sprint</label>
              <select
                className="form-select"
                value={formData.sprint}
                onChange={(e) => setFormData({ ...formData, sprint: e.target.value })}
              >
                <option value="Sprint 1">Sprint 1</option>
                <option value="Sprint 2">Sprint 2</option>
                <option value="Backlog">Backlog</option>
              </select>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Assignee</label>
              <input
                type="text"
                className="form-input"
                placeholder="DevOps Lead / SRE"
                value={formData.assignee}
                onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Git Branch</label>
              <input
                type="text"
                className="form-input"
                placeholder="feature/issue-key"
                value={formData.gitBranch}
                onChange={(e) => setFormData({ ...formData, gitBranch: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {taskToEdit ? 'Save Changes' : 'Create Issue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
