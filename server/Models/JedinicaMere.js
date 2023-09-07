const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');

const Mere = sequelize.define('jedinice-mere', {
  oznaka: {
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
  tableName: 'jedinice-mere',
  freezeTableName: true
});

module.exports = Mere;
