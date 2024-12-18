
const DatabaseService = require('./dbServices')

class PlayerService {
    constructor(){
        this.dbServices = new DatabaseService();
    }

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
            const result = await this.dbServices.query(query, values);
            console.log('Player created:', result);
            return result.rows[0];
        } catch (err) {
            console.error('Error creating room:', err);
            throw err;
        }
    }

    async removePlayer(playerName, roomDataId) {

    }
    
    async getPlayers(roomDataId) {
    }

    async updatePlayerPoints(playerName, roomDataId, points) {
    }
}

module.exports =  PlayerService;