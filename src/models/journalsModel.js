const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Journal = sequelize.define('Journal', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('금연', '금주'),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING(50),
    allowNull: false,
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'journals',
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'date', 'type'],
      name: 'unique_user_date_type',
    },
  ],
});

module.exports = Journal;
