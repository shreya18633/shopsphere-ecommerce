const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  lead: {
    type: DataTypes.STRING,
    defaultValue: 'DevOps Lead',
  },
  status: {
    type: DataTypes.ENUM('Active', 'Planning', 'Completed'),
    defaultValue: 'Active',
  },
}, {
  timestamps: true,
});

module.exports = Project;
