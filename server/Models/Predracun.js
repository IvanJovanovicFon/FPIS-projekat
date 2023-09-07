const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');

const Predracun = sequelize.define('predracun', {
    id:{
       primaryKey: true,
       type: DataTypes.STRING,
       allowNull: false,
    },
    idIzvodjac: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
   ukupnaCena:{
    type: DataTypes.DOUBLE,
    allowNull: false,
   }
},
{
  timestamps: false, 
  tableName: 'predracun',
  freezeTableName: true
});

module.exports = Predracun;
