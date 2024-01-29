const { Sequelize } = require('sequelize');


const databaseName = 'fpis';
const username = 'ivan';
const password = 'ivan';
const host = 'localhost'; 

const sequelize = new Sequelize(databaseName, username, password, {
  host: host,
  dialect: 'mysql'
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;