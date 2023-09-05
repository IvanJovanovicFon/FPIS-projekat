const mysql = require('mysql');


const pool = mysql.createPool({
  host: 'your-database-host',
  user: 'ivan',
  password:"" ,
  database: 'fpis',
  connectionLimit: 5, 
});


function query(sql, values) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        return reject(err);
      }
      connection.query(sql, values, (error, results) => {
        connection.release(); // Release the connection when done
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });
  });
}

module.exports = {
  query,
};