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
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.query(`
  CREATE TABLE IF NOT EXISTS Rooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    moderator VARCHAR(255) NOT NULL,
    current_task VARCHAR(255) DEFAULT 'Task 1',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS Players (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    room_id INT NOT NULL,
    point VARCHAR(10) DEFAULT '?',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES Rooms(id) ON DELETE CASCADE
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