const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');

const Mesto = sequelize.define('mesto', {
  ptt: {
    primaryKey: true,
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
   naziv:{
    type: DataTypes.STRING,
    allowNull: false,
   }
},
{
  timestamps: false, 
  tableName: 'mesto',
  freezeTableName: true
});

module.exports = Mesto;
