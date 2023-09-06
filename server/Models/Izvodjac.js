
const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');

const Izvodjac = sequelize.define('izvodjaci', {
  id: {
    primaryKey: true,
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
    pib: {
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
  },
},
{
  timestamps: false, 
  tableName: 'izvodjaci',
  freezeTableName: true
});

module.exports = Izvodjac;
