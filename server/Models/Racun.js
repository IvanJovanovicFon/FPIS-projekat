
const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');

const Racun = sequelize.define('racun', {
  id: {
    primaryKey: true,
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
    idIzvodjac: {
    type: DataTypes.STRING,
    allowNull: false
  },
  idPredracun: {
    type: DataTypes.STRING,
    allowNull: false
  },
  brojRacuna: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  objekat: {
    type: DataTypes.STRING,
    allowNull: false
  },
  realizacija: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  datumIspostavljanja: {
    type: DataTypes.DATE,
    allowNull: false,

  },
  datumIzdavanja: {
    type: DataTypes.DATE,
    allowNull: false,
 
  },
  datumPrometaDobaraIUsluga: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  ukupnaCena: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  investitor: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mesto: {
    type: DataTypes.STRING,
    allowNull: false
  },
  idUlica: {
    type: DataTypes.STRING,
    allowNull: false
  },
  brojUlice: {
    type: DataTypes.STRING,
    allowNull: false
  },
},
{
  timestamps: false, 
  tableName: 'racun',
  freezeTableName: true
});

module.exports = Racun;
