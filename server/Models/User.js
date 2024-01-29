const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');

const Ulica = sequelize.define('user', {
    email:{
       primaryKey: true,
       type: DataTypes.STRING,
       allowNull: false,
    },
   firstname:{
    type: DataTypes.STRING,
    allowNull: false,
   },
   lastname:{
    type: DataTypes.STRING,
    allowNull: false,
   },
   password:{
    type: DataTypes.STRING,
    allowNull: false,
   },
   birthdate:{
    type: DataTypes.STRING,
    allowNull: false,
   },
   role: {
      type: String,
      enum: ["", "admin"]
   }
},
{
  timestamps: false, 
  tableName: 'user',
  freezeTableName: true
});

module.exports = Ulica;
