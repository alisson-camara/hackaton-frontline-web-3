class IDatabase{
    async query(text, params){
        throw new Error('Method not implemented');
    }
    async close(){
        throw new Error('Method not implemented');
    }
}

module.exports = IDatabase;