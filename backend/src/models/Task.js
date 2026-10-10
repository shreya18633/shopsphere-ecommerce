const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Project = require('./Project');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  issueKey: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'),
    defaultValue: 'TODO',
  },
  priority: {
    type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
    defaultValue: 'MEDIUM',
  },
  type: {
    type: DataTypes.ENUM('STORY', 'TASK', 'BUG', 'DEVOPS'),
    defaultValue: 'TASK',
  },
  sprint: {
    type: DataTypes.STRING,
    defaultValue: 'Sprint 1',
  },
  assignee: {
    type: DataTypes.STRING,
    defaultValue: 'DevOps Engineer',
  },
  estimatedHours: {
    type: DataTypes.FLOAT,
    defaultValue: 4.0,
  },
  gitBranch: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  gitCommit: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
});

Project.hasMany(Task, { foreignKey: { name: 'projectId', allowNull: true }, onDelete: 'CASCADE' });
Task.belongsTo(Project, { foreignKey: { name: 'projectId', allowNull: true } });

module.exports = Task;
