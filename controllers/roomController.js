const { Client } = require('pg');

const client = new Client({
  connectionString: "postgres://u77jeiqtv7et73:pd2019c6f01ba0ab35f6e444c04278f4ab1cb2e1e53873933d296c9a933619ef0@ccba8a0vn4fb2p.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com:5432/d9bacstqoltq50",
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

// const client = require('../index');

class RoomController {
  async getRoom(req, res) {
    const { room } = req.query;
    try {
      const roomResult = await client.query('SELECT * FROM Rooms WHERE name = $1', [room]);
      if (roomResult.rows.length === 0) {
        return res.status(404).json({ error: 'Room not found' });
      }
      const roomData = roomResult.rows[0];
      const playersResult = await client.query('SELECT name, point FROM Players WHERE room_id = $1', [roomData.id]);
      roomData.players = playersResult.rows;
      res.status(200).json(roomData);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async createRoom(req, res) {
    const { room, moderator } = req.query;
    try {
      const roomResult = await client.query(
        'INSERT INTO Rooms (name, moderator) VALUES ($1, $2) RETURNING *',
        [room, moderator]
      );
      const roomData = roomResult.rows[0];
      await client.query(
        'INSERT INTO Players (name, room_id) VALUES ($1, $2)',
        [moderator, roomData.id]
      );
      roomData.players = [{ name: moderator, point: "?" }];
      res.status(200).json(roomData);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async removePlayer(req, res) {
    const { room, player } = req.query;
    try {
      const roomResult = await client.query('SELECT id FROM Rooms WHERE name = $1', [room]);
      if (roomResult.rows.length === 0) {
        return res.status(404).json({ error: 'Room not found' });
      }
      const roomId = roomResult.rows[0].id;
      await client.query('DELETE FROM Players WHERE name = $1 AND room_id = $2', [player, roomId]);
      const playersResult = await client.query('SELECT name, point FROM Players WHERE room_id = $1', [roomId]);
      res.status(200).json({ name: room, currentTask: "Task 1", moderator: roomResult.rows[0].moderator, players: playersResult.rows });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async resetVotes(req, res) {
    const { room } = req.query;
    try {
      const roomResult = await client.query('SELECT id FROM Rooms WHERE name = $1', [room]);
      if (roomResult.rows.length === 0) {
        return res.status(404).json({ error: 'Room not found' });
      }
      const roomId = roomResult.rows[0].id;
      await client.query('UPDATE Players SET point = "?" WHERE room_id = $1', [roomId]);
      const playersResult = await client.query('SELECT name, point FROM Players WHERE room_id = $1', [roomId]);
      res.status(200).json({ name: room, currentTask: "Task 1", moderator: roomResult.rows[0].moderator, players: playersResult.rows });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async sendVote(req, res) {
    const { room, player } = req.query;
    const { vote } = req.body;
    try {
      const roomResult = await client.query('SELECT id FROM Rooms WHERE name = $1', [room]);
      if (roomResult.rows.length === 0) {
        return res.status(404).json({ error: 'Room not found' });
      }
      const roomId = roomResult.rows[0].id;
      await client.query('UPDATE Players SET point = $1 WHERE name = $2 AND room_id = $3', [vote, player, roomId]);
      const playersResult = await client.query('SELECT name, point FROM Players WHERE room_id = $1', [roomId]);
      res.status(200).json({ name: room, currentTask: "Task 1", moderator: roomResult.rows[0].moderator, players: playersResult.rows });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async joinRoom(req, res) {
    const { room, player } = req.query;
    try {
      const roomResult = await client.query('SELECT id FROM Rooms WHERE name = $1', [room]);
      if (roomResult.rows.length === 0) {
        return res.status(404).json({ error: 'Room not found' });
      }
      const roomId = roomResult.rows[0].id;
      await client.query('INSERT INTO Players (name, room_id) VALUES ($1, $2)', [player, roomId]);
      const playersResult = await client.query('SELECT name, point FROM Players WHERE room_id = $1', [roomId]);
      res.status(200).json({ name: room, currentTask: "Task 1", moderator: roomResult.rows[0].moderator, players: playersResult.rows });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new RoomController();