
const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');

const User = sequelize.define('Izvodjac', {
    PIB: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  naziv: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  tekuciRacun: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  sifra: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imeIprezime: {
    type: DataTypes.STRING,
    allowNull: false
  },
  jmbg: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  mesto: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ulica: {
    type: DataTypes.STRING,
    allowNull: false
  },
  broj: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Izvodjac;
