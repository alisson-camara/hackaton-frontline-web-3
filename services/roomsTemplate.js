
const DatabaseService = require('./dbServices')

class RoomService {

    constructor(){
        this.dbServices = new DatabaseService();
    }
  /**
   * Create a new room
   * @param {string} name - Name of the room
   * @param {number} moderatorId - ID of the moderator (must reference a user)
   */
  async createRoom(name, moderatorId) {
    const query = `
      INSERT INTO Rooms_Web3 (name, moderator)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const values = [name, moderatorId];
    try {
      const result = await this.dbServices.query(query, values);
      return result.rows[0];
    } catch (err) {
      console.error('Error creating room:', err);
      throw err;
    }
  }

  /**
   * Get a room by name
   * @param {string} name - Name of the room
   */
  async getRoomByName(name) {
    const query = `
      SELECT r.id, r.name, r.current_task, u.name AS moderator, r.created_at
      FROM Rooms_Web3 r
      INNER JOIN Players_Web3 u ON r.moderator = u.name
      WHERE r.name = $1;
    `;
    try {
      const result = await this.dbServices.query(query, [name]);
      return result.rows[0];
    } catch (err) {
      console.error('Error fetching room:', err);
      throw err;
    }
  }

  /**
   * Delete a room by name
   * @param {string} name - Name of the room
   */
  async deleteRoomByName(name) {
    const query = `
      DELETE FROM Rooms_Web3
      WHERE name = $1
      RETURNING *;
    `;
    try {
      const result = await this.dbServices.query(query, [name]);
      return result.rows[0];
    } catch (err) {
      console.error('Error deleting room:', err);
      throw err;
    }
  }

  /**
   * Get all rooms
   */
  async getAllRooms() {
    const query = `
      SELECT r.id, r.name, r.current_task, u.name AS moderator, r.created_at
      FROM Rooms_Web3 r
      INNER JOIN Users u ON r.moderator = u.id;
    `;
    try {
      const result = await this.dbServices.query(query);
      return result.rows;
    } catch (err) {
      console.error('Error fetching all rooms:', err);
      throw err;
    }
  }
}

module.exports = RoomService;