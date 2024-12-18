const { Pool } = require('pg');

class DatabaseService extends IDatabase{
    constructor(){
        super();
        
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL, ssl: {
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

module.exports = new DatabaseService();