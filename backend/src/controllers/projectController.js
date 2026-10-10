const Project = require('../models/Project');
const Task = require('../models/Task');

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: [{ model: Task, attributes: ['id', 'status', 'priority'] }],
    });
    res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [Task],
    });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createProject = async (req, res) => {
  try {
    const { key, name, description, lead, status } = req.body;
    if (!key || !name) {
      return res.status(400).json({ success: false, message: 'Key and name are required' });
    }

    const project = await Project.create({
      key: key.toUpperCase(),
      name,
      description,
      lead: lead || 'DevOps Lead',
      status: status || 'Active',
    });
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
