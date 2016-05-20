var fs = require('fs');

var path = '.';
var excludeDir = ['.c9', '.git', 'node_modules'];
//var filteredArray = [];


module.exports.readDirectory = function(){
    return getDirectories(path);
};

function checkDirectory(path){
   //console.log('checkDirectory out:' + fs.statSync(path).isDirectory());
    return fs.statSync(path).isDirectory();
    
}

function getDirectories(path){
   //debugger;
    var array = fs.readdirSync(path);
    var object = {};
    for(var i = 0; i<array.length; i++){
        //if(excludeDir.indexOf(array[i])>-1) {++i;}
        //excluding more than one directory in a row
        while(excludeDir.indexOf(array[i])>-1) {++i;}
        
        if(checkDirectory(path + '/' + array[i])){
            object[array[i]] = {
                children: getDirectories(path + '/' + array[i]),
                isDir: true,
                path: path.replace(__dirname, '') +'/'+ array[i]
               
            };
        }else{
            object[array[i]] = {
                isDir: false,
                path: path.replace(__dirname, '') +'/'+ array[i]
            };
        }
    }
   
    return object;
}