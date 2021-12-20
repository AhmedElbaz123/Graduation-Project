const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
let _db;

const mongoConnect = callback => {
    MongoClient.connect('mongodb+srv://Graduatenum1:9qb2gSvMdPrFrMC@cluster0.bwlfg.mongodb.net/SHOP?retryWrites=true&w=majority'
    )
    .then(client => {
        console.log('connected!!!!')
        _db = client.db();
        callback();
    })
    .catch(err => {
        console.log(err);
        console.log('not connected');
    });
};

const getDb = () => {
    if(_db) {
        return _db;
    }
    throw 'No DataBase Found';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;