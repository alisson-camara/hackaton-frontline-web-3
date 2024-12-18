
const DatabaseService = require('./dbServices')

class PlayerService {
    constructor(){
        this.dbServices = new DatabaseService();
    }

    async createPlayer(moderator, roomDataId){

    }
}

exports.module = new PlayerService;