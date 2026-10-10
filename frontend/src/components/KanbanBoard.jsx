import React, { useState } from 'react';
import TaskCard from './TaskCard';
import { Search, Filter, Plus, CheckCircle2, ListTodo, PlayCircle, Eye } from 'lucide-react';

const COLUMNS = [
  { id: 'TODO', title: 'To Do', dotClass: 'todo', icon: ListTodo },
  { id: 'IN_PROGRESS', title: 'In Progress', dotClass: 'in_progress', icon: PlayCircle },
  { id: 'IN_REVIEW', title: 'In Review', dotClass: 'in_review', icon: Eye },
  { id: 'DONE', title: 'Done', dotClass: 'done', icon: CheckCircle2 },
];

export default function KanbanBoard({ tasks, onStatusChange, onEditTask, onDeleteTask, onOpenCreateModal }) {
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [sprintFilter, setSprintFilter] = useState('ALL');

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.issueKey.toLowerCase().includes(search.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(search.toLowerCase()));

    const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;
    const matchesSprint = sprintFilter === 'ALL' || task.sprint === sprintFilter;

    return matchesSearch && matchesPriority && matchesSprint;
  });

  return (
    <div>
      <div className="board-header">
        <div className="board-title-group">
          <h1>Agile Sprint Board</h1>
          <p>Real-time issue tracking synchronized with Git branches, Docker builds, and Jenkins CI</p>
        </div>

        <div className="board-controls">
          <input
            type="text"
            className="search-input"
            placeholder="Search by title, key, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="filter-select"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select
            className="filter-select"
            value={sprintFilter}
            onChange={(e) => setSprintFilter(e.target.value)}
          >
            <option value="ALL">All Sprints</option>
            <option value="Sprint 1">Sprint 1</option>
            <option value="Sprint 2">Sprint 2</option>
            <option value="Backlog">Backlog</option>
          </select>

          <button className="btn-secondary" onClick={onOpenCreateModal}>
            <Plus size={15} />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      <div className="kanban-grid">
        {COLUMNS.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);
          const ColIcon = col.icon;

          return (
            <div key={col.id} className="kanban-column">
              <div className="column-header">
                <div className="column-title-wrap">
                  <span className={`column-dot ${col.dotClass}`} />
                  <span className="column-name">{col.title}</span>
                </div>
                <span className="column-count">{colTasks.length}</span>
              </div>

              <div className="task-list">
                {colTasks.length === 0 ? (
                  <div style={{
                    padding: '2rem 1rem',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '0.825rem',
                    border: '1px dashed var(--border-subtle)',
                    borderRadius: 'var(--radius-md)'
                  }}>
                    No tasks in {col.title}
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onStatusChange={onStatusChange}
                      onEdit={onEditTask}
                      onDelete={onDeleteTask}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
