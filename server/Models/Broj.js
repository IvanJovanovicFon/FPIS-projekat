const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');

const Broj = sequelize.define('broj', {
    idUlice:{
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
   broj:{
    primaryKey: true,
    type: DataTypes.STRING,
    allowNull: false,
   }
},
{
  timestamps: false, 
  tableName: 'broj',
  freezeTableName: true
});

module.exports = Broj;
