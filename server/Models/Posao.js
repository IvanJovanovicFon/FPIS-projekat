
const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');

const Posao = sequelize.define('posao', {
  id: {
    primaryKey: true,
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
    idRacun: {
    type: DataTypes.STRING,
    allowNull: false
  },
  idVrstaPosla: {
    type: DataTypes.STRING,
    allowNull: false
  },
  idPodvrstaPosla: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  oznakaJednicaMere: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cena: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  kolicina: {
    type: DataTypes.DOUBLE,
    allowNull: false,

  },
  opis: {
    type: DataTypes.string,
    allowNull: false,

  }
},
{
  timestamps: false, 
  tableName: 'posao',
  freezeTableName: true
});

module.exports = Posao;
