const express = require('express');
const path = require('path');
const roomRoutes = require('./routes/roomRoutes');

const port = process.env.PORT || 5006;

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());

app.get('/', (req, res) => {
  res.render('pages/index');
});

app.use('/', roomRoutes);

const server = app.listen(port, () => {
  console.log(`Listening on ${port}`);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: gracefully shutting down');
  if (server) {
    server.close(() => {
      console.log('HTTP server closed');
    });
  }
});

const { Client } = require('pg');

const client = new Client({
  connectionString: "postgres://u77jeiqtv7et73:pd2019c6f01ba0ab35f6e444c04278f4ab1cb2e1e53873933d296c9a933619ef0@ccba8a0vn4fb2p.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com:5432/d9bacstqoltq50",
  ssl: {
    rejectUnauthorized: false
  }
});

client.query(`
  CREATE TABLE IF NOT EXISTS Rooms_Web3 (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    moderator VARCHAR(255) NOT NULL,
    current_task VARCHAR(255) DEFAULT 'Task 1',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS Players_Web3 (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    room_id INT NOT NULL,
    point VARCHAR(10) DEFAULT '?',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES Rooms_Web3(id) ON DELETE CASCADE
  );
`, (err, res) => {
  if (err) throw err;
  console.log('Tables are successfully created');
});

// client.query(`
//   SELECT table_schema, table_name 
//   FROM information_schema.tables 
//   WHERE table_name IN ('Rooms', 'Players');
// `, (err, res) => {
//   if (err) throw err;
//   for (let row of res.rows) {
//     console.log(JSON.stringify(row));
//   }
//   client.end();
// });

client.connect();