const crypto = require('crypto').randomBytes(256).toString('hex'); 

module.exports = {
    uri: 'mongodb://localhost:27017/User-database', // Databse URI and database name
    db: 'User-database',
    secret:crypto
  }