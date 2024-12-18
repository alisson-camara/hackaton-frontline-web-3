
const client = require('../dbConnection');

class PlayerService {

    /**
     * 
     * @param {string} moderator 
     * @param {Number} roomDataId 
     * @param {string} points
     */
    async createPlayer(moderator, roomDataId, points) {
        const query = 'INSERT INTO Players_Web3 (name, room_id, point) VALUES ($1, $2, $3) RETURNING *;';
        const values = [moderator, roomDataId, points];

        try {
            const result = await client.query(query, values);
            return result.rows[0];
        } catch (err) {
            console.error('Error creating room:', err);
            throw err;
        }
    }

    async removePlayer(playerName, roomDataId) {
        const query = 'DELETE FROM Players_Web3 WHERE name = $1 AND room_id = $2;';
        const values = [playerName, roomDataId];

        try {
            const result = await client.query(query, values);
            return result.rows[0];
        } catch (err) {
            console.error('Error deleting player:', err);
            throw err;
        }
    }
    
    async getPlayers(roomDataId) {
        const query = 'SELECT name,point FROM Players_Web3 WHERE room_id = $1;';
        const values = [roomDataId];

        try {
            const result = await client.query(query, values);
            return result.rows;
        } catch (err) {
            console.error('Error getting players:', err);
            throw err;
        }
    }

    async updatePlayerPoints(roomId) {
        const query = 'UPDATE Players_Web3 SET point = "?" WHERE room_id = $1';
        const values = [roomId];

        try {
            const result = await client.query(query, values);

            return result.rows;
        } catch (err) {
            console.error('Error updating player points:', err);
            throw err;
        }
    }

    async sendPlayerVote(vote, player, roomId){
        const query = 'UPDATE Players SET point = $1 WHERE name = $2 AND room_id = $3';
        const values = [vote, player, roomId];

        try {
            const result = await client.query(query, values);

            return result.rows;
        } catch (err) {
            console.error('Error sending player vote:', err);
            throw err;
        }
    }
}

module.exports =  PlayerService;