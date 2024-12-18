const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgres://u287lc3durc8fe:p51cd5af28a35dabe56de2198085fe56b037df90b5b390c7e98c269f70f5d534c@cfls9h51f4i86c.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com:5432/dfe1v0oj3rbfqs',
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect()
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Database connection error', err.stack));

module.exports = client;