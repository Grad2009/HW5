'use strict';

// "polyfill" for IE
function getXhrObject() {
  if (window.XMLHttpRequest) {
    return (new XMLHttpRequest());
  } 
  else if (window.ActiveXObject) {
    return (new window.ActiveXObject("Microsoft.XMLHTTP"));
  } 
  else {
    alert("Ajax is not supported!");
    return; 
  }
}

function handleResponse(xhr, callback) {
  if ((xhr.readyState == 4) && (xhr.status == 200)) {
    callback(xhr.responseText);
	console.log ('From HandleResponse: ' + xhr.responseText);
  } else {
  	console.log(xhr.status + ': ' + xhr.statusText);
  }
}

function handleResponse1(xhr) {
    /*if (xhr.readyState < 4)                         // while waiting response from server
        document.getElementById('div1').innerHTML = "Request/response in progress ...";
    else */ if (xhr.readyState === 4) {                // 4 = Response from server has been completely loaded.
        if (xhr.status == 200 && xhr.status < 300)  // http status between 200 to 299 are all successful
            comment.tmp = xhr.responseText;
			console.log('from handleResponse: ' + comment.tmp);
    }
} 
	
function getQuery(url, cb) {
	var xhr = getXhrObject();
	xhr.onreadystatechange = function(){handleResponse(xhr, cb);};
	xhr.open('GET', url, true);
	xhr.send();
}
	
function postQuery(url, postObj, cb) {
	var xhr = getXhrObject();
	xhr.onreadystatechange = function(){handleResponse1(xhr);};
	xhr.open('POST', url, true);
	xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
	xhr.send(JSON.stringify(postObj));
}
	
function getFileList(path) {
	getQuery(connectionManager.serverURL+path, function(responce){ 
			
		if(responce === "") {
			alert("Server is not responding.");
			return;
		}
			
	var answer = JSON.parse(responce);
	console.log (answer);
		if(answer.error) {alert(answer.error);
		} else {
			  createTree('containerTree', answer);
		}
	});
}

function getComments(path) {
	getQuery(connectionManager.serverURL+path, function(responce){ 
			
		if(responce === "") {
			alert("Server is not responding.");
			return;
		}
			
		comment.responseFromSrv = JSON.parse(responce);
		var resultOfGetComments = comment.responseFromSrv;
		if(comment.responseFromSrv.error) {alert(comment.responseFromSrv.error);
		} else {
			//console.log(comment.responseFromSrv);
			return resultOfGetComments;
		}
	});
}

/*function asyncGetComments(path) {
	return new Promise(function(resolve, reject) {
		if (getComments(path)) {
			resolve(comment.responseFromSrv);
		} else {
			var error  = xhr.status;
			reject(error);
		}
	})
}*/

function getInfo() {
	getFileList('getfiles');
	getComments('getcomments');
}