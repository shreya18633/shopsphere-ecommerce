import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import KanbanBoard from './components/KanbanBoard';
import DevOpsDashboard from './components/DevOpsDashboard';
import JiraIntegrationView from './components/JiraIntegrationView';
import MetricsView from './components/MetricsView';
import TaskModal from './components/TaskModal';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('kanban');
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [healthStatus, setHealthStatus] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load Initial Data
  const loadData = async () => {
    try {
      const [tasksRes, statsRes, healthRes] = await Promise.allSettled([
        api.getTasks(),
        api.getStats(),
        api.getHealth(),
      ]);

      if (tasksRes.status === 'fulfilled') {
        setTasks(tasksRes.value.data || []);
      }
      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value.data || null);
      }
      if (healthRes.status === 'fulfilled') {
        setHealthStatus(healthRes.value || null);
      }
    } catch (err) {
      console.error('Failed to load application data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Poll health & stats every 10 seconds for real-time monitoring
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Task Status Update (Move across columns)
  const handleStatusChange = async (id, newStatus) => {
    try {
      // Optimistic update in UI
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
      await api.updateTaskStatus(id, newStatus);
      loadData();
    } catch (err) {
      console.error('Failed to update status:', err);
      loadData(); // Revert on failure
    }
  };

  // Create or Update Task
  const handleSaveTask = async (formData) => {
    try {
      if (taskToEdit) {
        await api.updateTask(taskToEdit.id, formData);
      } else {
        await api.createTask(formData);
      }
      setIsModalOpen(false);
      setTaskToEdit(null);
      await loadData();
    } catch (err) {
      console.error('Failed to save task:', err);
      alert('Error saving task: ' + err.message);
    }
  };

  // Delete Task
  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this issue?')) return;
    try {
      setTasks(prev => prev.filter(t => t.id !== id));
      await api.deleteTask(id);
      loadData();
    } catch (err) {
      console.error('Failed to delete task:', err);
      loadData();
    }
  };

  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleOpenCreateModal = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  return (
    <div className="app-container">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCreateModal={handleOpenCreateModal}
        healthStatus={healthStatus}
      />

      <main className="main-content">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-secondary)' }}>
            <div className="pulse-dot" style={{ margin: '0 auto 1rem', width: '16px', height: '16px' }} />
            <p>Connecting to DevOps Backend & Database...</p>
          </div>
        ) : (
          <>
            {activeTab === 'kanban' && (
              <KanbanBoard
                tasks={tasks}
                onStatusChange={handleStatusChange}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onOpenCreateModal={handleOpenCreateModal}
              />
            )}

            {activeTab === 'jira' && (
              <JiraIntegrationView tasks={tasks} />
            )}

            {activeTab === 'devops' && (
              <DevOpsDashboard
                stats={stats}
                healthStatus={healthStatus}
              />
            )}

            {activeTab === 'monitoring' && (
              <MetricsView
                stats={stats}
                healthStatus={healthStatus}
              />
            )}
          </>
        )}
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
      />
    </div>
  );
}
