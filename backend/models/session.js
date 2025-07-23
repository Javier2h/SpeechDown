// models/session.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Child = require('./child'); // Importación directa

const Session = sequelize.define('Session', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  palabra: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ejercicio: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Relación directa aquí
Session.belongsTo(Child, { foreignKey: 'childId' });
Child.hasMany(Session, { foreignKey: 'childId' });

module.exports = Session;
