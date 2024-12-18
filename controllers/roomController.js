const RoomService = require('../services/roomsTemplate')
const PlayerService = require('../services/playerTemplate');

class RoomController {
  constructor(){
    this.roomService = new RoomService();
    this.playerService = new PlayerService();
  }
  async getRoom(req, res) {
    const { room } = req.query;
    try {
      const roomData = await this.roomService.getRoomByName(room);
      if (roomData === 0) {
        return res.status(404).json({ error: 'Room not found' });
      }
      const playersResult = await this.playerService.getPlayers(roomData.id);
      roomData.players = playersResult;

      res.status(200).json(roomData);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async createRoom(req, res) {
    const { room, moderator } = req.query;
    
    try {
      const roomData = await this.roomService.createRoom(room, moderator);      
      const playerResult = await this.playerService.createPlayer(moderator, roomData.id, `?`); 
      roomData.players = [playerResult];
      res.status(200).json(roomData);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }

  async removePlayer(req, res) {
    const { room, player } = req.query;
    try {
      const roomResult = await this.roomService.getRoomByName(room);
      
      if (!roomResult) {
        return res.status(404).json({ error: 'Room not found' });
      }
      
      const roomId = roomResult.id;
      await this.playerService.removePlayer(player, roomId);

      const playersResult = await this.playerService.getPlayers(roomId);

      res.status(200).json({ name: room, currentTask: "Task 1", moderator: roomResult.moderator, players: playersResult });
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