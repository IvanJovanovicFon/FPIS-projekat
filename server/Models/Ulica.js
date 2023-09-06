const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');

const Ulica = sequelize.define('ulica', {
    id:{
       primaryKey: true,
       type: DataTypes.INTEGER,
       allowNull: false,
    },
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
  tableName: 'ulica',
  freezeTableName: true
});

module.exports = Ulica;
