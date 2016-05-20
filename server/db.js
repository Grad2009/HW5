var dbClient = require('mongodb').MongoClient,
    assert = require('assert');
    
var dbUrl = 'mongodb://localhost:27017/filebrowser';



module.exports.findDocs = function(path, callback){
    dbClient.connect(dbUrl, function(error, db){
        assert.equal(error, null);
        console.log('connected');
        
        var collection = db.collection('filebrowser');
        var param = {};
        if(path !== null){
            param = {path: path};
        }
        
        collection.find(param).toArray(function(error, docs){
            assert.equal(error, null);
            callback(docs);
            db.close();
        });
    });
};


module.exports.saveComment = function(document, callback){
    dbClient.connect(dbUrl, function(error, db){
        assert.equal(error, null);
        var path = document.path;
        var comment = document.comment;
        //var user = document.user;
        var collection = db.collection('filebrowser');
        if(comment!== ''){
            collection.insertOne({path: path, comment:comment, /*user:user*/}, function(error, result) {
                assert.equal(error, null);
                db.close();
                callback(result);
            });
        }else{
            collection.deleteOne({path:path, /*user:user*/}, function(error,result){
                assert.equal(error, null);
                db.close();
                callback(result);
            });
        }

    });
};

module.exports.delComment = function(document, callback){
    dbClient.connect(dbUrl, function(error, db){
        assert.equal(error, null);
        var path = document.path;
        var comment = document.comment;
        //var user = document.user;
        var collection = db.collection('filebrowser');
        collection.deleteOne({path: path, comment:comment, /*user:user*/}, function(error, result) {
                assert.equal(error, null);
                db.close();
                callback(result);
            });
    });
};

module.exports.editComment = function(document, callback){
    dbClient.connect(dbUrl, function(error, db){
        assert.equal(error, null);
        var path = document.path;
        var comment = document.comment;
        var version = document.version;
        //var user = document.user;
        var collection = db.collection('filebrowser');
        collection.updateOne({path:path, comment:comment/*, user:user*/}, {$set: {comment:version}}, function(error, result) {
                assert.equal(error, null);
                db.close();
                callback(result);
            });
    });
};