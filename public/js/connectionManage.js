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
	//console.log (xhr.responseText);
  } else {
  	console.log(xhr.status + ': ' + xhr.statusText);
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
	xhr.onreadystatechange = function(){handleResponse(xhr, cb);};
	xhr.open('POST', url, true);
	xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
	xhr.send(JSON.stringify(postObj));
}
	
function getFileList(path) {
	getQuery(connectionManager.serverURL+path, function(responce){ 
		/*if(responce === "") {
			alert("Server is not responding.");
			return;
		};*/
			
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
		/*if(responce === "") {
			alert("Server is not responding.");
			return;
		};*/
			
		comment.responseFromSrv = JSON.parse(responce);
		if(comment.responseFromSrv.error) {alert(comment.responseFromSrv.error);
		} else {
			console.log(comment.responseFromSrv);
		}
	});
}

function getInfo() {
	getFileList('getfiles');
	getComments('getcomments');
}