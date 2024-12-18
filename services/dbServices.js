const { Pool } = require('pg');
const IDatabase = require('../interfaces/IDatabase');

class DatabaseService extends IDatabase{
    constructor(){
        super();
        
        this.pool = new Pool({
            connectionString: "postgres://u77jeiqtv7et73:pd2019c6f01ba0ab35f6e444c04278f4ab1cb2e1e53873933d296c9a933619ef0@ccba8a0vn4fb2p.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com:5432/d9bacstqoltq50", ssl: {
                rejectUnauthorized: false,
            },
        });
    }

    async query(text, params) {
        return this.pool.query(text, params);
    }

    async close() {
        return this.pool.end();
    }
}

module.exports = DatabaseService;