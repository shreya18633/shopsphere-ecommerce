const Task = require('../models/Task');
const Project = require('../models/Project');
const { tasksGauge } = require('../middleware/metricsMiddleware');

// Helper to refresh Prometheus gauge for task metrics
const updateMetricsGauges = async () => {
  try {
    const statuses = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];
    for (const status of statuses) {
      const count = await Task.count({ where: { status } });
      tasksGauge.set({ status }, count);
    }
  } catch (err) {
    // Non-critical background metric update failure
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const { status, priority, sprint, search } = req.query;
    const where = {};

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (sprint) where.sprint = sprint;

    let tasks = await Task.findAll({
      where,
      include: [{ model: Project, attributes: ['key', 'name'] }],
      order: [['updatedAt', 'DESC']],
    });

    if (search) {
      const q = search.toLowerCase();
      tasks = tasks.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.issueKey.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q))
      );
    }

    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [{ model: Project, attributes: ['key', 'name'] }],
    });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, status, priority, type, sprint, assignee, estimatedHours, projectId, gitBranch, gitCommit } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    // Auto-generate Jira-style Issue Key if not provided
    const count = await Task.count();
    const issueKey = req.body.issueKey || `DEV-${101 + count}`;

    let targetProjectId = projectId || null;
    if (targetProjectId) {
      const proj = await Project.findByPk(targetProjectId);
      if (!proj) targetProjectId = null;
    }

    const task = await Task.create({
      issueKey,
      title,
      description,
      status: status || 'TODO',
      priority: priority || 'MEDIUM',
      type: type || 'TASK',
      sprint: sprint || 'Sprint 1',
      assignee: assignee || 'DevOps Engineer',
      estimatedHours: estimatedHours || 4.0,
      projectId: targetProjectId,
      gitBranch: gitBranch || `feature/${issueKey.toLowerCase()}-impl`,
      gitCommit: gitCommit || null,
    });

    await updateMetricsGauges();
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    await task.update(req.body);
    await updateMetricsGauges();
    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    await task.update({ status });
    await updateMetricsGauges();
    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    await task.destroy();
    await updateMetricsGauges();
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
