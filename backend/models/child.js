const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Child = sequelize.define('Child', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  edad: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  diagnostico: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tutorNombre: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tutorEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  }
});

module.exports = Child;
