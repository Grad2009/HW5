var express = require('express');
var cors = require('cors');
var fileReader = require('./server/fileReader.js');
var bodyParser = require('body-parser');
var dbase = require('./server/db.js');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

app.use(function(req, res, next) {
	console.log(`${req.method} request for '${req.url}' - ${JSON.stringify(req.body)}`);
	next();
});

app.use(express.static("./public"));

app.get("/getfiles", cors(), function(req, res){
    res.send(getRespondData());
});

app.get("/getcomments", cors(), function(req, res){
        findDocuments(function(docs){
        res.send(docs);
    });
});


app.post("/postComments", cors(), function(req, res) {
    console.log(req.body);
    commentsArray.push(req.body);
    saveDocument(req.body, function(info){
       console.log("Info: " + info);
       res.send(info);
    });
});

function getRespondData(){
    var data = fileReader.readDirectory();
    //console.log('From getRespondData:' + data);
    var json = JSON.stringify(data);
    //console.log (json);
    return json;
}

function findDocuments(callback){
    dbase.findDocs(null, function(docs){
        callback(JSON.stringify(docs));
    });
}

function saveDocument(document, callback){
    dbase.saveComment(document, function(info){
        callback(info);
    });
}



app.listen(process.env.PORT || 3000);

console.log("Express app running on port 3000");

module.exports = app;