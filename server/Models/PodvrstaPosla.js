const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');

const PodvrstaPosla = sequelize.define('podvrstaposla', {
    id:{
       primaryKey: true,
       type: DataTypes.STRING,
       allowNull: false,
    },
    idVrstaPosla:{
        primaryKey: true,
        type: DataTypes.STRING,
        allowNull: false,
     },
    naziv: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  }
},
{
  timestamps: false, 
  tableName: 'podvrstaposla',
  freezeTableName: true
});

module.exports = PodvrstaPosla;