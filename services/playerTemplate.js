
const DatabaseService = require('./dbServices')

class PlayerService {
    constructor(){
        this.dbServices = new DatabaseService();
    }

    async createPlayer(playerName, roomDataId){

    }
    async removePlayer(playerName, roomDataId) {

    }
    
    async getPlayers(roomDataId) {
    }

    async updatePlayerPoints(playerName, roomDataId, points) {
    }
}

exports.module = new PlayerService;