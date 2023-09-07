const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');

const VrstaPosla = sequelize.define('vrstaposla', {
    id:{
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
  tableName: 'vrstaposla',
  freezeTableName: true
});

module.exports = VrstaPosla;
